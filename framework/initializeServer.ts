import { Application, Context } from 'https://deno.land/x/oak/mod.ts';
import GalenApplication from './extendApplication.ts';

const coreMiddleware = {
  timing: async (ctx: Context, next: () => Promise<void>) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.response.headers.set("X-Response-Time", `${ms}ms`);
  }
}

const server = new GalenApplication(new Application(), coreMiddleware);

export default server;
