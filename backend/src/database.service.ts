import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';
import { ConfigService } from './config.service';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly pool: Pool;

  constructor(config: ConfigService) {
    this.pool = new Pool({ connectionString: config.databaseUrl });
  }

  async ping(): Promise<boolean> {
    const result = await this.pool.query('select 1');
    return result.rowCount === 1;
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}