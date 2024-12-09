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
  await app.listen(process.env.PORT ?? 3000);
  const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
  })
  const config = app.get(ConfigService)
  app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')));
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));
  app.enableCors({
    origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
    credentials: true,
    exposedHeaders: ['Set-Cookie'],
  })
  app.use(session({
    secret: config.getOrThrow<string>('SESSION_SECRET'),
    name: config.getOrThrow<string>('SESSION_NAME'),
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: config.getOrThrow<string>('SESSION_SECURE') === 'true',
      httpOnly: config.getOrThrow<string>('SESSION_HTTP_ONLY') === 'true', 
      maxAge: Number(config.getOrThrow<string>('SESSION_EXPIRATION')),
      sameSite: 'lax',
    },
    store: new RedisStore({
      client: redis,
      ttl: Number(config.getOrThrow<string>('SESSION_EXPIRATION')),
      prefix: config.getOrThrow<string>('SESSION_PREFIX'),
    })
  }));

}
bootstrap();
