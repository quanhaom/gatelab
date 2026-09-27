'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import AppShell from '@/components/app-shell';
import { Card, PageTitle } from '@/components/ui';
import ThreeWayPrioritySlider from '@/components/three-way-priority-slider';
import {
  allLabs,
  formatCurrency,
  getShipmentStorage,
  haversineDistanceKm,
  REGION_COORDS,
  setShipmentStorage,
  ShipmentRecord,
  ShipmentStatus
} from '@/lib/data';

type PriorityValues = [number, number, number];
type SortMode = 'distance' | 'priority';

type RankedLab = (typeof allLabs)[number] & {
  distanceKm: number;
  transportCost: number;
  priorityScore: number;
};

function scoreInverse(value: number, min: number, max: number) {
  if (max === min) return 100;
  return Math.round(100 - ((value - min) / (max - min)) * 100);
}

export default function LabsPage() {
  const [shipments, setShipments] = useState<ShipmentRecord[]>([]);
  const [shipment, setShipment] = useState('');
  const [criteria, setCriteria] = useState('Tất cả');
  const [priorities, setPriorities] = useState<PriorityValues>([35, 30, 35]);
  const [sortMode, setSortMode] = useState<SortMode>('priority');
  const [bookingNote, setBookingNote] = useState('');

  useEffect(() => {
    const data = getShipmentStorage();
    setShipments(data);
    setShipment(data[0]?.code ?? '');
  }, []);

  const selectedShipment = shipments.find((item) => item.code === shipment) ?? shipments[0];
  const warehouse = selectedShipment?.warehouse ?? 'Đắk Lắk';

  const rankedLabs = useMemo<RankedLab[]>(() => {
    const origin = REGION_COORDS[warehouse] ?? REGION_COORDS['Đắk Lắk'];
    const filtered = allLabs.filter((lab) => criteria === 'Tất cả' || lab.tests.includes(criteria as 'Cadimi' | 'Vàng O'));

    const withMetrics = filtered.map((lab) => {
      const distanceKm = haversineDistanceKm(origin, { lat: lab.lat, lng: lab.lng });
      const transportCost = Math.round(lab.baseCost + distanceKm * 1800);
      return { ...lab, distanceKm, transportCost, priorityScore: 0 };
    });

    const minDistance = Math.min(...withMetrics.map((item) => item.distanceKm));
    const maxDistance = Math.max(...withMetrics.map((item) => item.distanceKm));
    const minCost = Math.min(...withMetrics.map((item) => item.transportCost));
    const maxCost = Math.max(...withMetrics.map((item) => item.transportCost));
    const minWait = Math.min(...withMetrics.map((item) => item.waitDays));
    const maxWait = Math.max(...withMetrics.map((item) => item.waitDays));

    const [distanceWeight, transportWeight, timeWeight] = priorities;

    const scored = withMetrics.map((item) => {
      const distanceScore = scoreInverse(item.distanceKm, minDistance, maxDistance);
      const transportScore = scoreInverse(item.transportCost, minCost, maxCost);
      const timeScore = scoreInverse(item.waitDays, minWait, maxWait);
      const priorityScore = Math.round(distanceScore * (distanceWeight / 100) + transportScore * (transportWeight / 100) + timeScore * (timeWeight / 100));
      return { ...item, priorityScore };
    });

    scored.sort((a, b) => sortMode === 'distance' ? a.distanceKm - b.distanceKm || b.priorityScore - a.priorityScore : b.priorityScore - a.priorityScore || a.distanceKm - b.distanceKm);
    return scored;
  }, [criteria, priorities, sortMode, warehouse]);

  const bookLab = (labId: number, labName: string) => {
    const updated: ShipmentRecord[] = shipments.map((item) => {
      if (item.code !== selectedShipment.code) {
        return item;
      }

      return {
        ...item,
        status: "Đã đặt lịch" as ShipmentStatus,
        bookedLabId: labId,
        bookedLabName: labName,
      };
    });

    setShipments(updated);
    setShipmentStorage(updated);

    setBookingNote(
      `Đã đặt lịch cho lô ${selectedShipment.code} tại ${labName}. Trạng thái lô đã chuyển sang “Đã đặt lịch”.`
    );
  };

  if (!selectedShipment) {
    return <AppShell><PageTitle title="Đề xuất phòng kiểm nghiệm" subtitle="Không có lô hàng nào để gợi ý." /></AppShell>;
  }

  return (
    <AppShell>
      <PageTitle title="Đề xuất phòng kiểm nghiệm" subtitle="Xếp hạng 50 cơ sở theo khoảng cách, chi phí vận chuyển và thời gian chờ." />

      <Card className="filters-card">
        <div>
          <label>Lô hàng cần kiểm nghiệm</label>
          <select value={shipment} onChange={(e) => setShipment(e.target.value)}>{shipments.map((item) => <option key={item.code} value={item.code}>{item.code} · {item.location}</option>)}</select>
        </div>
        <div>
          <label>Vị trí kho / vùng trồng</label>
          <select value={warehouse} onChange={() => {}} disabled><option>{warehouse}</option></select>
        </div>
        <div>
          <label>Chỉ tiêu cần kiểm</label>
          <select value={criteria} onChange={(e) => setCriteria(e.target.value)}><option>Tất cả</option><option>Cadimi</option><option>Vàng O</option></select>
        </div>
      </Card>

      <ThreeWayPrioritySlider
        labels={['Ưu tiên khoảng cách gần', 'Ưu tiên chi phí vận chuyển', 'Ưu tiên thời gian nhanh']}
        values={priorities}
        onChange={setPriorities}
      />

      <div className="warning-strip">
        <AlertTriangle size={18} />
        <div>
          {bookingNote ? bookingNote : <><strong>Gợi ý điều phối:</strong> Hệ thống đang xếp hạng tự động theo 3 tiêu chí có tổng bằng 100%. Bạn có thể kéo thanh ưu tiên rồi nhấn “Đặt lịch” để cập nhật ngay trạng thái lô hàng.</>}
        </div>
      </div>

      <Card className="ranking-card">
        <div className="ranking-head">
          <div>
            <h3>Xếp hạng đề xuất</h3>
            <p>Dựa trên vị trí kho {warehouse}, chỉ tiêu {criteria.toLowerCase()} và ưu tiên hiện tại</p>
          </div>
          <div>
            <button type="button" className={sortMode === 'distance' ? 'active' : ''} onClick={() => setSortMode('distance')}>Theo khoảng cách</button>
            <button type="button" className={sortMode === 'priority' ? 'active' : ''} onClick={() => setSortMode('priority')}>Theo điểm ưu tiên</button>
          </div>
        </div>
        <div className="rank-head"><div>#</div><div>CƠ SỞ KIỂM NGHIỆM</div><div>KHOẢNG CÁCH</div><div>CHI PHÍ ƯỚC TÍNH</div><div>CHỜ</div><div>TẢI</div><div>ĐIỂM ƯU TIÊN</div><div /></div>
        {rankedLabs.slice(0, 10).map((lab, index) => {
          const isBooked = selectedShipment.bookedLabId === lab.id;
          return (
            <div className="rank-row" key={lab.id}>
              <div><span className={index === 0 ? 'ranknum top' : 'ranknum'}>{index + 1}</span></div>
              <div><strong>{lab.name}</strong><span>{lab.province} · {lab.tests.join(' + ')}</span></div>
              <div><strong>{lab.distanceKm} km</strong></div>
              <div>{formatCurrency(lab.transportCost)}</div>
              <div>{lab.waitDays} ngày</div>
              <div><span className={lab.load >= 50 ? 'load-pill warn' : 'load-pill'}>{lab.load}%</span></div>
              <div><div className="fit">Phù hợp</div><div className="score-row"><div className="progress"><div className="progress-fill good" style={{ width: `${lab.priorityScore}%` }} /></div><strong>{lab.priorityScore}/100</strong></div></div>
              <div><button type="button" className="primary-btn small" onClick={() => bookLab(lab.id, lab.name)}>{isBooked ? 'Cập nhật lịch' : 'Đặt lịch'}</button></div>
            </div>
          );
        })}
      </Card>
    </AppShell>
  );
}
