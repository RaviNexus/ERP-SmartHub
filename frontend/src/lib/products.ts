import { api } from './api';

export type Product = {
  id: string;
  name: string;
  sku: string;
  category_id?: string | null;
  product_type: string;
  uom: string;
  purchase_price?: number | null;
  selling_price?: number | null;
  reorder_level?: number | null;
  barcode?: string | null;
  track_batches?: boolean;
  status?: string;
};

export const getProducts = async (q?: string): Promise<Product[]> => {
  const res = await api.get('/products', { params: q ? { q } : {} });
  return res.data as Product[];
};

export const getProduct = async (id: string): Promise<Product> => {
  const res = await api.get(`/products/${id}`);
  return res.data as Product;
};

export const createProduct = async (payload: {
  name: string;
  sku: string;
  productType: string;
  uom: string;
  purchasePrice?: number | null;
  sellingPrice?: number | null;
  reorderLevel?: number | null;
  barcode?: string | null;
  trackBatches?: boolean;
  status?: string;
  categoryId?: string | null;
}) => {
  const res = await api.post('/products', payload);
  return res.data as Product;
};

export const updateProduct = async (id: string, payload: Partial<{
  name: string;
  sku: string;
  productType: string;
  uom: string;
  purchasePrice?: number | null;
  sellingPrice?: number | null;
  reorderLevel?: number | null;
  barcode?: string | null;
  trackBatches?: boolean;
  status?: string;
  categoryId?: string | null;
}>) => {
  const res = await api.patch(`/products/${id}`, payload);
  return res.data as Product;
};