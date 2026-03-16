import { Controller, Get, Param, Post, Body, Patch, Query, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from '../swagger.decorators';

@ApiTags('products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @ApiOkResponse({ description: 'List products' })
  @Get()
  list(@Req() req: Request, @Query('q') q?: string) {
    const tenantId = (req as any).user?.tenantId as string;
    return this.products.list(tenantId, q);
  }

  @ApiOkResponse({ description: 'Get product' })
  @Get(':id')
  get(@Req() req: Request, @Param('id') id: string) {
    const tenantId = (req as any).user?.tenantId as string;
    return this.products.get(tenantId, id);
  }

  @ApiBody({ type: CreateProductDto })
  @ApiOkResponse({ description: 'Create product' })
  @Post()
  create(@Req() req: Request, @Body() dto: CreateProductDto) {
    const tenantId = (req as any).user?.tenantId as string;
    return this.products.create(tenantId, dto);
  }

  @ApiBody({ type: UpdateProductDto })
  @ApiOkResponse({ description: 'Update product' })
  @Patch(':id')
  update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateProductDto) {
    const tenantId = (req as any).user?.tenantId as string;
    return this.products.update(tenantId, id, dto);
  }
}