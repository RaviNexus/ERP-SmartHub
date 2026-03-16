"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEnv = void 0;
require("dotenv/config");
const zod_1 = require("zod");
const schema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'test', 'production']).default('development'),
    APP_NAME: zod_1.z.string().min(1).default('smarthub-erp'),
    PORT: zod_1.z.coerce.number().int().min(1).max(65535).default(3000),
    DATABASE_URL: zod_1.z.string().url(),
    REDIS_URL: zod_1.z.string().url(),
    KAFKA_BROKERS: zod_1.z.string().min(1),
    CORS_ORIGIN: zod_1.z.string().optional(),
    OTEL_EXPORTER_OTLP_ENDPOINT: zod_1.z.string().optional(),
    JWT_SECRET: zod_1.z.string().min(10).default('dev-secret-change-me'),
    JWT_EXPIRES: zod_1.z.string().default('1h'),
    SWAGGER_ENABLED: zod_1.z.enum(['true', 'false']).default('true'),
    SWAGGER_PATH: zod_1.z.string().default('docs'),
});
const loadEnv = () => {
    const parsed = schema.safeParse(process.env);
    if (!parsed.success) {
        const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
        throw new Error(`Invalid environment: ${issues}`);
    }
    const env = parsed.data;
    const kafkaBrokersList = env.KAFKA_BROKERS.split(',').map((b) => b.trim()).filter(Boolean);
    return { ...env, kafkaBrokersList };
};
exports.loadEnv = loadEnv;
