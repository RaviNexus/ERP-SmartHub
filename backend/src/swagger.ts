import { INestApplication } from '@nestjs/common';
import { ConfigService } from './config.service';

export const setupSwagger = async (app: INestApplication, config: ConfigService) => {
  if (!config.swaggerEnabled) return;

  try {
    // Lazy-load so builds can succeed even if the package is not installed yet.
    const swagger = await import('@nestjs/swagger');
    const builder = new swagger.DocumentBuilder()
      .setTitle('SmartHub ERP API')
      .setDescription('ERP backend API documentation')
      .setVersion('0.0.1')
      .addBearerAuth();

    const document = swagger.SwaggerModule.createDocument(app, builder.build());
    swagger.SwaggerModule.setup(config.swaggerPath, app, document);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Swagger disabled (package not installed).');
  }
};