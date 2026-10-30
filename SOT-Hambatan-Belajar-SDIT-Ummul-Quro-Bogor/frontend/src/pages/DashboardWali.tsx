import React from 'react';

interface DashboardWaliProps {
  onNavigate: (page: string) => void;
}

export const DashboardWali: React.FC<DashboardWaliProps> = ({ onNavigate }) => {
  const pendingObs = [
    { siswa: 'Dafa Ramadhan [DEMO]', kelas: '4A', indikator: 'Hambatan Membaca', deadline: '31 Okt 2026' },
    { siswa: 'Gita Maharani [DEMO]', kelas: '4A', indikator: 'Hambatan Perhatian', deadline: '31 Okt 2026' },
    { siswa: 'Hafiz Aditya [DEMO]', kelas: '4A', indikator: 'Hambatan Matematika', deadline: '31 Okt 2026' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Dashboard Wali Kelas 4A</h1>
          <p className="text-sm text-muted mt-0.5">Catat observasi KBM siswa dan pantau tindak lanjut edukatif.</p>
        </div>
        <button onClick={() => onNavigate('skrining')} className="btn-primary shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Mulai Observasi Siswa
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-xs text-muted font-medium">Siswa Kelas 4A</p>
          <p className="text-3xl font-extrabold text-ink mt-2">28</p>
          <span className="badge badge-gray mt-2">Aktif KBM</span>
        </div>
        <div className="card">
          <p className="text-xs text-muted font-medium">Observasi Berjalan</p>
          <p className="text-3xl font-extrabold text-ink mt-2">3</p>
          <span className="badge badge-orange mt-2">Perlu tindak lanjut</span>
        </div>
        <div className="card">
          <p className="text-xs text-muted font-medium">Telah Diskrining BK</p>
          <p className="text-3xl font-extrabold text-ink mt-2">5</p>
          <span className="badge badge-green mt-2">Terdokumentasi</span>
        </div>
        <div className="card">
          <p className="text-xs text-muted font-medium">Perlu Koordinasi</p>
          <p className="text-3xl font-extrabold text-ink mt-2">2</p>
          <span className="badge badge-blue mt-2">Jadwalkan diskusi</span>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Observasi Siswa yang Disarankan Bulan Ini</h2>
          <button onClick={() => onNavigate('daftar-siswa')} className="text-primary text-xs font-semibold hover:underline">
            Lihat Siswa Kelas 4A →
          </button>
        </div>
        <div className="space-y-3">
          {pendingObs.map((p, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-page rounded-xl border border-border">
              <div>
                <p className="text-sm font-semibold text-ink">{p.siswa}</p>
                <p className="text-xs text-muted">
                  {p.kelas} · {p.indikator} · Deadline pengamatan: {p.deadline}
                </p>
              </div>
              <button onClick={() => onNavigate('skrining')} className="btn-secondary text-xs py-1.5 px-3">
                Isi Observasi
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
