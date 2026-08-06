import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  TrendingUp, 
  Target, 
  Settings, 
  Bell, 
  Search,
  LogOut,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import ProfitChart from './components/ProfitChart';
import ProductGrid from './components/ProductGrid';
import './index.css';

function Sidebar() {
  return (
    <aside className="sidebar">
      <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: 24, height: 24, backgroundColor: '#3b82f6', borderRadius: 4 }}></div>
          Sellerboard Clone
        </h2>
      </div>
      <nav style={{ padding: '24px 12px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', textDecoration: 'none', fontWeight: 500 }}>
          <LayoutDashboard size={20} /> Dashboard
        </a>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', color: '#9ca3af', textDecoration: 'none', fontWeight: 500 }}>
          <Package size={20} /> Products
        </a>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', color: '#9ca3af', textDecoration: 'none', fontWeight: 500 }}>
          <TrendingUp size={20} /> Profit & Loss
        </a>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', color: '#9ca3af', textDecoration: 'none', fontWeight: 500 }}>
          <Target size={20} /> PPC Optimizer
        </a>
      </nav>
      <div style={{ padding: '24px 12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', color: '#9ca3af', textDecoration: 'none', fontWeight: 500 }}>
          <Settings size={20} /> Settings
        </a>
      </div>
    </aside>
  );
}

function Topbar() {
  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f3f4f6', padding: '8px 12px', borderRadius: '8px', width: '300px' }}>
          <Search size={18} color="#6b7280" />
          <input type="text" placeholder="Search products by ASIN or Title" style={{ border: 'none', backgroundColor: 'transparent', outline: 'none', width: '100%', marginLeft: '8px', fontSize: '0.875rem' }} />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ position: 'relative' }}>
          <Bell size={20} color="#4b5563" />
          <div style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, backgroundColor: '#ef4444', borderRadius: '50%' }}></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <div style={{ width: 32, height: 32, backgroundColor: '#dbeafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e40af', fontWeight: 600 }}>
            JS
          </div>
          <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>John Seller</span>
          <ChevronDown size={16} color="#6b7280" />
        </div>
      </div>
    </header>
  );
}

function MetricCard({ title, amount, prevAmount, trend, trendValue, isPositive }) {
  return (
    <div className="card metric-card">
      <h3 className="text-sm text-muted">{title}</h3>
      <div className="metric-value">{amount}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
        <span className="text-sm text-muted" style={{ fontSize: '0.75rem' }}>vs {prevAmount} prev</span>
        <div className={`metric-trend ${isPositive ? 'trend-up' : 'trend-down'}`}>
          {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {trendValue}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Topbar />
        <div className="dashboard-scroll">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h1>Live Profit Dashboard</h1>
            <select style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', backgroundColor: '#fff', fontSize: '0.875rem', fontWeight: 500 }}>
              <option>Today (Live)</option>
              <option>Yesterday</option>
              <option>Last 7 Days</option>
              <option>This Month</option>
            </select>
          </div>

          <div className="metric-grid">
            <MetricCard title="Gross Sales" amount="$12,450" prevAmount="$10,200" trendValue="+22%" isPositive={true} />
            <MetricCard title="Net Profit" amount="$3,240" prevAmount="$2,800" trendValue="+15%" isPositive={true} />
            <MetricCard title="Units Sold" amount="145" prevAmount="110" trendValue="+31%" isPositive={true} />
            <MetricCard title="PPC Spend" amount="$1,100" prevAmount="$900" trendValue="+22%" isPositive={false} />
            <MetricCard title="Margin" amount="26%" prevAmount="27.4%" trendValue="-1.4%" isPositive={false} />
          </div>

          <div className="card mb-6" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
            <h3 className="mb-4">Sales & Profit Overview</h3>
            <div style={{ flex: 1, minHeight: 0 }}>
              <ProfitChart />
            </div>
          </div>

          <ProductGrid />
        </div>
      </main>
    </div>
  );
}

export default App;
