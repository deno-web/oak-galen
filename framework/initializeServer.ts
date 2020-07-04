import { Application, Context } from 'https://deno.land/x/oak/mod.ts';
import GalenApplication from './extendApplication.ts';

const coreMiddlewares = {
  timing: async (ctx: Context, next: () => Promise<void>) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.response.headers.set("X-Response-Time", `${ms}ms`);
  },
  loadModel: async (ctx: Context, next: () => Promise<void>) => {
    ctx.state.jsonSchemas = {}
    const modelDirEntries = await Deno.readDirSync('./app/models')
    for (const entry of modelDirEntries) {
      if (entry.name.endsWith('.json')) {
        const schema = await Deno.readTextFile(`./app/models/${entry.name}`)
        ctx.state.jsonSchemas = {
          ...ctx.state.jsonSchemas,
          [entry.name]: JSON.parse(schema)
        }
      }
    }
    await next()
  }
}

const server = new GalenApplication(new Application(), coreMiddlewares);

export default server;
