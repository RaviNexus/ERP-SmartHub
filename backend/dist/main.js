"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const helmet_1 = __importDefault(require("helmet"));
const app_module_1 = require("./app.module");
const config_service_1 = require("./config.service");
const swagger_1 = require("./swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableShutdownHooks();
    app.use((0, helmet_1.default)());
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    const config = app.get(config_service_1.ConfigService);
    const allowList = new Set(config.corsOrigins);
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
            if (allowList.size === 0)
                return callback(null, true);
            if (allowList.has(origin))
                return callback(null, true);
            return callback(new Error(`CORS blocked for origin: ${origin}`), false);
        },
        credentials: true,
    });
    await (0, swagger_1.setupSwagger)(app, config);
    await app.listen(config.port);
    // eslint-disable-next-line no-console
    console.log(`${config.appName} listening on http://localhost:${config.port}`);
    // eslint-disable-next-line no-console
    console.log(`CORS allowlist: ${allowList.size ? Array.from(allowList).join(', ') : 'ALL'}`);
}
bootstrap();
