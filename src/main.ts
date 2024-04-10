import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

import { AppModule } from './app.module';
import { env } from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/')

  app.useGlobalPipes(
    new ValidationPipe({
       whitelist: true,
      // forbidNonWhitelisted: true,
      // transform: true,
      // transformOptions: {
      //   enableImplicitConversion: true
      // }
    })
  )

  const config = new DocumentBuilder()
    .setTitle('Teslo RESTFul API')
    .setDescription('Teslo shop endpoint')
    .setVersion('1.0')
    //.addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(process.env.PORT);
  
  const env = process.env.ENV.padEnd(18, ' ');

  console.log(`
╔══════════════════════════╗
║ @org: Profaxno Company   ║
║ @app: teslo-shop         ║
║ @env: ${env} ║
╚══════════════════════════╝

running at PORT: ${process.env.PORT}...`
  );

}
bootstrap();
