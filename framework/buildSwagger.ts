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

interface ApiSchema {
  [s: string]: {
    [s: string]: Object;
  };
}

export default (remoteMethods: IRemoteMethods, jsonSchema: IJsonSchema) => {
  const paths = Object.keys(remoteMethods).reduce(
    (acc: ApiSchema, schemaKey: string) => {
      const {
        path,
        method,
        tags,
        summary,
        params,
        query,
        requestBody,
        output,
      } = remoteMethods[schemaKey];
      const content: Object = {
        tags: tags || ["default"],
        summary: summary || "",
        parameters: [
          ...(query
            ? Object.keys(query).map((key) => {
              return {
                name: key,
                in: "query",
                description: query![key]!.description,
                schema: {
                  type: query![key]!.type,
                },
                required: false,
              };
            })
            : []),
          ...(params
            ? Object.keys(params).map((key) => ({
              name: key,
              in: "path",
              description: params![key]!.description,
              schema: {
                type: params![key]!.type,
              },
              required: true,
            }))
            : []),
        ],
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
        responses: Object.keys(output).reduce((acc: Object, key: string) => {
          return {
            ...acc,
            [key]: {
              description: "response success",
              content: {
                "application/json": {
                  schema: { type: "object", properties: output[key] },
                },
              },
            },
          };
        }, {}),
      };
      if (acc[path] as Object) {
        return {
          ...acc,
          [path]: {
            ...acc[path],
            [method]: content,
          },
        };
      }
      return {
        ...acc,
        [path]: {
          [method]: content,
        },
      };
    },
    {},
  );
  return {
    openapi: "3.0.0",
    info: {
      title: "Oak-galen API document",
      version: "v3",
      description: "Using swagger3.0 & oak to generate document",
      contact: {
        name: "AlfieriChou",
        email: "alfierichou@gmail.com",
        url: "https://github.com/AlfieriChou",
      },
      license: {
        name: "MIT",
        url: "https://github.com/deno-web/oak-galen/blob/master/LICENSE",
      },
    },
    paths,
    components: {
      schemas: jsonSchema,
    },
  };
};
