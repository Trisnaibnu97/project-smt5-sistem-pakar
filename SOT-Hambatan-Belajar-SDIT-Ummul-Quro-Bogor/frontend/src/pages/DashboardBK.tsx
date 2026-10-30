import React from 'react';

interface DashboardBKProps {
  onNavigate: (page: string) => void;
}

export const DashboardBK: React.FC<DashboardBKProps> = ({ onNavigate }) => {
  const reviewCases = [
    { nama: 'Ahmad Rizki Pratama [DEMO]', kelas: '4A', indikasi: 'Membaca & Perhatian', status: 'Perlu Review' },
    { nama: 'Elisa Putri Rahayu [DEMO]', kelas: '5A', indikasi: 'Matematika', status: 'Perlu Review' },
    { nama: 'Hafiz Aditya [DEMO]', kelas: '4B', indikasi: 'Perhatian & Konsentrasi', status: 'Perlu Review' },
    { nama: 'Rafi Aulia [DEMO]', kelas: '3A', indikasi: 'Sosial Emosional', status: 'Perlu Review' },
  ];

  const recentObs = [
    { siswa: 'Ahmad Rizki Pratama [DEMO]', oleh: 'Wali Kelas 4A', waktu: '18 Okt 2026', indikator: 'Kesulitan membaca lancar, membalik huruf b/d' },
    { siswa: 'Bunga Amelia Sari [DEMO]', oleh: 'Guru BK', waktu: '15 Okt 2026', indikator: 'Kesulitan konsentrasi lebih dari 15 menit' },
    { siswa: 'Elisa Putri Rahayu [DEMO]', oleh: 'Wali Kelas 5A', waktu: '20 Okt 2026', indikator: 'Sering salah menghitung operasi dasar' },
  ];

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Dashboard Guru BK</h1>
          <p className="text-sm text-muted mt-0.5">Pantau kasus observasi dan rekomendasi intervensi edukatif siswa.</p>
        </div>
        <button onClick={() => onNavigate('skrining')} className="btn-primary shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Mulai Skrining Baru
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-xs text-muted font-medium">Kasus Perlu Review</p>
          <p className="text-3xl font-extrabold text-ink mt-2">4</p>
          <span className="badge badge-orange mt-2">Segera ditinjau</span>
        </div>
        <div className="card">
          <p className="text-xs text-muted font-medium">Tindak Lanjut Berjalan</p>
          <p className="text-3xl font-extrabold text-ink mt-2">8</p>
          <span className="badge badge-blue mt-2">Dalam pemantauan</span>
        </div>
        <div className="card">
          <p className="text-xs text-muted font-medium">Total Skrining Bulan Ini</p>
          <p className="text-3xl font-extrabold text-ink mt-2">19</p>
          <span className="badge badge-green mt-2">+5 dari bulan lalu</span>
        </div>
        <div className="card">
          <p className="text-xs text-muted font-medium">Selesai Ditangani</p>
          <p className="text-3xl font-extrabold text-ink mt-2">15</p>
          <span className="badge badge-green mt-2">Tercapai target</span>
        </div>
      </div>

      {/* Review Cases Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Kasus Menunggu Review Pakar BK</h2>
          <button onClick={() => onNavigate('daftar-siswa')} className="text-primary text-xs font-semibold hover:underline">
            Lihat Semua Siswa →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted text-left">
                <th className="pb-3 font-medium">Nama Siswa</th>
                <th className="pb-3 font-medium">Kelas</th>
                <th className="pb-3 font-medium">Indikasi Utama</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {reviewCases.map((c, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-page transition-colors">
                  <td className="py-3 font-medium text-ink">{c.nama}</td>
                  <td className="py-3 text-muted">{c.kelas}</td>
                  <td className="py-3">{c.indikasi}</td>
                  <td className="py-3">
                    <span className="badge badge-orange">{c.status}</span>
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => onNavigate('skrining')}
                      className="text-primary text-xs font-semibold hover:underline"
                    >
                      Tinjau
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Observations */}
      <div className="card">
        <h2 className="section-title mb-4">Observasi Terakhir dari Wali Kelas</h2>
        <div className="space-y-3">
          {recentObs.map((o, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-start gap-3 p-4 bg-page rounded-xl border border-border">
              <div className="w-9 h-9 shrink-0 bg-primary-light rounded-xl flex items-center justify-center text-primary font-bold text-sm">
                {o.siswa.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink truncate">{o.siswa}</p>
                <p className="text-xs text-muted">
                  {o.oleh} · {o.waktu}
                </p>
                <p className="text-sm text-ink mt-1">{o.indikator}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
