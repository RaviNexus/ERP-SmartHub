import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly db: DatabaseService) {}

  async list(tenantId: string, q?: string) {
    const params: any[] = [tenantId];
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

  async get(tenantId: string, id: string) {
    const res = await this.db.query(
      `select id, name, sku, category_id, product_type, uom, purchase_price, selling_price,
              reorder_level, barcode, track_batches, status
       from products
       where tenant_id = $1 and id = $2`,
      [tenantId, id],
    );
    if (!res.rows.length) throw new NotFoundException('Product not found');
    return res.rows[0];
  }

  async create(tenantId: string, dto: CreateProductDto) {
    try {
      const res = await this.db.query(
        `insert into products(tenant_id, category_id, name, sku, product_type, uom, purchase_price, selling_price,
          reorder_level, barcode, track_batches, status)
         values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
         returning id, name, sku, category_id, product_type, uom, purchase_price, selling_price,
                   reorder_level, barcode, track_batches, status`,
        [
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
        ],
      );
      return res.rows[0];
    } catch (err: any) {
      if (err?.code === '23505') {
        throw new ConflictException('SKU already exists');
      }
      throw err;
    }
  }

  async update(tenantId: string, id: string, dto: UpdateProductDto) {
    const existing = await this.get(tenantId, id);
    const res = await this.db.query(
      `update products set
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
                 reorder_level, barcode, track_batches, status`,
      [
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
      ],
    );
    return res.rows[0];
  }
}