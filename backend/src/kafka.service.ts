import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Admin } from 'kafkajs';
import { ConfigService } from './config.service';

@Injectable()
export class KafkaService implements OnModuleDestroy {
  private readonly admin: Admin;
  private readonly kafka: Kafka;

  constructor(config: ConfigService) {
    this.kafka = new Kafka({ clientId: config.appName, brokers: config.kafkaBrokers });
    this.admin = this.kafka.admin();
  }

  async ping(): Promise<boolean> {
    await this.admin.connect();
    await this.admin.listTopics();
    await this.admin.disconnect();
    return true;
  }

  async onModuleDestroy() {
    try {
      await this.admin.disconnect();
    } catch (err) {
      // ignore disconnect errors during shutdown
    }
  }
}