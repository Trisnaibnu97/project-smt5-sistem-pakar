import { RoleType, UserProfile, Student, IndicatorCategory, AnswerScaleOption, FollowUpItem, AuditLogItem } from '../types';

export const ROLES: Record<RoleType, UserProfile> = {
  bk: {
    name: 'Ustadzah Rahma, S.Psi',
    label: 'Guru BK',
    initials: 'UR',
    email: 'bk@sdit-uq.sch.id',
    defaultPage: 'dashboard-bk',
    allowedNav: ['dashboard', 'skrining', 'daftar-siswa', 'tindak-lanjut', 'laporan', 'panduan'],
  },
  wali: {
    name: 'Ustadz Ahmad, S.Pd (Wali 3A)',
    label: 'Wali Kelas',
    initials: 'UA',
    email: 'wali3a@sdit-uq.sch.id',
    defaultPage: 'dashboard-wali',
    allowedNav: ['dashboard', 'daftar-siswa', 'skrining', 'tindak-lanjut', 'panduan'],
  },
  admin: {
    name: 'Administrator Sistem',
    label: 'Admin',
    initials: 'AS',
    email: 'admin@sdit-uq.sch.id',
    defaultPage: 'dashboard-admin',
    allowedNav: ['dashboard', 'basis-pengetahuan', 'daftar-siswa', 'laporan', 'panduan'],
  },
};

export const DEMO_SISWA: Student[] = [
  { id: 1, nama: 'Ahmad Rizki Pratama', kelas: '4A', obs: '18 Okt 2026', status: 'perlu-review' },
  { id: 2, nama: 'Bunga Amelia Sari', kelas: '4A', obs: '15 Okt 2026', status: 'berjalan' },
  { id: 3, nama: 'Cahaya Nur Fajri', kelas: '4A', obs: '10 Okt 2026', status: 'selesai' },
  { id: 4, nama: 'Dafa Ramadhan', kelas: '4B', obs: '—', status: 'belum' },
  { id: 5, nama: 'Elisa Putri Rahayu', kelas: '5A', obs: '20 Okt 2026', status: 'perlu-review' },
  { id: 6, nama: 'Fajar Nugraha', kelas: '5A', obs: '12 Okt 2026', status: 'berjalan' },
  { id: 7, nama: 'Gita Maharani', kelas: '5B', obs: '—', status: 'belum' },
  { id: 8, nama: 'Hafiz Aditya', kelas: '4B', obs: '19 Okt 2026', status: 'perlu-review' },
];

export const ANSWER_SCALE: AnswerScaleOption[] = [
  { value: 'tidak-pernah', label: 'Tidak pernah', cfUser: 0.0 },
  { value: 'jarang', label: 'Jarang (1–2×/minggu)', cfUser: 0.25 },
  { value: 'kadang', label: 'Kadang (3–4×/minggu)', cfUser: 0.5 },
  { value: 'sering', label: 'Sering (hampir setiap hari)', cfUser: 0.75 },
  { value: 'selalu', label: 'Selalu', cfUser: 1.0 },
  { value: 'belum', label: 'Belum diamati / Tidak cukup data', cfUser: null },
];

