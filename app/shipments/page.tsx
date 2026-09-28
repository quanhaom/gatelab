'use client';

import { useEffect, useMemo, useState } from 'react';
import AppShell from '@/components/app-shell';
import { Card, PageTitle, Progress, StatusBadge } from '@/components/ui';
import {
  COLD_CHAIN_DAYS,
  formatDateVN,
  formatWeight,
  getColdChainEndDate,
  getRemainingColdDays,
  getShipmentStorage,
  initialShipments,
  setShipmentStorage,
  ShipmentRecord,
  ShipmentStatus,
} from '@/lib/data';
import { Filter, Plus, Search, X } from 'lucide-react';

const allTabs: Array<'Tất cả' | ShipmentStatus> = [
  'Tất cả',
  'Chờ kiểm nghiệm',
  'Đang kiểm nghiệm',
  'Đã có kết quả',
  'Đang vận chuyển',
  'Đã đặt lịch',
  'Chờ xác nhận lịch',
  'Đã chốt lịch',
];

const regionOptions = ['Krông Pắc, Đắk Lắk', 'Cái Bè, Tiền Giang', 'Cai Lậy, Tiền Giang', 'Đạ Huoai, Lâm Đồng', 'Cao Lãnh, Đồng Tháp', 'Mỹ Tho, Tiền Giang'];
const warehouseOptions = ['Đắk Lắk', 'Tiền Giang', 'Lâm Đồng', 'Đồng Tháp', 'TP.HCM'];

function nextStatus(status: ShipmentStatus): ShipmentStatus | null {
  if (status === 'Đã đặt lịch') return 'Chờ xác nhận lịch';
  if (status === 'Chờ xác nhận lịch') return 'Đã chốt lịch';
  if (status === 'Đã chốt lịch') return 'Chờ kiểm nghiệm';
  return null;
}

function actionLabel(status: ShipmentStatus) {
  if (status === 'Đã đặt lịch') return 'Gửi xác nhận';
  if (status === 'Chờ xác nhận lịch') return 'Chốt lịch';
  if (status === 'Đã chốt lịch') return 'Bắt đầu kiểm nghiệm';
  return '';
}

export default function ShipmentsPage() {
  const [tab, setTab] = useState<typeof allTabs[number]>('Tất cả');
  const [q, setQ] = useState('');
  const [rows, setRows] = useState<ShipmentRecord[]>(initialShipments);
  const [showModal, setShowModal] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    code: "",
    region: regionOptions[0],
    weightKg: 5000,
    harvestDate: today,
    warehouse: "Đắk Lắk",
  });

