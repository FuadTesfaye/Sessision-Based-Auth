import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  const mongoStore = (MongoStore as any).default?.create
    ? (MongoStore as any).default
    : MongoStore;

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'a-very-secret-key',
      resave: false,
      saveUninitialized: false,
      store: mongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/ebre_auth_modern',
        collectionName: 'sessions',
      }),
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      },
    }),
  );

  await app.listen(3001, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
