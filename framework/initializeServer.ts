import { Application, Context } from "oak";
import GalenApplication from "./extendApplication.ts";

const coreMiddleware = ["timing", "router"];

const coreMiddlewareObj = {
  timing: async (ctx: Context, next: () => Promise<void>) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.response.headers.set("X-Response-Time", `${ms}ms`);
  },
};

const server = new GalenApplication(
  new Application(),
  coreMiddleware,
  coreMiddlewareObj,
);

export default server;
