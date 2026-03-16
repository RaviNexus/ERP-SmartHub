import React from 'react';

export default function DashboardPage() {
  return (
    <div className="dashboard">
      <div className="hero-card">
        <div>
          <h1>Today at a glance</h1>
          <p>Live signals from inventory, sales, and finance are ready for action.</p>
        </div>
        <button className="primary">Review alerts</button>
      </div>

      <div className="grid">
        <div className="stat-card">
          <div className="stat-label">Open Sales Orders</div>
          <div className="stat-value">24</div>
          <div className="stat-sub">3 awaiting approval</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Inventory at Risk</div>
          <div className="stat-value">12</div>
          <div className="stat-sub">SKUs below reorder</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Cash Position</div>
          <div className="stat-value">?18.4L</div>
          <div className="stat-sub">+8% vs last week</div>
        </div>
      </div>

      <div className="panel">
        <h2>Worklist</h2>
        <div className="panel-row">
          <div>
            <div className="panel-title">Approve PO-2026-0012</div>
            <div className="muted">Vendor: National Office Supplies • ?88,000</div>
          </div>
          <button className="secondary">Review</button>
        </div>
        <div className="panel-row">
          <div>
            <div className="panel-title">Close GRN-2026-033</div>
            <div className="muted">2 items received • Warehouse WH-AHM-01</div>
          </div>
          <button className="secondary">Verify</button>
        </div>
      </div>
    </div>
  );
}