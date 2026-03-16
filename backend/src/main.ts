import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ConfigService } from './config.service';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = app.get(ConfigService);
  const allowList = new Set(config.corsOrigins);

  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin) return callback(null, true);
      if (allowList.size === 0) return callback(null, true);
      if (allowList.has(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    credentials: true,
  });

  await setupSwagger(app, config);

  await app.listen(config.port);
  // eslint-disable-next-line no-console
  console.log(`${config.appName} listening on http://localhost:${config.port}`);
  // eslint-disable-next-line no-console
  console.log(`CORS allowlist: ${allowList.size ? Array.from(allowList).join(', ') : 'ALL'}`);
}

bootstrap();