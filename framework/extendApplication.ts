import { Application, Context, Middleware } from 'https://deno.land/x/oak/mod.ts';
import buildCrudRemoteMethods from './model/crud.ts';
import { ISchema } from './types.ts'

interface MiddlewareObject {
  [s: string]: Middleware
}

interface IApplication {
  app: Application
  coreMiddleware: MiddlewareObject
  loadMiddleware: () => Promise<void>
}

class GalenApplication implements IApplication {
  public coreMiddleware: MiddlewareObject
  public app: Application
  constructor (app: Application, coreMiddleware: MiddlewareObject) {
    this.app = app
    this.coreMiddleware = coreMiddleware
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
      const modelDirEntries = await Deno.readDirSync('./app/models')
      for (const entry of modelDirEntries) {
        if (entry.name.endsWith('.ts')) {
          const module = await import(`${Deno.cwd()}/app/models/${entry.name}`)
          ctx.state.model = {
            ...ctx.state.model,
            [entry.name.slice(0, -3)]: module.default
          }
        }
        if (entry.name.endsWith('.json')) {
          const schemaStr = await Deno.readTextFile(`./app/models/${entry.name}`)
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
      await next()
    })
    await Object.keys(this.coreMiddleware).reduce(async (promise, key) => {
      await promise
      this.app.use(this.coreMiddleware[key])
    }, Promise.resolve())
  }
}

export default GalenApplication
