import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../state/authStore';
import Logo from '../components/Logo';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const status = useAuthStore((s) => s.status);
  const error = useAuthStore((s) => s.error);
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
    navigate('/app');
  };

  return (
    <div className="auth-page">
      <div className="auth-grid">
        <div className="brand-panel">
          <Logo />
          <h1>Own your operations in one calm command center.</h1>
          <p>
            SmartHub ERP unifies product, inventory, finance, and sales so your team can move fast
            without losing control.
          </p>
          <div className="brand-metrics">
            <div>
              <div className="metric-value">99.9%</div>
              <div className="metric-label">Data consistency</div>
            </div>
            <div>
              <div className="metric-value">24/7</div>
              <div className="metric-label">Audit traceability</div>
            </div>
            <div>
              <div className="metric-value">10x</div>
              <div className="metric-label">Faster close</div>
            </div>
          </div>
          <div className="brand-strip">
            <span>Inventory</span>
            <span>Purchasing</span>
            <span>Sales</span>
            <span>Finance</span>
            <span>CRM</span>
          </div>
        </div>

        <div className="form-panel">
          <div className="form-card">
            <h2>Welcome back</h2>
            <p className="muted">Sign in to continue managing your ERP workspace.</p>
            <form onSubmit={onSubmit} className="form-stack">
              <label className="field">
                <span>Email</span>
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label className="field">
                <span>Password</span>
                <div className="input-row">
                  <input
                    type={show ? 'text' : 'password'}
                    placeholder="Your secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="button" className="ghost" onClick={() => setShow((v) => !v)}>
                    {show ? 'Hide' : 'Show'}
                  </button>
                </div>
              </label>
              {error && <div className="alert">{error}</div>}
              <button className="primary" type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
            <div className="form-footer">
              <span>New here?</span>
              <Link to="/signup">Create an account</Link>
            </div>
          </div>
          <div className="trust">
            <div>Secure by design • Role-based access • Full audit trail</div>
          </div>
        </div>
      </div>
    </div>
  );
}