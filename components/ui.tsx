import { ReactNode } from 'react';

export function PageTitle({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) {
  return <div className="page-title-row"><div><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>;
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`card ${className}`}>{children}</div>;
}

export function StatusBadge({ status }: { status: string }) {
  let cls = 'gray';
  if (status.includes('kết quả')) cls = 'green';
  else if (status.includes('vận chuyển')) cls = 'blue';
  else if (status.includes('Đang kiểm')) cls = 'yellow';
  else if (status.includes('đặt lịch') || status.includes('xác nhận') || status.includes('chốt lịch')) cls = 'purple';
  return <span className={`badge ${cls}`}>{status}</span>;
}

export function Progress({ value, kind }: { value: number; kind?: 'cold' | 'load' }) {
  let tone = 'good';
  if (kind === 'cold') tone = value <= 25 ? 'danger' : value <= 50 ? 'warn' : 'good';
  if (kind === 'load') tone = value >= 85 ? 'danger' : value >= 50 ? 'warn' : 'good';
  return <div className="progress"><div className={`progress-fill ${tone}`} style={{ width: `${Math.max(4, Math.min(100, value))}%` }} /></div>;
}