export const OBS_CATEGORIES: IndicatorCategory[] = [
  {
    kategori: 'H01: Literasi & Membaca Dasar',
    kodeHypothesis: 'H01',
    status: 'aktif',
    versi: 'v1.0-RC',
    indikator: [
      { id: 'obs-01', kode: 'I01', teks: 'Sering tertukar/terbalik membaca huruf serupa (b/d, p/q, m/w, u/n)', mb: 0.8, md: 0.05 },
      { id: 'obs-02', kode: 'I02', teks: 'Membaca terbata-bata dengan kecepatan jauh di bawah jenjang kelasnya', mb: 0.7, md: 0.1 },
      { id: 'obs-03', kode: 'I03', teks: 'Sering melewati kata, baris kalimat, atau mengulang baris saat membaca', mb: 0.6, md: 0.1 },
      { id: 'obs-04', kode: 'I04', teks: 'Kesulitan mengeja kata sederhana secara tertulis kendati berulang kali diajarkan', mb: 0.65, md: 0.1 },
    ],
  },
  {
    kategori: 'H02: Numerasi & Matematika Dasar',
    kodeHypothesis: 'H02',
    status: 'aktif',
    versi: 'v1.0-RC',
    indikator: [
      { id: 'obs-05', kode: 'I05', teks: 'Kesulitan mengenali atau tertukar simbol matematika dasar (+, −, ×, ÷, =)', mb: 0.75, md: 0.05 },
      { id: 'obs-06', kode: 'I06', teks: 'Kesulitan memahami konsep nilai tempat (membedakan puluhan dan ratusan)', mb: 0.7, md: 0.1 },
      { id: 'obs-07', kode: 'I07', teks: 'Ketergantungan ekstrem pada hitungan jari fisik untuk penjumlahan angka sederhana (<10)', mb: 0.6, md: 0.15 },
      { id: 'obs-08', kode: 'I08', teks: 'Sering salah memahami soal cerita matematika meski kata-katanya sederhana', mb: 0.65, md: 0.1 },
    ],
  },
  {
    kategori: 'H03: Regulasi Perhatian & Konsentrasi Belajar',
    kodeHypothesis: 'H03',
    status: 'aktif',
    versi: 'v1.0-RC',
    indikator: [
      { id: 'obs-09', kode: 'I09', teks: 'Sulit mempertahankan fokus pada tugas mandiri lebih dari 10–15 menit', mb: 0.7, md: 0.1 },
      { id: 'obs-10', kode: 'I10', teks: 'Sangat mudah terdistraksi oleh stimulus lingkungan sekitar di kelas', mb: 0.65, md: 0.1 },
      { id: 'obs-11', kode: 'I11', teks: 'Sering tidak menuntaskan tugas kelas karena melamun atau sibuk dengan benda lain', mb: 0.6, md: 0.1 },
      { id: 'obs-12', kode: 'I12', teks: 'Kerap lupa instruksi yang terdiri atas 2–3 langkah berurutan', mb: 0.55, md: 0.15 },
    ],
  },
  {
    kategori: 'H04: Regulasi Emosi & Interaksi Belajar',
    kodeHypothesis: 'H04',
    status: 'aktif',
    versi: 'v1.0-RC',
    indikator: [
      { id: 'obs-13', kode: 'I13', teks: 'Menunjukkan kecemasan ekstrem (menangis, mengeluh sakit) saat evaluasi/tugas baru', mb: 0.6, md: 0.15 },
      { id: 'obs-14', kode: 'I14', teks: 'Sangat mudah menyerah, merobek kertas, atau marah saat membuat kesalahan kecil', mb: 0.65, md: 0.1 },
      { id: 'obs-15', kode: 'I15', teks: 'Enggan terlibat atau menarik diri saat aktivitas belajar kelompok', mb: 0.5, md: 0.2 },
    ],
  },
];

export const INITIAL_FOLLOW_UPS: FollowUpItem[] = [
  { id: 1, siswa: 'Ahmad Rizki Pratama [DEMO]', jenis: 'Observasi lanjutan', status: 'Berjalan', tgl: '31 Okt 2026', catatan: 'Lakukan observasi lanjutan selama 2 minggu pada jam membaca nyaring.' },
  { id: 2, siswa: 'Bunga Amelia Sari [DEMO]', jenis: 'Strategi pembelajaran khusus', status: 'Selesai', tgl: '20 Okt 2026', catatan: 'Tempat duduk dipindah lebih dekat ke papan tulis dan diberikan penguatan visual.' },
  { id: 3, siswa: 'Elisa Putri Rahayu [DEMO]', jenis: 'Diskusi internal (guru)', status: 'Menunggu', tgl: '28 Okt 2026', catatan: 'Jadwalkan diskusi dengan guru matematika dan wali kelas 5A.' },
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  { id: 1, waktu: '27 Okt 2026 09:00', aksi: 'Basis pengetahuan v1.0-RC diaktifkan', oleh: 'Rini Handayani [DEMO]' },
  { id: 2, waktu: '26 Okt 2026 14:32', aksi: 'Kategori H04 diperbarui ke standar edukatif', oleh: 'Rini Handayani [DEMO]' },
  { id: 3, waktu: '25 Okt 2026 09:10', aksi: 'Indikator I13-I15 disetujui reviewer pakar', oleh: 'Sri Wahyuni [DEMO]' },
  { id: 4, waktu: '24 Okt 2026 16:45', aksi: 'Akun Guru BK baru ditambahkan', oleh: 'Rini Handayani [DEMO]' },
];
