import React from 'react';

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="placeholder">
      <h1>{title}</h1>
      <p className="muted">This module is next in the build queue. We will wire it to real data soon.</p>
    </div>
  );
}