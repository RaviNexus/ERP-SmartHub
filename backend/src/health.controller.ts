import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { RedisService } from './redis.service';
import { KafkaService } from './kafka.service';
import { ConfigService } from './config.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly db: DatabaseService,
    private readonly redis: RedisService,
    private readonly kafka: KafkaService,
    private readonly config: ConfigService,
  ) {}

  @Get()
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
}