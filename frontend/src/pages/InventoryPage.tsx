import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../lib/products';

export default function InventoryPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', search],
    queryFn: () => getProducts(search),
  });

  const products = data ?? [];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-title">Products</div>
          <div className="page-sub">{products.length} products</div>
        </div>
        <div className="page-actions">
          <button className="secondary">Import</button>
          <button className="ghost">Print Barcodes</button>
          <button className="primary" onClick={() => navigate('/app/inventory/new')}>Add Product</button>
        </div>
      </div>

      <div className="toolbar">
        <input
          className="search"
          placeholder="Search by name, SKU, barcode..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="toolbar-chip">Category</div>
        <div className="toolbar-chip">Warehouse</div>
        <div className="toolbar-chip">Status</div>
        <div className="toolbar-chip">Sort: Name</div>
      </div>

      <div className="table">
        <div className="table-head">
          <div>Product</div>
          <div>SKU</div>
          <div>Category</div>
          <div>Stock</div>
          <div>Reorder</div>
          <div>Cost</div>
          <div>Sell</div>
          <div>Tax</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        {isLoading && (
          <div className="table-row">
            <div>Loading products…</div>
          </div>
        )}
        {error && (
          <div className="table-row">
            <div>Failed to load products.</div>
          </div>
        )}
        {!isLoading && !products.length && (
          <div className="table-row">
            <div>No products yet. Create your first product.</div>
          </div>
        )}
        {products.map((p) => (
          <div key={p.id} className="table-row">
            <div>
              <div className="row-title">{p.name}</div>
              <div className="muted">Type: {p.product_type}</div>
            </div>
            <div className="chip">{p.sku}</div>
            <div><span className="badge">{p.category_id ? 'Assigned' : 'Uncategorized'}</span></div>
            <div>
              <div className="row-title">—</div>
              <div className="stock-bar">
                <div className="stock-fill" style={{ width: '0%' }} />
              </div>
            </div>
            <div>{p.reorder_level ?? '—'}</div>
            <div>{p.purchase_price != null ? `?${p.purchase_price}` : '—'}</div>
            <div className="price">{p.selling_price != null ? `?${p.selling_price}` : '—'}</div>
            <div><span className="chip">GST</span></div>
            <div><span className={`status ${p.status === 'inactive' ? 'out-of-stock' : 'in-stock'}`}>{p.status ?? 'active'}</span></div>
            <div className="row-actions">
              <button className="ghost" onClick={() => navigate(`/app/inventory/${p.id}/edit`)}>Edit</button>
              <button className="secondary">Stock</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}