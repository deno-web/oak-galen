import { Application, Middleware } from 'https://deno.land/x/oak/mod.ts';

interface MiddlewareObject {
  [s: string]: Middleware
}

interface IApplication extends Application {
  _coreMiddlewares: MiddlewareObject
}

class GalenApplication extends Application implements IApplication {
  public _coreMiddlewares: MiddlewareObject
  constructor (coreMiddlewares: MiddlewareObject) {
    super()
    this._coreMiddlewares = coreMiddlewares
    }
  }
}

export default GalenApplication
