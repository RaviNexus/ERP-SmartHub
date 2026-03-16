import { Injectable } from '@nestjs/common';
import { Env, loadEnv } from './env';

@Injectable()
export class ConfigService {
  private readonly env: Env = loadEnv();

  get appName() {
    return this.env.APP_NAME;
  }

  get port() {
    return this.env.PORT;
  }

  get databaseUrl() {
    return this.env.DATABASE_URL;
  }

  get redisUrl() {
    return this.env.REDIS_URL;
  }

  get kafkaBrokers() {
    return this.env.kafkaBrokersList;
  }

  get corsOrigin() {
    return this.env.CORS_ORIGIN;
  }

  get jwtSecret() {
    return this.env.JWT_SECRET;
  }

  get jwtExpires() {
    return this.env.JWT_EXPIRES;
  }

  get swaggerEnabled() {
    return this.env.SWAGGER_ENABLED === 'true';
  }

  get swaggerPath() {
    return this.env.SWAGGER_PATH;
  }
}