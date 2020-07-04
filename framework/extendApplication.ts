import { Application, Middleware } from 'https://deno.land/x/oak/mod.ts';

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
    await Object.keys(this.coreMiddleware).reduce(async (promise, key) => {
      await promise
      this.app.use(this.coreMiddleware[key])
    }, Promise.resolve())
  }
}

export default GalenApplication
