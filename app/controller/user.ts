import { Context } from 'https://deno.land/x/oak/mod.ts';

export default class User {
  static async index(ctx: Context): Promise<Object> {
    return {
      total: 0,
      data: []
    }
  }

  static async create(ctx: Context): Promise<Object> {
    return {}
  }

  static async show(ctx: Context): Promise<Object> {
    return {}
  }

  static async update(ctx: Context): Promise<Object> {
    return 1
  }

  static async destroy(ctx: Context): Promise<Object> {
    return 1
  }
}
