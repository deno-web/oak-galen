import app from './framework/index.ts';
import config from './config/index.ts';

const bootstrap = async () => {
  app.use((ctx) => {
    ctx.response.body = "Hello World!";
  });
  
  console.log(`Start listening on ${config.port}`);
  await app.listen({ port: config.port });
}

bootstrap();
