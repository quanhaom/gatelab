'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Boxes, FlaskConical, Gauge, LogOut, Route, ShieldCheck, BarChart3 } from 'lucide-react';
import { branding } from '@/lib/branding';

const nav = [
  { href: '/', label: 'Dashboard', icon: Gauge },
  { href: '/shipments', label: 'Lô hàng của tôi', icon: Boxes },
  { href: '/labs', label: 'Đề xuất phòng kiểm\nnghiệm', icon: FlaskConical },
  { href: '/transport', label: 'Đề xuất vận chuyển', icon: Route },
  { href: '/reports', label: 'Lịch sử & báo cáo', icon: BarChart3 },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark brand-logo-slot">
            <img src={branding.logoPath} alt={`${branding.productName} logo`} />
          </div>
          <div>
            <div className="brand-name">{branding.productName}</div>
            <div className="brand-sub">{branding.tagline}</div>
          </div>
        </div>

        <nav className="nav-list">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link className={`nav-item ${active ? 'active' : ''}`} href={href} key={href}>
                <Icon size={19} strokeWidth={1.8} />
                <span>{label.split('\n').map((s, i) => <span key={i}>{s}{i === 0 && label.includes('\n') ? <br/> : null}</span>)}</span>
                <span className="chev">›</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="system-card">
            <div className="system-title"><ShieldCheck size={16}/> Hệ thống ổn định</div>
            <div className="system-sub">50 cơ sở kiểm nghiệm được công nhận</div>
          </div>
          <button className="logout" onClick={() => window.alert('Đăng xuất sẽ được nối với Supabase Auth ở bước production.') }><LogOut size={17}/> Đăng xuất</button>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="topbar-title">Điều phối xuất khẩu sầu riêng</div>
          <div className="company-box">
            <div className="company-text"><strong>{branding.companyName}</strong><span>{branding.companyRole}</span></div>
            <div className="avatar">MP</div>
          </div>
        </header>
        <main className="page-wrap">{children}</main>
      </div>
    </div>
  );
}
