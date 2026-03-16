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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database.service");
let ProductsService = class ProductsService {
    db;
    constructor(db) {
        this.db = db;
    }
    async list(tenantId, q) {
        const params = [tenantId];
        let sql = `
      select id, name, sku, category_id, product_type, uom, purchase_price, selling_price,
             reorder_level, barcode, track_batches, status
      from products
      where tenant_id = $1
    `;
        if (q && q.trim()) {
            params.push(`%${q.trim()}%`);
            sql += ` and (name ilike $${params.length} or sku ilike $${params.length})`;
        }
        sql += ' order by created_at desc limit 200';
        const res = await this.db.query(sql, params);
        return res.rows;
    }
    async get(tenantId, id) {
        const res = await this.db.query(`select id, name, sku, category_id, product_type, uom, purchase_price, selling_price,
              reorder_level, barcode, track_batches, status
       from products
       where tenant_id = $1 and id = $2`, [tenantId, id]);
        if (!res.rows.length)
            throw new common_1.NotFoundException('Product not found');
        return res.rows[0];
    }
    async create(tenantId, dto) {
        try {
            const res = await this.db.query(`insert into products(tenant_id, category_id, name, sku, product_type, uom, purchase_price, selling_price,
          reorder_level, barcode, track_batches, status)
         values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
         returning id, name, sku, category_id, product_type, uom, purchase_price, selling_price,
                   reorder_level, barcode, track_batches, status`, [
                tenantId,
                dto.categoryId ?? null,
                dto.name,
                dto.sku,
                dto.productType,
                dto.uom,
                dto.purchasePrice ?? null,
                dto.sellingPrice ?? null,
                dto.reorderLevel ?? null,
                dto.barcode ?? null,
                dto.trackBatches ?? false,
                dto.status ?? 'active',
            ]);
            return res.rows[0];
        }
        catch (err) {
            if (err?.code === '23505') {
                throw new common_1.ConflictException('SKU already exists');
            }
            throw err;
        }
    }
    async update(tenantId, id, dto) {
        const existing = await this.get(tenantId, id);
        const res = await this.db.query(`update products set
        category_id = $1,
        name = $2,
        sku = $3,
        product_type = $4,
        uom = $5,
        purchase_price = $6,
        selling_price = $7,
        reorder_level = $8,
        barcode = $9,
        track_batches = $10,
        status = $11
       where tenant_id = $12 and id = $13
       returning id, name, sku, category_id, product_type, uom, purchase_price, selling_price,
                 reorder_level, barcode, track_batches, status`, [
            dto.categoryId ?? existing.category_id,
            dto.name ?? existing.name,
            dto.sku ?? existing.sku,
            dto.productType ?? existing.product_type,
            dto.uom ?? existing.uom,
            dto.purchasePrice ?? existing.purchase_price,
            dto.sellingPrice ?? existing.selling_price,
            dto.reorderLevel ?? existing.reorder_level,
            dto.barcode ?? existing.barcode,
            dto.trackBatches ?? existing.track_batches,
            dto.status ?? existing.status,
            tenantId,
            id,
        ]);
        return res.rows[0];
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], ProductsService);
