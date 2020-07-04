import { Application, Middleware } from 'https://deno.land/x/oak/mod.ts';

interface MiddlewareObject {
  [s: string]: Middleware
}

interface IApplication {
  app: Application
  coreMiddlewares: MiddlewareObject
  loadMiddlewares: () => Promise<void>
}

class GalenApplication implements IApplication {
  public coreMiddlewares: MiddlewareObject
  public app: Application
  constructor (app: Application, coreMiddlewares: MiddlewareObject) {
    this.app = app
    this.coreMiddlewares = coreMiddlewares
  }

  public async loadMiddlewares () {
    await Object.keys(this.coreMiddlewares).reduce(async (promise, key) => {
      await promise
      this.app.use(this.coreMiddlewares[key])
    }, Promise.resolve())
  }
}

export default GalenApplication
