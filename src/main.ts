import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { envs } from './config';
import { ExceptionFilter } from './common';

async function bootstrap() {
  const logger = new Logger('Main-Gateway');

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  )
  app.useGlobalFilters(new ExceptionFilter())
  await app.listen(envs.PORT);

  logger.log(`Gateway listening on port ${envs.PORT}`);
}
bootstrap();
