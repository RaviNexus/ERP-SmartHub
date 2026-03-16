import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createProduct, getProduct, updateProduct } from '../lib/products';

const steps = ['Basic Info', 'Pricing & Tax', 'Stock & Warehouse', 'Variants & Batch'];

type FormState = {
  name: string;
  sku: string;
  productType: string;
  uom: string;
  purchasePrice: string;
  sellingPrice: string;
  reorderLevel: string;
  barcode: string;
  trackBatches: boolean;
  status: 'active' | 'inactive';
};

const emptyForm: FormState = {
  name: '',
  sku: '',
  productType: 'physical',
  uom: 'Piece',
  purchasePrice: '',
  sellingPrice: '',
  reorderLevel: '',
  barcode: '',
  trackBatches: false,
  status: 'active',
};

export default function ProductFormPage({ mode }: { mode: 'create' | 'edit' }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState('');

  const isEdit = mode === 'edit' && !!id;

  const { data: product } = useQuery({
    enabled: isEdit,
    queryKey: ['product', id],
    queryFn: () => getProduct(id as string),
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        sku: product.sku,
        productType: product.product_type,
        uom: product.uom,
        purchasePrice: product.purchase_price?.toString() ?? '',
        sellingPrice: product.selling_price?.toString() ?? '',
        reorderLevel: product.reorder_level?.toString() ?? '',
        barcode: product.barcode ?? '',
        trackBatches: product.track_batches ?? false,
        status: (product.status as 'active' | 'inactive') ?? 'active',
      });
    }
  }, [product]);

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => navigate('/app/inventory'),
    onError: (err: any) => setError(err?.response?.data?.message || 'Failed to create product'),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: any) => updateProduct(id as string, payload),
    onSuccess: () => navigate('/app/inventory'),
    onError: (err: any) => setError(err?.response?.data?.message || 'Failed to update product'),
  });

  const onSave = () => {
    setError('');
    const payload = {
      name: form.name,
      sku: form.sku,
      productType: form.productType,
      uom: form.uom,
      purchasePrice: form.purchasePrice ? Number(form.purchasePrice) : null,
      sellingPrice: form.sellingPrice ? Number(form.sellingPrice) : null,
      reorderLevel: form.reorderLevel ? Number(form.reorderLevel) : null,
      barcode: form.barcode || null,
      trackBatches: form.trackBatches,
      status: form.status,
    };

    if (isEdit) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload as any);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Edit Product' : 'Add New Product'}</div>
          <div className="page-sub">Step-by-step product creation</div>
        </div>
        <div className="page-actions">
          <button className="ghost" onClick={() => navigate('/app/inventory')}>Cancel</button>
          {step > 0 && <button className="secondary" onClick={() => setStep(step - 1)}>Previous</button>}
          {step < steps.length - 1 ? (
            <button className="primary" onClick={() => setStep(step + 1)}>Next</button>
          ) : (
            <button className="primary" onClick={onSave}>
              {isEdit ? 'Save Changes' : 'Save Product'}
            </button>
          )}
        </div>
      </div>

      <div className="stepper">
        {steps.map((label, idx) => (
          <div key={label} className={`step ${idx === step ? 'active' : idx < step ? 'done' : ''}`}>
            <div className="step-circle">{idx < step ? '?' : idx + 1}</div>
            <div className="step-label">{label}</div>
          </div>
        ))}
      </div>

      {error && <div className="alert">{error}</div>}

      <div className="form-layout">
        <div className="form-card">
          {step === 0 && (
            <div className="form-section">
              <h3>Product Identity</h3>
              <div className="form-grid">
                <label className="field">
                  <span>Product name</span>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </label>
                <label className="field">
                  <span>Product code / SKU</span>
                  <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
                </label>
                <label className="field">
                  <span>Product type</span>
                  <select value={form.productType} onChange={(e) => setForm({ ...form, productType: e.target.value })}>
                    <option value="physical">Physical Product</option>
                    <option value="service">Service</option>
                    <option value="digital">Digital</option>
                  </select>
                </label>
                <label className="field">
                  <span>Unit of measure</span>
                  <select value={form.uom} onChange={(e) => setForm({ ...form, uom: e.target.value })}>
                    <option>Piece</option>
                    <option>Kg</option>
                    <option>Litre</option>
                    <option>Box</option>
                  </select>
                </label>
                <label className="field">
                  <span>Barcode</span>
                  <input value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} />
                </label>
                <label className="field span-2">
                  <span>Description</span>
                  <textarea rows={3} placeholder="Describe the product..." />
                </label>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="form-section">
              <h3>Pricing & Tax</h3>
              <div className="form-grid">
                <label className="field">
                  <span>Purchase price (?)</span>
                  <input value={form.purchasePrice} onChange={(e) => setForm({ ...form, purchasePrice: e.target.value })} />
                </label>
                <label className="field">
                  <span>Selling price (?)</span>
                  <input value={form.sellingPrice} onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })} />
                </label>
                <label className="field">
                  <span>Reorder level</span>
                  <input value={form.reorderLevel} onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })} />
                </label>
                <label className="field">
                  <span>Status</span>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as FormState['status'] })}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </label>
              </div>
              <div className="price-preview">
                <div>
                  <div className="preview-value">?{form.sellingPrice || '—'}</div>
                  <div className="preview-label">Selling price</div>
                </div>
                <div>
                  <div className="preview-value">Tax</div>
                  <div className="preview-label">Configure later</div>
                </div>
                <div>
                  <div className="preview-value">?{form.sellingPrice || '—'}</div>
                  <div className="preview-label">Invoice price</div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-section">
              <h3>Stock & Warehouse</h3>
              <div className="form-grid">
                <label className="field">
                  <span>Opening stock</span>
                  <input placeholder="Current stock quantity" />
                </label>
                <label className="field">
                  <span>Default warehouse</span>
                  <select><option>WH-AHM-01</option><option>WH-SRT-01</option></select>
                </label>
                <label className="field">
                  <span>Bin / rack</span>
                  <input placeholder="A-12-3" />
                </label>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-section">
              <h3>Variants & Batch Tracking</h3>
              <div className="form-grid">
                <label className="toggle">
                  <input type="checkbox" checked={form.trackBatches} onChange={(e) => setForm({ ...form, trackBatches: e.target.checked })} />
                  <span>Enable batch tracking</span>
                </label>
                <label className="toggle">
                  <input type="checkbox" />
                  <span>Track expiry dates</span>
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="side-card">
          <div className="side-section">
            <div className="side-title">Product image</div>
            <div className="upload-box">
              <div className="upload-icon">IMG</div>
              <div className="muted">Upload product image</div>
              <button className="ghost">Browse files</button>
            </div>
          </div>
          <div className="side-section">
            <div className="side-title">Settings</div>
            <label className="toggle">
              <input type="checkbox" defaultChecked />
              <span>Is purchasable</span>
            </label>
            <label className="toggle">
              <input type="checkbox" defaultChecked />
              <span>Is sellable</span>
            </label>
            <label className="toggle">
              <input type="checkbox" defaultChecked />
              <span>Active</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}