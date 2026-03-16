import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from './config.service';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: Redis;

  constructor(config: ConfigService) {
    this.client = new Redis(config.redisUrl, { lazyConnect: true });
  }

  async ping(): Promise<boolean> {
    if (!this.client.status || this.client.status === 'end') {
      await this.client.connect();
    }
    const res = await this.client.ping();
    return res === 'PONG';
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}