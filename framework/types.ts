export interface IColumn {
  type: string
  description?: string
}

export interface CrudOptions {
  modelName: string
  description: string | undefined
  properties: {
    [s: string]: IColumn
  }
  required: string[]
}

export interface IRemoteMethod {
  path: string
  method: string
  tags?: string[]
  summary?: string
  query?: {
    [s: string]: IColumn
  }
  params?: {
    [s: string]: IColumn
  }
  requestBody?: {
    body?: {
      [s: string]: IColumn
    },
    required?: string[]
  },
  output: {
    [n: number]: {
      type: string
      result?: Object
    }
  } 
}

export interface ISchema {
  description: string | undefined
  dialect: string | undefined
  properties: {
    [s: string]: IColumn
  }
  required: string[] | undefined
  remoteMethods: {
    [s: string]: IRemoteMethod
  }
}

