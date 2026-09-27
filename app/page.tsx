'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import AppShell from '@/components/app-shell';
import { AlertTriangle, Beaker, Clock3 } from 'lucide-react';
import { Card, PageTitle, Progress } from '@/components/ui';
import { allLabs, getLoadTone, getShipmentStorage, ShipmentRecord } from '@/lib/data';

const LabsMap = dynamic(() => import('@/components/labs-map'), {
  ssr: false,
  loading: () => <div style={{ height: '100%', display: 'grid', placeItems: 'center' }}>Đang tải bản đồ…</div>,
});

const regions = ['Tất cả', ...Array.from(new Set(allLabs.map((lab) => lab.province)))];

export default function DashboardPage() {
  const [selectedRegion, setSelectedRegion] = useState('Tất cả');
  const [selectedLabId, setSelectedLabId] = useState<number>(allLabs[0].id);
  const shipments: ShipmentRecord[] = getShipmentStorage();

  const visibleLabs = useMemo(
    () => (selectedRegion === 'Tất cả' ? allLabs : allLabs.filter((lab) => lab.province === selectedRegion)),
    [selectedRegion]
  );

  const selectedLab = visibleLabs.find((lab) => lab.id === selectedLabId) ?? visibleLabs[0] ?? allLabs[0];
  const hotspots = [...allLabs].sort((a, b) => b.load - a.load).slice(0, 5);
  const overloadCount = allLabs.filter((lab) => lab.load > 85 || lab.status === 'Tạm dừng').length;
  const pendingCount = shipments.filter((item) => ['Chờ kiểm nghiệm', 'Đã đặt lịch', 'Chờ xác nhận lịch', 'Đã chốt lịch'].includes(item.status)).length;

  return (
    <AppShell>
      <PageTitle title="Tổng quan vận hành" subtitle="Theo dõi năng lực kiểm nghiệm và tình trạng lô hàng theo thời gian thực." />

      <div className="stats-grid">
        <Card>
          <div className="stat-head"><span>Tổng số cơ sở kiểm nghiệm</span><div className="iconbox"><Beaker size={22} /></div></div>
          <div className="stat-value">{allLabs.length}</div>
          <div className="stat-foot">Dữ liệu bản đồ thật, có thể zoom và bấm xem chi tiết</div>
        </Card>
        <Card>
          <div className="stat-head"><span>Cơ sở quá tải / tạm dừng</span><div className="iconbox red"><AlertTriangle size={22} /></div></div>
          <div className="stat-value">{overloadCount}</div>
          <div className="stat-foot redtext">Tải hiện tại là dữ liệu demo để mô phỏng điều phối</div>
        </Card>
        <Card>
          <div className="stat-head"><span>Lô hàng đang chờ xử lý</span><div className="iconbox"><Clock3 size={22} /></div></div>
          <div className="stat-value">{pendingCount}</div>
          <div className="stat-foot">Bao gồm đặt lịch, chờ xác nhận, chờ kiểm nghiệm</div>
        </Card>
      </div>

      <div className="dashboard-grid">
        <Card className="map-card">
          <div className="card-header">
            <div>
              <h3>Mạng lưới cơ sở kiểm nghiệm</h3>
              <p>Zoom bản đồ hoặc nhấn trực tiếp vào từng lab để xem chi tiết</p>
            </div>
            <div className="legend"><span><i className="dot green"></i>Dưới 50%</span><span><i className="dot yellow"></i>50–85%</span><span><i className="dot red"></i>Trên 85% / tạm dừng</span></div>
          </div>
          <div className="map-layout">
            <div className="real-map-wrap">
              <LabsMap labs={visibleLabs} selectedLabId={selectedLab?.id} onSelect={setSelectedLabId} />
            </div>
            <div className="map-side">
              <label>VỊ TRÍ KHO / VÙNG TRỒNG</label>
              <select value={selectedRegion} onChange={(e) => { setSelectedRegion(e.target.value); const next = (e.target.value === 'Tất cả' ? allLabs : allLabs.filter((lab) => lab.province === e.target.value))[0]; if (next) setSelectedLabId(next.id); }}>
                {regions.map((region) => <option key={region}>{region}</option>)}
              </select>
              <h4>{selectedLab?.name}</h4>
              <p>◉ {selectedLab?.address}</p>
              <div className="mini-label">Chỉ tiêu kiểm nghiệm</div><strong>{selectedLab?.tests.join(' + ')}</strong>
              <div className="mini-label">Tỉnh / vùng</div><strong>{selectedLab?.province}</strong>
              <div className="mini-label">Tải hiện tại</div><div className="load-row"><strong>Công suất</strong><strong>{selectedLab?.load}%</strong></div><Progress value={selectedLab?.load ?? 0} kind="load" />
              <div className="mini-label">Thời gian chờ dự kiến</div><strong>{selectedLab?.waitDays} ngày</strong>
              <div className="mini-label">Trạng thái</div><span className={`badge ${getLoadTone(selectedLab?.load ?? 0) === 'danger' ? 'red' : getLoadTone(selectedLab?.load ?? 0) === 'warn' ? 'yellow' : 'green'}`}>{selectedLab?.status}</span>
            </div>
          </div>
        </Card>

        <Card className="hotspot-card">
          <div className="hot-title"><div><h3>Điểm nóng công suất</h3><p>Nhấn vào từng dòng để nhảy đến lab tương ứng trên bản đồ</p></div><AlertTriangle size={22} /></div>
          <div className="hot-list">
            {hotspots.map((item) => (
              <button type="button" className="hot-item hot-item-button" key={item.id} onClick={() => { setSelectedRegion(item.province); setSelectedLabId(item.id); }}>
                <div className="hotline"><div><strong>{item.name}</strong><span>{item.province} · {item.tests.join(' + ')}</span></div><b>{item.load}%</b></div>
                <Progress value={item.load} kind="load" />
              </button>
            ))}
          </div>
          <div className="tipbox"><strong>Gợi ý điều phối</strong><p>Ưu tiên chuyển mẫu sang các cơ sở dưới 50% tải trong cùng khu vực để giảm thời gian chờ và tránh tắc nghẽn.</p></div>
        </Card>
      </div>
    </AppShell>
  );
}
