import { Context } from 'https://deno.land/x/oak/mod.ts';

export default class User {
  static async index(ctx: Context): Promise<Object> {
    return {
      total: 0,
      data: []
    }
  }
}
