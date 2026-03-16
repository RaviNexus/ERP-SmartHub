import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from './config.service';
import { DatabaseService } from './database.service';
import { RedisService } from './redis.service';
import { KafkaService } from './kafka.service';
import { HealthController } from './health.controller';

@Module({
  imports: [],
  controllers: [AppController, HealthController],
  providers: [AppService, ConfigService, DatabaseService, RedisService, KafkaService],
})
export class AppModule {}