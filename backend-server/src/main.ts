import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import { Redis } from 'ioredis';
import * as cors from 'cors';
import { RedisStore } from 'connect-redis';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));

  app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')));

  app.enableCors({
    origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
    credentials: true,
    exposedHeaders: ['Set-Cookie'],
  });

  const redis = new Redis({
    host: config.getOrThrow<string>('REDIS_HOST'),
    port: Number(config.getOrThrow<string>('REDIS_PORT')),
    password: config.getOrThrow<string>('REDIS_PASSWORD'),
  });

  const SESSION_TTL = 24 * 60 * 60 * 1000;
  
  app.use(session({
    secret: config.getOrThrow<string>('SESSION_SECRET'),
    name: config.getOrThrow<string>('SESSION_NAME'),
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: config.getOrThrow<string>('SESSION_SECURE') === 'true',
      httpOnly: config.getOrThrow<string>('SESSION_HTTP_ONLY') === 'true', 
      maxAge: SESSION_TTL,
      sameSite: 'lax',
    },
    store: new RedisStore({
      client: redis,
      prefix: 'sess:',
      ttl: SESSION_TTL / 1000,
      disableTouch: false,
    })
  }));

  // Запускаем сервер последним
  await app.listen(Number(config.getOrThrow<string>('APPLICATION_PORT')));
}
bootstrap();
