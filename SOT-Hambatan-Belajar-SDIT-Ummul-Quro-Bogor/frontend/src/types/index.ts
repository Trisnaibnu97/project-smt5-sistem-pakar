export type RoleType = 'bk' | 'wali' | 'admin';

export interface UserProfile {
  name: string;
  label: string;
  initials: string;
  email: string;
  defaultPage: string;
  allowedNav: string[];
}

export interface Student {
  id: number;
  nama: string;
  kelas: string;
  obs: string;
  status: 'perlu-review' | 'berjalan' | 'selesai' | 'belum';
}

export interface Indicator {
  id: string;
  kode: string;
  teks: string;
  mb: number;
  md: number;
}

export interface IndicatorCategory {
  kategori: string;
  kodeHypothesis: string;
  status?: string;
  versi?: string;
  indikator: Indicator[];
}

export type AnswerScaleValue = 'tidak-pernah' | 'jarang' | 'kadang' | 'sering' | 'selalu' | 'belum';

export interface AnswerScaleOption {
  value: AnswerScaleValue;
  label: string;
  cfUser: number | null;
}

export interface ScreeningAnswer {
  indicator: Indicator;
  answer: AnswerScaleValue;
  cfUser: number | null;
}

export interface CategoryResult {
  kategori: string;
  cf: number | null;
  isInsufficient: boolean;
  supporting: { teks: string; jawaban: string }[];
  missing: string[];
}

export interface FollowUpItem {
  id: number;
  siswa: string;
  jenis: string;
  status: 'Menunggu' | 'Berjalan' | 'Selesai';
  tgl: string;
  catatan: string;
}

export interface AuditLogItem {
  id: number;
  waktu: string;
  aksi: string;
  oleh: string;
}

export interface ToastState {
  show: boolean;
  msg: string;
  type: 'success' | 'error' | 'info';
}
