'use client';

import AppShell from '@/components/app-shell';
import { Card, PageTitle, StatusBadge } from '@/components/ui';
import { BarChart3, CheckCircle2, Clock3 } from 'lucide-react';
import { formatDateVN, formatWeight, getShipmentStorage } from '@/lib/data';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart } from 'recharts';

const reportData = [
  { month: 'T4', shipments: 35, days: 5.8 },
  { month: 'T5', shipments: 45, days: 5.0 },
  { month: 'T6', shipments: 50, days: 4.5 },
  { month: 'T7', shipments: 58, days: 4.0 },
  { month: 'T8', shipments: 68, days: 3.6 },
  { month: 'T9', shipments: 78, days: 3.2 },
];

function TooltipCard({ active, payload, label, unit = '' }: any) {
  if (!active || !payload?.length) return null;
  return <div style={{ background: '#fff', border: '1px solid #d8e0ea', borderRadius: 8, boxShadow: '0 8px 24px rgba(15,31,56,.12)', padding: '11px 13px' }}><div style={{ fontWeight: 700, marginBottom: 8 }}>{label}</div>{payload.map((item: any, index: number) => <div key={index} style={{ display: 'flex', justifyContent: 'space-between', gap: 20, fontSize: 12 }}><span style={{ color: '#6f7d91' }}>{item.name}</span><strong>{item.value}{unit}</strong></div>)}</div>;
}

export default function ReportsPage() {
  const shipments = getShipmentStorage();
  const bookedDone = shipments.filter((item) => ['Đã chốt lịch', 'Đã có kết quả', 'Đang vận chuyển'].includes(item.status)).length;
  const bookingRate = shipments.length ? Math.round((bookedDone / shipments.length) * 100) : 0;

  return (
    <AppShell>
      <PageTitle title="Lịch sử & báo cáo" subtitle="Đo lường hiệu quả vận hành sau khi áp dụng LabGate." />

      <div className="stats-grid reports">
        <Card><div className="stat-head"><span>Tổng lô đã xử lý</span><div className="iconbox"><BarChart3 size={22} /></div></div><div className="stat-value">313</div><div className="stat-foot">Tăng 18% trong 6 tháng</div></Card>
        <Card><div className="stat-head"><span>Thời gian xử lý trung bình</span><div className="iconbox"><Clock3 size={22} /></div></div><div className="stat-value">3,2 ngày</div><div className="stat-foot">Trước LabGate: 6,4 ngày</div></Card>
        <Card><div className="stat-head"><span>Tỷ lệ lô đã chốt / hoàn tất</span><div className="iconbox"><CheckCircle2 size={22} /></div></div><div className="stat-value">{bookingRate}%</div><div className="stat-foot">Tính trên các lô đang có trong hệ thống local</div></Card>
      </div>

      <div className="charts-grid">
        <Card>
          <h3>Sản lượng xử lý theo tháng</h3>
          <p>Xu hướng 6 tháng gần nhất</p>
          <div style={{ width: '100%', height: 285, marginTop: 18 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportData} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: '#aeb7c3' }} tick={{ fontSize: 12, fill: '#6e7b8e' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#7a8798' }} />
                <Tooltip cursor={{ fill: 'rgba(39, 79, 145, 0.04)' }} content={<TooltipCard unit=" lô" />} />
                <Bar name="Lô đã xử lý" dataKey="shipments" fill="#2c5596" radius={[3, 3, 0, 0]} maxBarSize={42} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3>Thời gian xử lý trung bình</h3>
          <p>Số ngày từ lấy mẫu đến có kết quả</p>
          <div style={{ width: '100%', height: 285, marginTop: 18 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reportData} margin={{ top: 15, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#6e7b8e' }} />
                <YAxis domain={[0, 7]} ticks={[0, 2, 4, 7]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#7a8798' }} />
                <Tooltip cursor={{ stroke: '#cbd5e1', strokeDasharray: '4 4' }} content={<TooltipCard unit=" ngày" />} />
                <defs><linearGradient id="reportAreaGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2c5596" stopOpacity={0.18} /><stop offset="100%" stopColor="#2c5596" stopOpacity={0.04} /></linearGradient></defs>
                <Area type="monotone" name="Thời gian xử lý" dataKey="days" stroke="#2c5596" strokeWidth={3} fill="url(#reportAreaGradient)" activeDot={{ r: 5, strokeWidth: 2, fill: '#ffffff', stroke: '#2c5596' }} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="activity-card">
        <h3>Hoạt động gần đây</h3>
        {shipments.slice(0, 5).map((shipment) => (
          <div className="activity-row" key={shipment.code}>
            <div className="activity-icon">▤</div>
            <div className="activity-main"><strong>{shipment.code} · {shipment.location}</strong><span>{formatWeight(shipment.weightKg ?? 0)} · Thu hoạch {formatDateVN(shipment.harvestDate)}</span></div>
            <StatusBadge status={shipment.status} />
          </div>
        ))}
      </Card>
    </AppShell>
  );
}
