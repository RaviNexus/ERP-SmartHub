import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { DatabaseService } from '../database.service';
import { ConfigService } from '../config.service';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user) return null;
    const ok = await argon2.verify(user.password_hash, password);
    if (!ok) return null;
    return user;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email, tenantId: user.tenant_id };
    return {
      access_token: this.jwt.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        tenant_id: user.tenant_id,
        role_id: user.role_id,
      },
    };
  }

  async signup(dto: SignupDto) {
    const tenantId = await this.ensureTenant();
    const existing = await this.findByEmail(dto.email);
    if (existing) {
      throw new UnauthorizedException('Email already registered');
    }
    const hash = await argon2.hash(dto.password);
    const res = await this.db.query(
      'insert into users(tenant_id, full_name, email, password_hash, status) values($1,$2,$3,$4,$5) returning id, tenant_id, email, full_name, role_id',
      [tenantId, dto.fullName, dto.email, hash, 'active'],
    );
    const user = res.rows[0];
    return this.login({ ...user, password_hash: hash });
  }

  private async findByEmail(email: string) {
    const res = await this.db.query(
      'select id, tenant_id, email, full_name, password_hash, role_id from users where email=$1 and status=$2 limit 1',
      [email, 'active'],
    );
    return res.rows[0];
  }

  private async ensureTenant(): Promise<string> {
    const existing = await this.db.query('select id from tenants limit 1');
    if (existing.rows.length) return existing.rows[0].id;
    const created = await this.db.query(
      'insert into tenants(company_name, subdomain, status) values($1,$2,$3) returning id',
      ['Default Tenant', 'default', 'active'],
    );
    return created.rows[0].id;
  }
}