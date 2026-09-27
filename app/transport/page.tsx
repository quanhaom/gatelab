'use client';

import { useEffect, useMemo, useState } from 'react';
import AppShell from '@/components/app-shell';
import { Card, PageTitle } from '@/components/ui';
import { Box, Route, Truck } from 'lucide-react';
import { formatDateVN, getRemainingColdDays, getShipmentStorage, setShipmentStorage, ShipmentRecord } from '@/lib/data';

const options = [
  { title: 'Đường bộ trực tiếp', desc: 'Tuyến nhanh nhất qua cửa khẩu Hữu Nghị', days: 3, cost: 28500000, risk: 'Thấp', icon: Truck, best: true },
  { title: 'Đường bộ qua trung chuyển', desc: 'Tiết kiệm chi phí, phát sinh một điểm sang xe', days: 5, cost: 23800000, risk: 'Trung bình', icon: Route },
  { title: 'Đường sắt Lào Cai', desc: 'Lịch tàu cố định, khó xử lý chậm trễ', days: 9, cost: 21500000, risk: 'Cao', icon: Box },
];

function currency(value: number) {
  return new Intl.NumberFormat('vi-VN').format(value) + ' đ';
}

export default function TransportPage() {
  const [shipments, setShipments] = useState<ShipmentRecord[]>([]);
  const [selectedCode, setSelectedCode] = useState('');

  useEffect(() => {
    const data = getShipmentStorage();
    setShipments(data);
    const first = data.find((item) => ['Đã có kết quả', 'Đang vận chuyển'].includes(item.status)) ?? data[0];
    setSelectedCode(first?.code ?? '');
  }, []);

  const selectedShipment = useMemo(() => shipments.find((item) => item.code === selectedCode) ?? shipments[0], [selectedCode, shipments]);

  const chooseOption = (title: string) => {
    const updated: ShipmentRecord[] = shipments.map((item) =>
      item.code === selectedShipment.code
        ? {
            ...item,
            transportOption: title,
            status: "Đang vận chuyển",
          }
        : item
    );

    setShipments(updated);
    setShipmentStorage(updated);
  };

  if (!selectedShipment) return <AppShell><PageTitle title="Đề xuất vận chuyển" subtitle="Chưa có lô hàng." /></AppShell>;

  const remaining = getRemainingColdDays(selectedShipment.harvestDate);
  const selectedOption = selectedShipment.transportOption ?? options[0].title;

  return <AppShell><PageTitle title="Đề xuất vận chuyển" subtitle="So sánh thời gian, chi phí và rủi ro theo hạn chuỗi lạnh còn lại." />
    <Card className="transport-filter"><div><label>Chọn lô đã có kết quả</label><select value={selectedShipment.code} onChange={(e) => setSelectedCode(e.target.value)}>{shipments.map((item) => <option key={item.code} value={item.code}>{item.code} · {item.location} · Còn {getRemainingColdDays(item.harvestDate)} ngày</option>)}</select></div><div className="cold-box"><span>Hạn chuỗi lạnh còn lại</span><strong>{remaining} ngày</strong><span>Thu hoạch {formatDateVN(selectedShipment.harvestDate)}</span></div></Card>
    <div className="transport-grid">{options.map((o) => { const chosen = selectedOption === o.title; return <Card key={o.title} className={`transport-card ${o.best ? 'best' : ''}`}>{o.best && <div className="best-label">Đề xuất tốt nhất</div>}<div className="transport-icon"><o.icon size={23} /></div><h3>{o.title}</h3><p>{o.desc}</p><div className="transport-spec"><div><span>Thời gian dự kiến</span><strong>{o.days} ngày</strong></div><div><span>Chi phí</span><strong>{currency(o.cost)}</strong></div><div><span>Mức rủi ro</span><span className={`badge ${o.risk === 'Thấp' ? 'green' : o.risk === 'Cao' ? 'red' : 'yellow'}`}>{o.risk}</span></div></div><button className={`transport-btn ${chosen ? 'primary' : ''}`} onClick={() => chooseOption(o.title)}>{chosen ? 'Đã chọn phương án' : 'Chọn phương án ↗'}</button></Card>; })}</div>
    <Card className="analysis-box"><strong>✣ &nbsp; Phân tích của LabGate</strong><p>Phương án hiện tại: <strong>{selectedOption}</strong>. Khi bạn chọn một phương án, hệ thống sẽ cập nhật ngay cho lô <strong>{selectedShipment.code}</strong> và chuyển trạng thái sang <strong>Đang vận chuyển</strong>.</p></Card>
  </AppShell>;
}
