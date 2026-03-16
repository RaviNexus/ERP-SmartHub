import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, IsIn } from 'class-validator';
import { ApiProperty } from '../../swagger.decorators';

export class CreateProductDto {
  @ApiProperty({ example: 'Office Chair - Ergonomic' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'FURN-CHR-001' })
  @IsString()
  @IsNotEmpty()
  sku!: string;

  @ApiProperty({ example: 'physical' })
  @IsString()
  @IsNotEmpty()
  productType!: string;

  @ApiProperty({ example: 'Piece' })
  @IsString()
  @IsNotEmpty()
  uom!: string;

  @ApiProperty({ required: false, example: 3500 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  purchasePrice?: number;

  @ApiProperty({ required: false, example: 5200 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sellingPrice?: number;

  @ApiProperty({ required: false, example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  reorderLevel?: number;

  @ApiProperty({ required: false, example: 'EAN-13-123456' })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsBoolean()
  trackBatches?: boolean;

  @ApiProperty({ required: false, example: 'active' })
  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: 'active' | 'inactive';

  @ApiProperty({ required: false, example: 'b8c5f2c6-3d1a-4e68-9f41-9b7a1f2b9b12' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}