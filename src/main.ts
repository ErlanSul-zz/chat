import { NestFactory } from '@nestjs/core';
import { AppModule, configService } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(
    session({
      secret: 'keyboard',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.useStaticAssets(join(__dirname, '..', 'static'));
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(configService.serverPort, configService.serverHost);
}

void bootstrap().then(() => {
  //
});
