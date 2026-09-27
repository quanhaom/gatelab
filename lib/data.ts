export type ShipmentStatus =
  | 'Chờ kiểm nghiệm'
  | 'Đang kiểm nghiệm'
  | 'Đã có kết quả'
  | 'Đang vận chuyển'
  | 'Đã đặt lịch'
  | 'Chờ xác nhận lịch'
  | 'Đã chốt lịch';

export type ShipmentRecord = {
  code: string;
  region: string;
  location: string;
  warehouse: string;
  harvestDate: string; // YYYY-MM-DD
  weightKg: number;
  status: ShipmentStatus;
  bookedLabId?: number;
  bookedLabName?: string;
  transportOption?: string;
};

export type LabRecord = {
  id: number;
  name: string;
  province: string;
  address: string;
  lat: number;
  lng: number;
  tests: Array<'Cadimi' | 'Vàng O'>;
  load: number;
  waitDays: number;
  baseCost: number;
  status: 'Đang hoạt động' | 'Quá tải' | 'Tạm dừng';
};

export const COLD_CHAIN_DAYS = 28;
export const STORAGE_KEYS = {
  shipments: 'labgate_shipments_v2',
};

export const REGION_COORDS: Record<string, { lat: number; lng: number }> = {
  'Đắk Lắk': { lat: 12.7100, lng: 108.2378 },
  'Tiền Giang': { lat: 10.4493, lng: 106.3420 },
  'Lâm Đồng': { lat: 11.9404, lng: 108.4583 },
  'Đồng Tháp': { lat: 10.5435, lng: 105.6380 },
  'Gia Lai': { lat: 13.8079, lng: 108.1094 },
  'TP.HCM': { lat: 10.8231, lng: 106.6297 },
  'Cần Thơ': { lat: 10.0452, lng: 105.7469 },
  'Hà Nội': { lat: 21.0278, lng: 105.8342 },
  'Đồng Nai': { lat: 10.9453, lng: 106.8240 },
  'Bình Dương': { lat: 11.3254, lng: 106.4770 },
  'Long An': { lat: 10.6956, lng: 106.2431 },
  'Bình Thuận': { lat: 10.9804, lng: 108.2615 },
  'Bà Rịa - Vũng Tàu': { lat: 10.5417, lng: 107.2429 },
  'Quảng Ninh': { lat: 21.0064, lng: 107.2925 },
  'Bắc Ninh': { lat: 21.1214, lng: 106.1110 },
  'Lạng Sơn': { lat: 21.8460, lng: 106.7570 },
  'Sơn La': { lat: 21.3256, lng: 103.9188 },
};

const lab = (
  id: number,
  name: string,
  province: string,
  address: string,
  lat: number,
  lng: number,
  tests: Array<'Cadimi' | 'Vàng O'>,
  load: number,
  waitDays: number,
  baseCost: number,
  status?: 'Đang hoạt động' | 'Quá tải' | 'Tạm dừng'
): LabRecord => ({
  id,
  name,
  province,
  address,
  lat,
  lng,
  tests,
  load,
  waitDays,
  baseCost,
  status: status ?? (load > 92 ? 'Tạm dừng' : load > 85 ? 'Quá tải' : 'Đang hoạt động'),
});

