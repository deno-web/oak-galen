import server from './framework/index.ts';
import config from './config/index.ts';

const bootstrap = async () => {
  // app.use((ctx) => {
  //   ctx.response.body = "Hello World!";
  // });
  await server.loadMiddlewares()
  console.log(`Start listening on ${config.port}`);
  await server.app.listen({ port: config.port });
}

bootstrap();
