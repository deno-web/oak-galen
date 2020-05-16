export interface IRemoteMethod {
  path: string;
  method: string;
  tags?: string[];
  summary?: string;
  query?: {
    [s: string]: {
      type: string;
      description?: string;
    }
  };
  params?: {
    [s: string]: {
      type: string;
      description?: string;
    }
  };
  requestBody?: {
    body?: {
      [s: string]: {
        type: string;
        description?: string;
      }
    },
    required?: string[];
  },
  output: {
    [n: number]: {
      type: string;
      result?: Object;
    }
  } 
}

export interface ISchema {
  description?: string;
  model: {
    [s: string]: {
      type: string;
      length?: number;
      description?: string;
    }
  },
  required?: string[];
  remoteMethods?: IRemoteMethod[];
}
