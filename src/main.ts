import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
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
