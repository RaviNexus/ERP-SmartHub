"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const argon2 = __importStar(require("argon2"));
const database_service_1 = require("../database.service");
const config_service_1 = require("../config.service");
let AuthService = class AuthService {
    db;
    jwt;
    config;
    constructor(db, jwt, config) {
        this.db = db;
        this.jwt = jwt;
        this.config = config;
    }
    async validateUser(email, password) {
        const user = await this.findByEmail(email);
        if (!user)
            return null;
        const ok = await argon2.verify(user.password_hash, password);
        if (!ok)
            return null;
        return user;
    }
    async login(user) {
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
    async signup(dto) {
        const tenantId = await this.ensureTenant();
        const existing = await this.findByEmail(dto.email);
        if (existing) {
            throw new common_1.UnauthorizedException('Email already registered');
        }
        const hash = await argon2.hash(dto.password);
        const res = await this.db.query('insert into users(tenant_id, full_name, email, password_hash, status) values($1,$2,$3,$4,$5) returning id, tenant_id, email, full_name, role_id', [tenantId, dto.fullName, dto.email, hash, 'active']);
        const user = res.rows[0];
        return this.login({ ...user, password_hash: hash });
    }
    async findByEmail(email) {
        const res = await this.db.query('select id, tenant_id, email, full_name, password_hash, role_id from users where email=$1 and status=$2 limit 1', [email, 'active']);
        return res.rows[0];
    }
    async ensureTenant() {
        const existing = await this.db.query('select id from tenants limit 1');
        if (existing.rows.length)
            return existing.rows[0].id;
        const created = await this.db.query('insert into tenants(company_name, subdomain, status) values($1,$2,$3) returning id', ['Default Tenant', 'default', 'active']);
        return created.rows[0].id;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        jwt_1.JwtService,
        config_service_1.ConfigService])
], AuthService);
