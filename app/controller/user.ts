import { Context } from "oak";

export default class User {
  static async index(ctx: Context): Promise<Object> {
    return {
      total: 0,
      data: [],
    };
  }

  static async create(ctx: Context): Promise<Object> {
    return {};
  }

  static async show(ctx: Context): Promise<Object> {
    return {};
  }

  static async update(ctx: Context): Promise<Number> {
    return 1;
  }

  static async destroy(ctx: Context): Promise<Number> {
    return 1;
  }
}