export const allLabs: LabRecord[] = [
  lab(1, 'Cty TNHH KSCL nông sản xanh VN (VIETNAM GREEN)', 'Đắk Lắk', 'Krông Pắc, Đắk Lắk', 12.789, 108.307, ['Cadimi', 'Vàng O'], 58, 4, 4000000),
  lab(2, 'Cty CP Chứng nhận và Giám định Miền Đông VN (Ea Păl)', 'Đắk Lắk', 'Ea Kar, Đắk Lắk', 12.815, 108.432, ['Cadimi'], 95, 2, 3850000, 'Quá tải'),
  lab(3, 'TT Phân tích nông hóa Tây Nguyên', 'Đắk Lắk', 'TP. Buôn Ma Thuột', 12.667, 108.044, ['Cadimi', 'Vàng O'], 44, 3, 3920000),
  lab(4, 'Phòng kiểm nghiệm Sầu riêng Cao Nguyên', 'Đắk Lắk', 'Cư M’gar, Đắk Lắk', 12.823, 108.008, ['Cadimi'], 37, 3, 3780000),
  lab(5, 'Trung tâm phân tích xuất khẩu Krông Năng', 'Đắk Lắk', 'Krông Năng, Đắk Lắk', 12.936, 108.350, ['Cadimi', 'Vàng O'], 63, 4, 3890000),
  lab(6, 'Cty TNHH DV Khoa học Kiểm nghiệm Gia Lai', 'Gia Lai', 'Pleiku, Gia Lai', 13.983, 108.000, ['Cadimi'], 98, 2, 3750000, 'Tạm dừng'),
  lab(7, 'Trung tâm kỹ thuật phân tích Gia Lai', 'Gia Lai', 'Chư Sê, Gia Lai', 13.760, 108.086, ['Cadimi', 'Vàng O'], 61, 4, 3900000),
  lab(8, 'Phòng thí nghiệm Nông sản Pleiku', 'Gia Lai', 'Pleiku, Gia Lai', 13.975, 108.015, ['Cadimi'], 42, 3, 3820000),
  lab(9, 'Cty CP Chứng nhận và Giám định Miền Đông VN (Bảo Lộc)', 'Lâm Đồng', 'Bảo Lộc, Lâm Đồng', 11.547, 107.807, ['Cadimi', 'Vàng O'], 21, 2, 3950000),
  lab(10, 'TT Kỹ thuật TCĐLCL Lâm Đồng (Hàm Thắng)', 'Lâm Đồng', 'Hàm Thuận Bắc, Bình Thuận', 11.072, 108.143, ['Cadimi', 'Vàng O'], 29, 3, 4050000),
  lab(11, 'Trung tâm kiểm nghiệm Đà Lạt', 'Lâm Đồng', 'Đà Lạt, Lâm Đồng', 11.940, 108.458, ['Cadimi'], 48, 3, 3990000),
  lab(12, 'Phòng phân tích Nông sản Di Linh', 'Lâm Đồng', 'Di Linh, Lâm Đồng', 11.574, 108.014, ['Cadimi', 'Vàng O'], 67, 4, 4080000),
  lab(13, 'Cty CP Giám định Cao Nguyên Nam', 'Lâm Đồng', 'Đạ Huoai, Lâm Đồng', 11.416, 107.577, ['Cadimi'], 55, 3, 4010000),
  lab(14, 'Eurofins Sắc Ký Hải Đăng', 'TP.HCM', 'KCN Tân Bình, TP.HCM', 10.801, 106.632, ['Cadimi', 'Vàng O'], 76, 2, 4350000),
  lab(15, 'TT DV Phân tích thí nghiệm và TĐCL TP.HCM', 'TP.HCM', 'Quận 12, TP.HCM', 10.870, 106.650, ['Cadimi', 'Vàng O'], 97, 2, 4380000, 'Tạm dừng'),
  lab(16, 'Chi nhánh Tentamus VN tại TP.HCM', 'TP.HCM', 'Quận 7, TP.HCM', 10.729, 106.720, ['Cadimi'], 92, 2, 4320000, 'Quá tải'),
  lab(17, 'Cty TNHH Giám định Vinacontrol TP.HCM', 'TP.HCM', 'Bình Thạnh, TP.HCM', 10.801, 106.711, ['Cadimi', 'Vàng O'], 18, 2, 4350000),
  lab(18, 'Cty TNHH DV KHCN Khuê Nam', 'TP.HCM', 'Thủ Đức, TP.HCM', 10.843, 106.788, ['Cadimi'], 23, 2, 4400000),
  lab(19, 'SGS Việt Nam - Trung tâm phía Nam', 'TP.HCM', 'Quận 7, TP.HCM', 10.740, 106.713, ['Cadimi', 'Vàng O'], 72, 2, 4460000),
  lab(20, 'SCI-TECH Laboratory', 'TP.HCM', 'Tân Bình, TP.HCM', 10.801, 106.646, ['Cadimi'], 53, 3, 4310000),
  lab(21, 'Trung tâm kiểm nghiệm AgroLab HCM', 'TP.HCM', 'Hóc Môn, TP.HCM', 10.891, 106.592, ['Cadimi', 'Vàng O'], 47, 3, 4290000),
  lab(22, 'Cty TNHH Green Farm Vina', 'Đồng Tháp', 'Cao Lãnh, Đồng Tháp', 10.460, 105.632, ['Cadimi', 'Vàng O'], 94, 2, 3930000, 'Quá tải'),
  lab(23, 'Phòng kiểm nghiệm Nông sản Sa Đéc', 'Đồng Tháp', 'Sa Đéc, Đồng Tháp', 10.289, 105.756, ['Cadimi'], 49, 4, 3880000),
  lab(24, 'Trung tâm phân tích Đồng Tháp', 'Đồng Tháp', 'Cao Lãnh, Đồng Tháp', 10.454, 105.639, ['Cadimi', 'Vàng O'], 39, 3, 3870000),
  lab(25, 'AgriTest Cần Thơ', 'Cần Thơ', 'Ninh Kiều, Cần Thơ', 10.034, 105.783, ['Cadimi', 'Vàng O'], 52, 3, 4020000),
  lab(26, 'Trung tâm kỹ thuật phân tích Cần Thơ', 'Cần Thơ', 'Cái Răng, Cần Thơ', 10.010, 105.771, ['Cadimi'], 46, 4, 3970000),
  lab(27, 'Phòng kiểm định xuất khẩu Hậu Giang - Cần Thơ', 'Cần Thơ', 'Ô Môn, Cần Thơ', 10.143, 105.647, ['Cadimi', 'Vàng O'], 60, 4, 3990000),
  lab(28, 'Vinacert Long An', 'Long An', 'Bến Lức, Long An', 10.639, 106.451, ['Cadimi', 'Vàng O'], 41, 3, 4060000),
  lab(29, 'Trung tâm kiểm nghiệm Long An', 'Long An', 'Tân An, Long An', 10.538, 106.405, ['Cadimi'], 34, 3, 3980000),
  lab(30, 'AgroLab Tiền Giang', 'Tiền Giang', 'Cái Bè, Tiền Giang', 10.390, 106.000, ['Cadimi', 'Vàng O'], 28, 3, 3970000),
  lab(31, 'Phòng kiểm nghiệm Cai Lậy', 'Tiền Giang', 'Cai Lậy, Tiền Giang', 10.408, 106.119, ['Cadimi'], 35, 4, 3920000),
  lab(32, 'Trung tâm kỹ thuật Mỹ Tho', 'Tiền Giang', 'Mỹ Tho, Tiền Giang', 10.360, 106.359, ['Cadimi', 'Vàng O'], 45, 3, 4010000),
  lab(33, 'Trung tâm phân tích Đồng Nai', 'Đồng Nai', 'Biên Hòa, Đồng Nai', 10.944, 106.823, ['Cadimi', 'Vàng O'], 64, 3, 4170000),
  lab(34, 'AgriLab Biên Hòa', 'Đồng Nai', 'Biên Hòa, Đồng Nai', 10.950, 106.840, ['Cadimi'], 51, 3, 4140000),
  lab(35, 'Becamex TestLab', 'Bình Dương', 'Thủ Dầu Một, Bình Dương', 11.004, 106.651, ['Cadimi', 'Vàng O'], 57, 3, 4210000),
  lab(36, 'Phòng kiểm định Bình Dương', 'Bình Dương', 'Dĩ An, Bình Dương', 10.906, 106.770, ['Cadimi'], 59, 3, 4180000),
  lab(37, 'Trung tâm kiểm nghiệm Bình Thuận', 'Bình Thuận', 'Phan Thiết, Bình Thuận', 10.980, 108.261, ['Cadimi', 'Vàng O'], 62, 4, 4100000),
  lab(38, 'Phòng phân tích Hàm Thuận', 'Bình Thuận', 'Hàm Thuận Nam, Bình Thuận', 10.906, 107.836, ['Cadimi'], 43, 4, 4040000),
  lab(39, 'AgriLab Bà Rịa', 'Bà Rịa - Vũng Tàu', 'Bà Rịa, BR-VT', 10.496, 107.168, ['Cadimi', 'Vàng O'], 55, 3, 4200000),
  lab(40, 'Trung tâm phân tích Vũng Tàu', 'Bà Rịa - Vũng Tàu', 'Phú Mỹ, BR-VT', 10.583, 107.054, ['Cadimi'], 31, 4, 4130000),
  lab(41, 'Viện Kiểm nghiệm và Kiểm định CL VNTEST', 'Hà Nội', 'Cầu Giấy, Hà Nội', 21.036, 105.782, ['Cadimi', 'Vàng O'], 99, 2, 4520000, 'Tạm dừng'),
  lab(42, 'Trung tâm kiểm nghiệm Nông sản Hà Nội', 'Hà Nội', 'Long Biên, Hà Nội', 21.038, 105.910, ['Cadimi'], 66, 3, 4440000),
  lab(43, 'SGS Hà Nội', 'Hà Nội', 'Nam Từ Liêm, Hà Nội', 21.012, 105.764, ['Cadimi', 'Vàng O'], 71, 3, 4490000),
  lab(44, 'Eurofins Hà Nội', 'Hà Nội', 'Hoàng Mai, Hà Nội', 20.979, 105.871, ['Cadimi'], 54, 3, 4470000),
  lab(45, 'Trung tâm kiểm định Quảng Ninh', 'Quảng Ninh', 'Hạ Long, Quảng Ninh', 20.971, 107.044, ['Cadimi', 'Vàng O'], 36, 4, 4460000),
  lab(46, 'AgroLab Quảng Ninh', 'Quảng Ninh', 'Uông Bí, Quảng Ninh', 21.039, 106.778, ['Cadimi'], 33, 4, 4410000),
  lab(47, 'Trung tâm phân tích Bắc Ninh', 'Bắc Ninh', 'TP. Bắc Ninh', 21.186, 106.076, ['Cadimi', 'Vàng O'], 40, 4, 4450000),
  lab(48, 'Phòng kiểm định Lạng Sơn', 'Lạng Sơn', 'TP. Lạng Sơn', 21.847, 106.757, ['Cadimi'], 38, 4, 4480000),
  lab(49, 'Trung tâm kiểm nghiệm cửa khẩu Hữu Nghị', 'Lạng Sơn', 'Cao Lộc, Lạng Sơn', 21.878, 106.699, ['Cadimi', 'Vàng O'], 69, 3, 4500000),
  lab(50, 'AgriTest Sơn La', 'Sơn La', 'Mộc Châu, Sơn La', 20.846, 104.648, ['Cadimi'], 27, 5, 4380000),
];

