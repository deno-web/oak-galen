import { IRemoteMethod, IColumn } from "./types.ts";

interface IRemoteMethods {
  [s: string]: IRemoteMethod;
}

interface IJsonSchema {
  [s: string]: {
    type: string;
    properties: {
      [s: string]: IColumn;
    };
  };
}

// const resTypeList = ['array', 'object', 'number', 'string', 'html']

export default (remoteMethods: IRemoteMethods, jsonSchema: IJsonSchema) => {
  const paths = Object.keys(remoteMethods).reduce((acc, schemaKey: string) => {
    const {
      path,
      method,
      tags,
      summary,
      requestBody,
    } = remoteMethods[schemaKey];
    const content: Object = {
      tags: tags || ["default"],
      summary: summary || "",
      parameters: {},
      requestBody: requestBody
        ? {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: requestBody.body,
                required: requestBody.required,
              },
            },
          },
        }
        : undefined,
      responses: {},
    };
    return {
      ...acc,
      [path]: {
        [method]: content,
      },
    };
  }, {});
  return {
    openapi: "3.0.0",
    info: {
      title: "Koa-galen API document",
      version: "v3",
      description: "Using swagger3.0 & sequelize to generate document",
      contact: {
        name: "AlfieriChou",
        email: "alfierichou@gmail.com",
        url: "https://github.com/AlfieriChou/koa-galen",
      },
      license: {
        name: "MIT",
        url: "https://github.com/AlfieriChou/koa-galen/blob/master/LICENSE",
      },
    },
    paths,
    components: {
      jsonSchema,
    },
  };
};
