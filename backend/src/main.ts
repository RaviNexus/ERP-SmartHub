import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ConfigService } from './config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = app.get(ConfigService);
  app.enableCors({ origin: config.corsOrigin ?? true, credentials: true });

  await app.listen(config.port);
  // eslint-disable-next-line no-console
  console.log(`${config.appName} listening on http://localhost:${config.port}`);
}

bootstrap();