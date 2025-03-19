import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { envs } from './config/envs';
import { AppModule } from './app.module';
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

  const config = new DocumentBuilder()
    .setTitle('GestioNet Documentation')
    .setDescription('The GestioNet API description')
    .setVersion('1.0')
    // .addTag('GestioNet')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(PORT);

  LoggerHelper(
    `Server running on http://localhost:${PORT}/api/v1`,
    'Bootstrap',
  );
}
bootstrap();
