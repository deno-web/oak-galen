import app from './framework';
import config from './config';

const bootstrap = async () => {
  app.use((ctx) => {
    ctx.response.body = "Hello World!";
  });
  
  await app.listen({ port: config.port });
}

bootstrap();