const [formError, setFormError] = useState("");

  useEffect(() => {
    setRows(getShipmentStorage());
  }, []);

  useEffect(() => {
    setShipmentStorage(rows);
  }, [rows]);

  const filteredRows = useMemo(
    () =>
      rows.filter((s) => {
        const matchTab = tab === 'Tất cả' || s.status === tab;
        const matchSearch = `${s.code} ${s.location} ${s.bookedLabName ?? ''}`.toLowerCase().includes(q.toLowerCase());
        return matchTab && matchSearch;
      }),
    [q, rows, tab]
  );

  const remainingPreview = getRemainingColdDays(form.harvestDate);
  const endDatePreview = formatDateVN(getColdChainEndDate(form.harvestDate));

  const updateStatus = (code: string) => {
    setRows((current) => current.map((item) => {
      if (item.code !== code) return item;
      const next = nextStatus(item.status);
      return next ? { ...item, status: next } : item;
    }));
  };

  const createShipment = () => {
    const code = form.code.trim().toUpperCase();

    if (!code) {
      setFormError("Vui lòng nhập mã lô.");
      return;
    }

    const duplicated = rows.some(
      (item) =>
        item.code.toUpperCase() === code
    );

    if (duplicated) {
      setFormError(
        `Mã lô ${code} đã tồn tại. Vui lòng nhập mã khác.`
      );
      return;
    }

    if (!form.harvestDate) {
      setFormError(
        "Vui lòng chọn ngày thu hoạch."
      );
      return;
    }

    const newShipment: ShipmentRecord = {
      code,
      region: form.region,
      location: form.region,
      warehouse: form.warehouse,
      harvestDate: form.harvestDate,
      weightKg: Number(form.weightKg),
      status: "Chờ kiểm nghiệm",
    };

    setRows((current) => [
      newShipment,
      ...current,
    ]);

    setFormError("");

    setForm({
      code: "",
      region: regionOptions[0],
      weightKg: 5000,
      harvestDate: today,
      warehouse: "Đắk Lắk",
    });

    setShowModal(false);
    setTab("Tất cả");
  };

  return (
    <AppShell>
      <PageTitle
        title="Lô hàng của tôi"
        subtitle="Quản lý lô hàng và theo dõi hạn chuỗi lạnh."
        action={<button className="primary-btn" onClick={() => setShowModal(true)}><Plus size={18} /> Thêm lô hàng mới</button>}
      />
      <Card className="table-card">
        <div className="table-tools">
          <div className="searchbox"><Search size={18} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm theo mã lô, vùng trồng..." /><Filter size={18} /></div>
          <div className="tabs">{allTabs.map((t) => <button key={t} onClick={() => setTab(t)} className={tab === t ? 'active' : ''}>{t}</button>)}</div>
        </div>
        <div className="ship-table">
          <div className="ship-head"><div>MÃ LÔ</div><div>NGÀY THU HOẠCH</div><div>HẠN CHUỖI LẠNH</div><div>KHỐI LƯỢNG</div><div>TRẠNG THÁI</div></div>
          {filteredRows.map((s) => {
            const remaining = getRemainingColdDays(s.harvestDate);
            const action = actionLabel(s.status);
            return (
              <div className="ship-row" key={s.code}>
                <div><strong>{s.code}</strong><span>{s.location}</span></div>
                <div>{formatDateVN(s.harvestDate)}</div>
                <div>
                <div className="cold-head">
                  <strong>Còn {remaining} ngày</strong>
                  <span>Tối đa {COLD_CHAIN_DAYS} ngày</span>
                </div>                  <Progress value={(remaining / COLD_CHAIN_DAYS) * 100} kind="cold" />
                </div>
                <div>{formatWeight(s.weightKg)}</div>
                <div>
                  <StatusBadge status={s.status} />
                  {s.bookedLabName ? <div className="status-subline">Lab: {s.bookedLabName}</div> : null}
                  {action ? <button className="row-action-btn" onClick={() => updateStatus(s.code)}>{action}</button> : null}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {showModal ? (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Thêm lô hàng mới</h3>
                <p>Nhập thông tin thu hoạch và kho hiện tại</p>
              </div>
              <button className="icon-close-btn" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <label>Mã lô</label>

<input
  type="text"
  value={form.code}
  placeholder="Ví dụ: LG-260928-01"
  onChange={(e) => {
    setForm({
      ...form,
      code: e.target.value.toUpperCase(),
    });

    setFormError("");
  }}
/>

{formError && (
  <div className="form-error">
    {formError}
  </div>
)}
              <label>Vùng trồng</label>
              <select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })}>{regionOptions.map((item) => <option key={item}>{item}</option>)}</select>
              <label>Khối lượng (kg)</label>
              <input type="number" value={form.weightKg} onChange={(e) => setForm({ ...form, weightKg: Number(e.target.value) })} />
              <div className="modal-grid-2">
                <div>
                  <label>Ngày thu hoạch</label>
                  <input type="date" value={form.harvestDate} onChange={(e) => setForm({ ...form, harvestDate: e.target.value })} />
                </div>
                <div>
                  <label>Vị trí kho</label>
                  <select value={form.warehouse} onChange={(e) => setForm({ ...form, warehouse: e.target.value })}>{warehouseOptions.map((item) => <option key={item}>{item}</option>)}</select>
                </div>
              </div>
              <div className="cold-preview-box">
                <div className="cold-head"><strong>Hạn chuỗi lạnh còn lại</strong><strong>{remainingPreview} ngày</strong></div>
                <Progress value={(remainingPreview / COLD_CHAIN_DAYS) * 100} kind="cold" />
                <div className="status-subline">Ngày hết chuỗi lạnh: {endDatePreview}</div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="secondary-btn" onClick={() => setShowModal(false)}>Hủy</button>
              <button className="primary-btn" onClick={createShipment}><Plus size={18} /> Tạo lô hàng</button>
            </div>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
