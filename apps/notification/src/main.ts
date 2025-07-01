import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  app.init();
  app.enableShutdownHooks(['SIGINT', 'SIGTERM']);
  console.log('Notification service is running');
}
bootstrap();
