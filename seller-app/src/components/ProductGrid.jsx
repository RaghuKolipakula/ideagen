import React from 'react';

const mockProducts = [
  {
    id: 'B08F6ZVX8Y',
    image: 'https://via.placeholder.com/40',
    title: 'Ergonomic Desk Chair - Black',
    sales: '$4,500',
    units: 45,
    cogs: '$1,200',
    amazonFees: '$1,350',
    ppc: '$400',
    profit: '$1,550',
    margin: '34.4%',
  },
  {
    id: 'B09G7AWZ9X',
    image: 'https://via.placeholder.com/40',
    title: 'Wireless Gaming Mouse 10k DPI',
    sales: '$2,800',
    units: 70,
    cogs: '$560',
    amazonFees: '$840',
    ppc: '$600',
    profit: '$800',
    margin: '28.5%',
  },
  {
    id: 'B07H8BXY0W',
    image: 'https://via.placeholder.com/40',
    title: 'Mechanical Keyboard Blue Switches',
    sales: '$3,200',
    units: 40,
    cogs: '$800',
    amazonFees: '$960',
    ppc: '$500',
    profit: '$940',
    margin: '29.3%',
  }
];

export default function ProductGrid() {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)' }}>
        <h3>Product Breakdown</h3>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ backgroundColor: '#f9fafb', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
          <tr>
            <th style={{ padding: '12px 20px', fontWeight: 500 }}>Product</th>
            <th style={{ padding: '12px 20px', fontWeight: 500 }}>Sales</th>
            <th style={{ padding: '12px 20px', fontWeight: 500 }}>Units</th>
            <th style={{ padding: '12px 20px', fontWeight: 500 }}>COGS</th>
            <th style={{ padding: '12px 20px', fontWeight: 500 }}>Amazon Fees</th>
            <th style={{ padding: '12px 20px', fontWeight: 500 }}>PPC Spend</th>
            <th style={{ padding: '12px 20px', fontWeight: 500 }}>Net Profit</th>
            <th style={{ padding: '12px 20px', fontWeight: 500 }}>Margin</th>
          </tr>
        </thead>
        <tbody>
          {mockProducts.map((p, i) => (
            <tr key={p.id} style={{ borderBottom: i === mockProducts.length - 1 ? 'none' : '1px solid var(--border-color)', fontSize: '0.875rem' }}>
              <td style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={p.image} alt={p.title} style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'cover', border: '1px solid #e5e7eb' }} />
                  <div>
                    <div style={{ fontWeight: 500, color: '#111827', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div>
                    <div style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '2px' }}>{p.id}</div>
                  </div>
                </div>
              </td>
              <td style={{ padding: '16px 20px', fontWeight: 500 }}>{p.sales}</td>
              <td style={{ padding: '16px 20px' }}>{p.units}</td>
              <td style={{ padding: '16px 20px', color: '#ef4444' }}>{p.cogs}</td>
              <td style={{ padding: '16px 20px', color: '#ef4444' }}>{p.amazonFees}</td>
              <td style={{ padding: '16px 20px', color: '#ef4444' }}>{p.ppc}</td>
              <td style={{ padding: '16px 20px', fontWeight: 600, color: '#10b981' }}>{p.profit}</td>
              <td style={{ padding: '16px 20px', fontWeight: 500 }}>
                <span style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: '999px', fontSize: '0.75rem' }}>
                  {p.margin}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
