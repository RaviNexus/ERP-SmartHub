import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="not-found">
      <h1>Page not found</h1>
      <p className="muted">We could not find that screen. Try heading back to the dashboard.</p>
      <Link className="primary" to="/app">Go to dashboard</Link>
    </div>
  );
}