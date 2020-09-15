import { ISchema, CrudOptions, IRemoteMethod } from "../types.ts";

const buildCrudRemoteMethods = (
  options: CrudOptions,
): { [s: string]: IRemoteMethod } => {
  const { modelName, description = modelName, properties, required = [] } =
    options;
  return {
    index: {
      path: `/${modelName}`,
      method: "get",
      tags: [`${modelName}`],
      summary: `获取${description}列表`,
      query: {
        where: { type: "json", description: "搜索条件 例如：where={}" },
        order: {
          type: "array",
          description: '排序 例如：order=[["createdAt","desc"]]',
        },
        attribute: { type: "array", description: '返回字段控制 例如：attribute=["id"]' },
        include: {
          type: "array",
          description: '关联表 关联查询 例如：include=[{"model":"UserRole"}]',
        },
        offset: { type: "integer", description: "分页偏移量 例如：offset=0" },
        limit: { type: "integer", description: "分页数量 例如：limit=20" },
      },
      output: {
        200: {
          count: { type: "integer", description: "总数" },
          offset: { type: "integer", description: "偏移量" },
          limit: { type: "integer", description: "限制数量" },
          data: {
            type: "array",
            items: { type: "object", properties },
            description: "数据",
          },
        },
      },
    },
    create: {
      path: `/${modelName}`,
      method: "post",
      tags: [`${modelName}`],
      summary: `创建${description}`,
      requestBody: {
        body: Object.keys(properties).reduce((acc, key) => {
          if (["id", "createdAt", "updatedAt", "deletedAt"].includes(key)) {
            return acc;
          }
          return { ...acc, [key]: properties[key] };
        }, {}),
        required,
      },
      output: {
        200: properties,
      },
    },
    show: {
      path: `/${modelName}/:id`,
      method: "get",
      tags: [`${modelName}`],
      summary: `获取${description}详情`,
      params: {
        id: {
          type: properties["id"].type,
          description: properties["id"].description,
        },
      },
      output: {
        200: properties,
      },
    },
    update: {
      path: `/${modelName}/:id`,
      method: "put",
      tags: [`${modelName}`],
      summary: `修改${description}信息`,
      params: {
        id: {
          type: properties["id"].type,
          description: properties["id"].description,
        },
      },
      requestBody: {
        body: Object.keys(properties).reduce((acc, key) => {
          if (["id", "createdAt", "updatedAt", "deletedAt"].includes(key)) {
            return acc;
          }
          return { ...acc, [key]: properties[key] };
        }, {}),
      },
      output: {
        200: {
          type: "number",
        },
      },
    },
    destroy: {
      path: `/${modelName}/:id`,
      method: "delete",
      tags: [`${modelName}`],
      summary: `删除${description}`,
      params: {
        id: {
          type: properties["id"].type,
          description: properties["id"].description,
        },
      },
      output: {
        200: {
          type: "number",
        },
      },
    },
  };
};

export default (
  modelName: string,
  schema: ISchema,
): { [s: string]: IRemoteMethod } => {
  const { dialect, remoteMethods = {} } = schema;
  if (dialect && dialect === "virtual") {
    return remoteMethods;
  }
  const crudRemoteMethods = buildCrudRemoteMethods({
    modelName,
    description: schema.description || modelName,
    properties: schema.properties,
    required: schema.required || [],
  });
  return {
    ...crudRemoteMethods,
    ...Object.keys(remoteMethods).reduce((acc, key) => {
      if (crudRemoteMethods[key]) {
        return {
          ...acc,
          [key]: {
            ...crudRemoteMethods[key],
            ...remoteMethods[key],
          },
        };
      }
      return {
        ...acc,
        [key]: remoteMethods[key],
      };
    }, {}),
  };
};