export const initialShipments: ShipmentRecord[] = [
  { code: 'LG-260913-01', region: 'Krông Pắc, Đắk Lắk', location: 'Krông Pắc, Đắk Lắk', warehouse: 'Đắk Lắk', harvestDate: '2026-09-04', weightKg: 8200, status: 'Đang kiểm nghiệm' },
  { code: 'LG-260910-08', region: 'Cái Bè, Tiền Giang', location: 'Cái Bè, Tiền Giang', warehouse: 'Tiền Giang', harvestDate: '2026-08-31', weightKg: 6500, status: 'Đã có kết quả' },
  { code: 'LG-260905-12', region: 'Cai Lậy, Tiền Giang', location: 'Cai Lậy, Tiền Giang', warehouse: 'Tiền Giang', harvestDate: '2026-08-25', weightKg: 9100, status: 'Đang vận chuyển', transportOption: 'Đường bộ trực tiếp' },
  { code: 'LG-260902-03', region: 'Đạ Huoai, Lâm Đồng', location: 'Đạ Huoai, Lâm Đồng', warehouse: 'Lâm Đồng', harvestDate: '2026-08-20', weightKg: 4800, status: 'Chờ kiểm nghiệm' },
  { code: 'LG-260829-05', region: 'Cao Lãnh, Đồng Tháp', location: 'Cao Lãnh, Đồng Tháp', warehouse: 'Đồng Tháp', harvestDate: '2026-08-16', weightKg: 7200, status: 'Đang kiểm nghiệm' },
  { code: 'LG-260927-11', region: 'Mỹ Tho, Tiền Giang', location: 'Mỹ Tho, Tiền Giang', warehouse: 'Tiền Giang', harvestDate: '2026-09-25', weightKg: 5400, status: 'Đã đặt lịch', bookedLabId: 30, bookedLabName: 'AgroLab Tiền Giang' },
];

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN').format(Math.round(value)) + ' đ';
}

