import {
  Application,
  Context,
  Middleware,
} from "oak";
import buildCrudRemoteMethods from "./model/crud.ts";
import buildRouter from "./buildRouter.ts";
import { IColumn, ISchema, IRemoteMethod } from "./types.ts";

interface MiddlewareObject {
  [s: string]: Middleware;
}

interface IApplication {
  app: Application;
  coreMiddleware: string[];
  coreMiddlewareObj: MiddlewareObject;
  loadMiddleware: () => Promise<void>;
}

class GalenApplication implements IApplication {
  public coreMiddlewareObj: MiddlewareObject;
  public coreMiddleware: string[];
  public app: Application;
  public modelSchema: {
    [s: string]: ISchema;
  };
  public jsonSchema: {
    [s: string]: {
      type: string;
      properties: {
        [s: string]: IColumn;
      };
    };
  };
  public remoteMethods: {
    [s: string]: IRemoteMethod;
  };
  constructor(
    app: Application,
    coreMiddleware: string[],
    coreMiddlewareObj: MiddlewareObject,
  ) {
    this.app = app;
    this.coreMiddleware = coreMiddleware;
    this.coreMiddlewareObj = coreMiddlewareObj;
    this.jsonSchema = {};
    this.modelSchema = {};
    this.remoteMethods = {};
  }

  public async loadMiddleware() {
    // TODO: service controller
    // load models

    const modelDirEntries = await Deno.readDirSync(`${Deno.cwd()}/app/models`);
    for (const entry of modelDirEntries) {
      if (entry.name.endsWith(".json")) {
        const filename = entry.name.slice(0, -5);
        const schema = JSON.parse(
          await Deno.readTextFile(`${Deno.cwd()}/app/models/${entry.name}`),
        ) as ISchema;
        const modelName = filename.charAt(0).toUpperCase() + filename.slice(1);
        const { properties } = schema;
        const crudRemoteMethods = buildCrudRemoteMethods(filename, schema);
        this.remoteMethods = {
          ...this.remoteMethods,
          ...Object.keys(crudRemoteMethods).reduce((acc, key) => ({
            ...acc,
            [`${filename}-${key}`]: crudRemoteMethods[key],
          }), {}),
        };
        this.modelSchema = {
          ...this.modelSchema,
          [modelName]: schema,
        };
        if (properties) {
          this.jsonSchema = {
            ...this.jsonSchema,
            [filename]: {
              type: "object",
              properties,
            },
          };
        }
      }
    }

    let controller = {};
    const controllerDirEntries = await Deno.readDirSync(
      `${Deno.cwd()}/app/controller`,
    );
    for (const entry of controllerDirEntries) {
      if (entry.name.endsWith(".ts")) {
        const module = await import(
          `${Deno.cwd()}/app/controller/${entry.name}`
        );
        controller = {
          ...controller,
          [entry.name.slice(0, -3)]: module.default,
        };
      }
    }

    this.app.use(async (ctx: Context, next: () => Promise<void>) => {
      ctx.state = {
        jsonSchema: this.jsonSchema,
        modelSchema: this.modelSchema,
        remoteMethods: this.remoteMethods,
        controller,
      };
      await next();
    });

    await this.coreMiddleware.reduce(async (promise, key) => {
      await promise;
      if (key === "router") {
        const router = await buildRouter(this.remoteMethods, "/v1");
        this.app.use(router.routes());
        this.app.use(router.allowedMethods());
      }
      this.app.use(this.coreMiddlewareObj[key]);
    }, Promise.resolve());
  }
}

export default GalenApplication;
