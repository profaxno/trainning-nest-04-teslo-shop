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

  await app.listen(3000);
  
  console.log(`
╔══════════════════════════╗
║ @org: Profaxno Company   ║
║ @app: teslo-shop         ║
║ @enviroment: ${`${process.env.ENV}`.padEnd(12, ' ')}║
╚══════════════════════════╝

running at PORT: ${process.env.PORT}...`
  );

}
bootstrap();
