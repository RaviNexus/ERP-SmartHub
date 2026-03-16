import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config.module';
import { DatabaseService } from './database.service';
import { RedisService } from './redis.service';
import { KafkaService } from './kafka.service';
import { HealthController } from './health.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule, AuthModule],
  controllers: [AppController, HealthController],
  providers: [AppService, DatabaseService, RedisService, KafkaService],
})
export class AppModule {}