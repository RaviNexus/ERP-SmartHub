import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../state/authStore';
import Logo from '../components/Logo';

export default function SignupPage() {
  const navigate = useNavigate();
  const signup = useAuthStore((s) => s.signup);
  const status = useAuthStore((s) => s.status);
  const error = useAuthStore((s) => s.error);
  const [show, setShow] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [localError, setLocalError] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setLocalError('Passwords do not match');
      return;
    }
    setLocalError('');
    await signup({ fullName, email, password });
    navigate('/app');
  };

  return (
    <div className="auth-page">
      <div className="auth-grid">
        <div className="brand-panel alt">
          <Logo />
          <h1>Build the ERP your team actually enjoys using.</h1>
          <p>
            Start with core modules and scale into purchasing, finance, and operations with clean
            workflows and modern analytics.
          </p>
          <ul className="brand-list">
            <li>Unified ledgers and inventory movements</li>
            <li>Configurable approvals and audit trails</li>
            <li>Fast, responsive UI built for operators</li>
          </ul>
        </div>

        <div className="form-panel">
          <div className="form-card">
            <h2>Create your workspace</h2>
            <p className="muted">Spin up your ERP tenant in minutes.</p>
            <form onSubmit={onSubmit} className="form-stack">
              <label className="field">
                <span>Full name</span>
                <input
                  type="text"
                  placeholder="Asha Verma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </label>
              <label className="field">
                <span>Email</span>
                <input
                  type="email"
                  placeholder="asha@company.com"
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
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="button" className="ghost" onClick={() => setShow((v) => !v)}>
                    {show ? 'Hide' : 'Show'}
                  </button>
                </div>
              </label>
              <label className="field">
                <span>Confirm password</span>
                <input
                  type="password"
                  placeholder="Re-enter password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </label>
              {(localError || error) && <div className="alert">{localError || error}</div>}
              <button className="primary" type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Creating account…' : 'Create account'}
              </button>
            </form>
            <div className="form-footer">
              <span>Already have an account?</span>
              <Link to="/login">Sign in</Link>
            </div>
          </div>
          <div className="trust">
            <div>By creating an account you agree to the internal usage policy.</div>
          </div>
        </div>
      </div>
    </div>
  );
}