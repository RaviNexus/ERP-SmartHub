import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../state/authStore';
import Logo from '../components/Logo';

const navItems = [
  { path: '/app', label: 'Dashboard' },
  { path: '/app/crm', label: 'CRM' },
  { path: '/app/inventory', label: 'Inventory' },
  { path: '/app/sales', label: 'Sales' },
  { path: '/app/purchase', label: 'Purchase' },
  { path: '/app/finance', label: 'Finance' },
  { path: '/app/reports', label: 'Reports' },
  { path: '/app/settings', label: 'Settings' },
];

export default function AppShell() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Logo />
        <nav className="nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/app'}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-chip">
            <div className="avatar">{user?.full_name?.[0] || 'A'}</div>
            <div>
              <div className="user-name">{user?.full_name || 'Admin'}</div>
              <div className="user-role">Super Admin</div>
            </div>
          </div>
          <button className="secondary" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <div className="top-title">SmartHub ERP</div>
            <div className="top-sub">Unified operations workspace</div>
          </div>
          <div className="top-actions">
            <input className="search" placeholder="Search orders, SKUs, invoices…" />
            <button className="ghost">New</button>
          </div>
        </header>
        <section className="content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}