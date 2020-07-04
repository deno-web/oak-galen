import { Application, Context } from 'https://deno.land/x/oak/mod.ts';
import GalenApplication from './extendApplication.ts';

const coreMiddleware = {
  timing: async (ctx: Context, next: () => Promise<void>) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.response.headers.set("X-Response-Time", `${ms}ms`);
  },
  loadModel: async (ctx: Context, next: () => Promise<void>) => {
    ctx.state.jsonSchemas = {}
    ctx.state.model = {}
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
        const schema = await Deno.readTextFile(`./app/models/${entry.name}`)
        const { properties } = JSON.parse(schema)
        ctx.state.jsonSchemas = {
          ...ctx.state.jsonSchemas,
          [entry.name.slice(0, -5)]: {
            type: 'object',
            properties
          }
        }
      }
    }
    await next()
  }
}

const server = new GalenApplication(new Application(), coreMiddleware);

export default server;
