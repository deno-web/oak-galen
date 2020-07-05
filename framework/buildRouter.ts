import { Router, Context } from "https://deno.land/x/oak/mod.ts";
import{ IRemoteMethod } from './types.ts'



export default async (remoteMethods: { [s: string]: IRemoteMethod }, prefix: string = '/v1') => {
  const router = new Router()
  router.get('/', (ctx: Context) => {
    ctx.response.body = 'Hello, Galen!'
  })
  await Object.keys(remoteMethods).reduce(async (promise, key) => {
    await promise
    const [modelName, handler] = key.split('-')
    if (/^[A-Z]/.test(handler)) {
      return
    }
    const { path, method } = remoteMethods[key]
    // TODO: validate roles, params and requestBody
    if (['get', 'GET'].includes(method)) {
      router.get(`${prefix}${path}`, async (ctx: Context) => {
        if (ctx.state.model[modelName] && ctx.state.model[modelName][handler]) {
          ctx.response.body = await ctx.state.model[modelName][handler]()
        } else {
          ctx.response.body = 'NOT_FOUND_IMPL'
        }
      })
    }
    if (['post', 'POST'].includes(method)) {
      router.post(`${prefix}${path}`, async (ctx: Context) => {
        if (ctx.state.model[modelName] && ctx.state.model[modelName][handler]) {
          ctx.response.body = await ctx.state.model[modelName][handler]()
        } else {
          ctx.response.body = 'NOT_FOUND_IMPL'
        }
      })
    }
    if (['put', 'PUT'].includes(method)) {
      router.put(`${prefix}${path}`, async (ctx: Context) => {
        if (ctx.state.model[modelName] && ctx.state.model[modelName][handler]) {
          ctx.response.body = await ctx.state.model[modelName][handler]()
        } else {
          ctx.response.body = 'NOT_FOUND_IMPL'
        }
      })
    }
    if (['delete', 'DELETE'].includes(method)) {
      router.delete(`${prefix}${path}`, async (ctx: Context) => {
        if (ctx.state.model[modelName] && ctx.state.model[modelName][handler]) {
          ctx.response.body = await ctx.state.model[modelName][handler]()
        } else {
          ctx.response.body = 'NOT_FOUND_IMPL'
        }
      })
    }
  }, Promise.resolve())
  return router
}