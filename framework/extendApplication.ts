import { Application, Context, Middleware } from 'https://deno.land/x/oak/mod.ts';
import buildCrudRemoteMethods from './model/crud.ts';
import buildRouter from './buildRouter.ts';
import { ISchema, IRemoteMethod } from './types.ts'

interface MiddlewareObject {
  [s: string]: Middleware
}

interface IApplication {
  app: Application
  coreMiddleware: string[]
  coreMiddlewareObj: MiddlewareObject
  loadMiddleware: () => Promise<void>
}

class GalenApplication implements IApplication {
  public coreMiddlewareObj: MiddlewareObject
  public coreMiddleware: string[]
  public app: Application
  public remoteMethods: {
    [s: string]: IRemoteMethod
  }
  constructor (app: Application, coreMiddleware: string[], coreMiddlewareObj: MiddlewareObject) {
    this.app = app
    this.coreMiddleware = coreMiddleware
    this.coreMiddlewareObj = coreMiddlewareObj
    this.remoteMethods = {}
  }

  public async loadMiddleware () {
    // TODO: service controller
    // load models
    this.app.use(async (ctx: Context, next: () => Promise<void>) => {
      ctx.state = {
        jsonSchema: {},
        model: {},
        remoteMethods: {},
        modelSchema: {}
      }
      const modelDirEntries = await Deno.readDirSync(`${Deno.cwd()}/app/models`)
      for (const entry of modelDirEntries) {
        if (entry.name.endsWith('.ts')) {
          const module = await import(`${Deno.cwd()}/app/models/${entry.name}`)
          ctx.state.model = {
            ...ctx.state.model,
            [entry.name.slice(0, -3)]: module.default
          }
        }
        if (entry.name.endsWith('.json')) {
          const schemaStr = await Deno.readTextFile(`${Deno.cwd()}/app/models/${entry.name}`)
          const filename = entry.name.slice(0, -5)
          const schema = JSON.parse(schemaStr) as ISchema
          const modelName = filename.charAt(0).toUpperCase() + filename.slice(1)
          const { properties } = schema
          const crudRemoteMethods = buildCrudRemoteMethods(filename, schema)
          ctx.state.remoteMethods = {
            ...ctx.state.remoteMethods,
            ...Object.keys(crudRemoteMethods).reduce((acc, key) => ({
              ...acc,
              [`${filename}-${key}`]: crudRemoteMethods[key]
            }), {})
          }
          ctx.state.modelSchema = {
            ...ctx.state.modelSchema,
            [modelName]: schema
          }
          if (properties) {
            ctx.state.jsonSchema = {
              ...ctx.state.jsonSchema,
              [filename]: {
                type: 'object',
                properties
              }
            }
          }
        }
      }
      this.remoteMethods = ctx.state.remoteMethods
      await next()
    })
    await Object.keys(this.coreMiddleware).reduce(async (promise, key) => {
      await promise
      if (key === 'router') {
        const router = await buildRouter(this.remoteMethods)
        this.app.use(router.routes())
        this.app.use(router.allowedMethods())
      }
      this.app.use(this.coreMiddlewareObj[key])
    }, Promise.resolve())
  }
}

export default GalenApplication
