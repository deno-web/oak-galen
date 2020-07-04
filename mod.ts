import app from './framework/index.ts';
import config from './config/index.ts';

const bootstrap = async () => {
  // app.use((ctx) => {
  //   ctx.response.body = "Hello World!";
  // });
  app.use(async (ctx) => {
    ctx.state.jsonSchemas = {}
    const modelDirEntries = await Deno.readDirSync('./app/models')
    for (const entry of modelDirEntries) {
      if (entry.name.endsWith('.json')) {
        const schema = await Deno.readTextFile(`./app/models/${entry.name}`)
        ctx.state.jsonSchemas = {
          ...ctx.state.jsonSchemas,
          [entry.name]: JSON.parse(schema)
        }
      }
    }
    ctx.response.body = "Hello World!";
  })
  console.log(`Start listening on ${config.port}`);
  await app.listen({ port: config.port });
}

bootstrap();
