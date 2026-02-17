import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Configuração de CORS
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  // Global prefix para API
  const apiPrefix = configService.get<string>('API_PREFIX') || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // Validation Pipe global (class-validator)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove campos não definidos nos DTOs
      forbidNonWhitelisted: true, // Retorna erro se houver campos extras
      transform: true, // Transforma payloads em instâncias de DTOs
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('SoftFit API')
    .setDescription(
      'API do SoftFit - Plataforma de gerenciamento nutricional e treinos com IA',
    )
    .setVersion('1.0')
    .addTag('auth', 'Autenticação e registro')
    .addTag('users', 'Gerenciamento de usuários')
    .addTag('meals', 'Gerenciamento de refeições')
    .addTag('workouts', 'Gerenciamento de treinos')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document);

  // Iniciar servidor
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}/${apiPrefix}`);
  logger.log(`📚 Swagger documentation: http://localhost:${port}/${apiPrefix}/docs`);
  logger.log(`🌍 Environment: ${configService.get<string>('NODE_ENV')}`);
}

bootstrap();
