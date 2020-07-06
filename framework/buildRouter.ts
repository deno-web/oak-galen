import { Router, Context } from "https://deno.land/x/oak/mod.ts";
import { IRemoteMethod } from "./types.ts";

const controllerHandler = (modelName: string, handler: string) => {
  return async (ctx: Context) => {
    if (ctx.state.controller[modelName] && ctx.state.controller[modelName][handler]) {
      ctx.response.body = {
        message: "success",
        code: 0,
        result: await ctx.state.controller[modelName][handler](ctx),
      };
    } else {
      ctx.response.body = {
        message: "error",
        code: 404,
      };
    }
  };
};

export default async (
  remoteMethods: { [s: string]: IRemoteMethod },
  prefix: string,
) => {
  const router = new Router();
  router.get("/", (ctx: Context) => {
    ctx.response.body = "Hello, Galen!";
  });
  await Object.keys(remoteMethods).reduce(async (promise, key) => {
    await promise;
    const [modelName, handler] = key.split("-");
    if (/^[A-Z]/.test(handler)) {
      return;
    }
    const { path, method } = remoteMethods[key];
    // TODO: validate roles, params and requestBody
    if (["get", "GET"].includes(method)) {
      router.get(`${prefix}${path}`, controllerHandler(modelName, handler));
    }
    if (["post", "POST"].includes(method)) {
      router.post(`${prefix}${path}`, controllerHandler(modelName, handler));
    }
    if (["put", "PUT"].includes(method)) {
      router.put(`${prefix}${path}`, controllerHandler(modelName, handler));
    }
    if (["delete", "DELETE"].includes(method)) {
      router.delete(`${prefix}${path}`, controllerHandler(modelName, handler));
    }
  }, Promise.resolve());
  return router;
};
