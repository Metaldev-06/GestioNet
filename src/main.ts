import { NestFactory } from '@nestjs/core';

import { envs } from './config/envs';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggerHelper } from './common/helpers';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = envs.port;

  app.enableCors();
  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(PORT);

  LoggerHelper(
    `Server running on http://localhost:${PORT}/api/v1`,
    'Bootstrap',
  );
}
bootstrap();