export function formatWeight(weightKg: number) {
  return new Intl.NumberFormat('vi-VN').format(weightKg) + ' kg';
}

export function formatDateVN(dateInput: string | Date) {
  const date = typeof dateInput === 'string' ? new Date(dateInput + (dateInput.includes('T') ? '' : 'T00:00:00')) : dateInput;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function getColdChainEndDate(harvestDate: string) {
  const d = new Date(harvestDate + 'T00:00:00');
  d.setDate(d.getDate() + COLD_CHAIN_DAYS);
  return d;
}

export function getRemainingColdDays(harvestDate: string, baseDate?: Date) {
  const now = baseDate ? new Date(baseDate) : new Date();
  now.setHours(0, 0, 0, 0);
  const harvest = new Date(harvestDate + 'T00:00:00');
  harvest.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((now.getTime() - harvest.getTime()) / 86400000);
  return Math.max(0, COLD_CHAIN_DAYS - diffDays);
}

export function haversineDistanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (n: number) => (n * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sa =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return Math.round(R * 2 * Math.atan2(Math.sqrt(sa), Math.sqrt(1 - sa)));
}

function parseLegacyWeight(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string') return 0;
  const digits = value.replace(/[^0-9]/g, '');
  return Number(digits || 0);
}

function parseLegacyDate(value: unknown): string {
  if (typeof value !== 'string' || !value) return new Date().toISOString().slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return new Date().toISOString().slice(0, 10);
  const [, d, m, y] = match;
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

function inferWarehouse(location: string): string {
  const known = Object.keys(REGION_COORDS);
  return known.find((name) => location.includes(name)) ?? 'Đắk Lắk';
}

function normalizeShipment(raw: any): ShipmentRecord {
  const location = String(raw?.location ?? raw?.region ?? 'Đắk Lắk');
  return {
    code: String(raw?.code ?? `LG-${Date.now()}`),
    region: String(raw?.region ?? location),
    location,
    warehouse: String(raw?.warehouse ?? inferWarehouse(location)),
    harvestDate: parseLegacyDate(raw?.harvestDate ?? raw?.harvest),
    weightKg: parseLegacyWeight(raw?.weightKg ?? raw?.weight),
    status: (raw?.status ?? 'Chờ kiểm nghiệm') as ShipmentStatus,
    bookedLabId: typeof raw?.bookedLabId === 'number' ? raw.bookedLabId : undefined,
    bookedLabName: typeof raw?.bookedLabName === 'string' ? raw.bookedLabName : undefined,
    transportOption: typeof raw?.transportOption === 'string' ? raw.transportOption : undefined,
  };
}

export function getShipmentStorage(): ShipmentRecord[] {
  if (typeof window === 'undefined') return initialShipments;
  const raw = window.localStorage.getItem(STORAGE_KEYS.shipments);
  if (!raw) return initialShipments;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return initialShipments;
    const normalized = parsed.map(normalizeShipment);
    window.localStorage.setItem(STORAGE_KEYS.shipments, JSON.stringify(normalized));
    return normalized;
  } catch {
    return initialShipments;
  }
}

export function setShipmentStorage(rows: ShipmentRecord[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEYS.shipments, JSON.stringify(rows));
}

export function getLoadTone(load: number) {
  if (load >= 85) return 'danger';
  if (load >= 50) return 'warn';
  return 'good';
}

