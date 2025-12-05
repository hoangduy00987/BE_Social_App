import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const uploadsPath = join(__dirname, '..', '..', 'uploads');
  console.log('📁 Serving static files from:', uploadsPath);
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
  });
  
  // Enable CORS with environment variables
  const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [];

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(3000);
  console.log('🚀 Server running on http://localhost:3000');
}
bootstrap();
