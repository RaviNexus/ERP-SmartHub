"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("./database.service");
const redis_service_1 = require("./redis.service");
const kafka_service_1 = require("./kafka.service");
const config_service_1 = require("./config.service");
let HealthController = class HealthController {
    db;
    redis;
    kafka;
    config;
    constructor(db, redis, kafka, config) {
        this.db = db;
        this.redis = redis;
        this.kafka = kafka;
        this.config = config;
    }
    async check() {
        const results = await Promise.allSettled([
            this.db.ping(),
            this.redis.ping(),
            this.kafka.ping(),
        ]);
        const [db, redis, kafka] = results.map((r) => r.status === 'fulfilled' && r.value === true);
        return {
            status: db && redis && kafka ? 'ok' : 'degraded',
            app: this.config.appName,
            services: {
                postgres: db ? 'up' : 'down',
                redis: redis ? 'up' : 'down',
                kafka: kafka ? 'up' : 'down',
            },
        };
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "check", null);
exports.HealthController = HealthController = __decorate([
    (0, common_1.Controller)('health'),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        redis_service_1.RedisService,
        kafka_service_1.KafkaService,
        config_service_1.ConfigService])
], HealthController);
