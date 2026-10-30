import React, { useState, useEffect } from 'react';
import { api, ApiError } from '../services/api';

interface AggregateReport {
  report_title: string;
  privacy_notice: string;
  total_screenings: number;
  by_indication_level: Array<{ indication_level: string; total: number }>;
  by_hypothesis: Array<{ hypothesis_code: string; hypothesis_name: string; indication_level: string; count: number }>;
}

const INDICATION_LEVEL_LABELS: Record<string, string> = {
  kuat: 'Indikasi Kuat',
  sedang: 'Indikasi Sedang',
  rendah: 'Indikasi Rendah',
  belum_cukup_data: 'Belum Cukup Data',
};

const INDICATION_LEVEL_COLORS: Record<string, string> = {
  kuat: 'bg-danger',
  sedang: 'bg-warning',
  rendah: 'bg-success',
  belum_cukup_data: 'bg-gray-300',
};

export const LaporanPage: React.FC = () => {
  const [report, setReport] = useState<AggregateReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getAggregateReport()
      .then(setReport)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Gagal memuat laporan.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted">
        <svg className="animate-spin w-6 h-6 mr-2 text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        Memuat laporan agregat…
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="page-title">Laporan Agregat Skrining</h1>
        <div className="card bg-red-50 border-red-200 text-danger text-sm">{error}</div>
      </div>
    );
  }

  if (!report) return null;

  // Group by_hypothesis into per-hypothesis with all levels
  const hypothesisGroups: Record<string, { name: string; data: Record<string, number> }> = {};
  report.by_hypothesis.forEach((item) => {
    if (!hypothesisGroups[item.hypothesis_code]) {
      hypothesisGroups[item.hypothesis_code] = { name: item.hypothesis_name, data: {} };
    }
    hypothesisGroups[item.hypothesis_code].data[item.indication_level] = item.count;
  });

  const totalByLevel = report.by_indication_level;
  const maxLevel = Math.max(...totalByLevel.map((d) => d.total), 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Laporan Agregat Skrining</h1>
          <p className="text-sm text-muted mt-0.5">
            Ringkasan data agregat tanpa mempublikasikan identitas pribadi siswa.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="badge badge-orange">DATA BACKEND LIVE</span>
          <button
            onClick={() => window.print()}
            className="btn-primary shrink-0 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Cetak Laporan / PDF
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-3xl font-extrabold text-primary">{report.total_screenings}</p>
          <p className="text-xs text-muted mt-1">Total Sesi Skrining</p>
        </div>
        {totalByLevel.map((lvl) => (
          <div key={lvl.indication_level} className="card text-center">
            <p className={`text-3xl font-extrabold ${
              lvl.indication_level === 'kuat' ? 'text-danger' :
              lvl.indication_level === 'sedang' ? 'text-warning' :
              lvl.indication_level === 'rendah' ? 'text-success' : 'text-muted'
            }`}>{lvl.total}</p>
            <p className="text-xs text-muted mt-1">{INDICATION_LEVEL_LABELS[lvl.indication_level] ?? lvl.indication_level}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distribution bar chart */}
        <div className="card">
          <h2 className="section-title mb-1">Distribusi Tingkat Indikasi</h2>
          <p className="text-xs text-muted mb-4">Berdasarkan seluruh hasil skrining</p>
          <div className="space-y-4">
            {totalByLevel.map((lvl) => (
              <div key={lvl.indication_level}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-ink font-medium">{INDICATION_LEVEL_LABELS[lvl.indication_level] ?? lvl.indication_level}</span>
                  <span className="text-muted font-bold">{lvl.total} hasil</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`cf-bar h-2.5 rounded-full ${INDICATION_LEVEL_COLORS[lvl.indication_level] ?? 'bg-primary'}`}
                    style={{ width: `${Math.round((lvl.total / maxLevel) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By hypothesis */}
        <div className="card">
          <h2 className="section-title mb-1">Breakdown per Kategori Hipotesis</h2>
          <p className="text-xs text-muted mb-4">Distribusi indikasi per jenis hambatan belajar</p>
          <div className="space-y-5">
            {Object.entries(hypothesisGroups).map(([code, group]) => {
              const total = Object.values(group.data).reduce((a, b) => a + b, 0);
              return (
                <div key={code}>
                  <p className="text-sm font-semibold text-ink mb-2">
                    <span className="font-mono text-primary mr-1">{code}</span> {group.name}
                    <span className="text-muted font-normal text-xs ml-2">({total} hasil)</span>
                  </p>
                  <div className="space-y-1">
                    {Object.entries(group.data).map(([level, count]) => (
                      <div key={level} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${INDICATION_LEVEL_COLORS[level] ?? 'bg-primary'}`} />
                        <span className="text-xs text-muted w-32">{INDICATION_LEVEL_LABELS[level] ?? level}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${INDICATION_LEVEL_COLORS[level] ?? 'bg-primary'}`}
                            style={{ width: total > 0 ? `${Math.round((count / total) * 100)}%` : '0%' }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-ink w-6 text-right">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            {Object.keys(hypothesisGroups).length === 0 && (
              <p className="text-sm text-muted">Belum ada data skrining yang dihitung.</p>
            )}
          </div>
        </div>
      </div>

      {/* Privacy notice */}
      <div className="card bg-gray-50 border-dashed">
        <h3 className="text-sm font-semibold text-ink mb-1">Prinsip Perlindungan Data Anak</h3>
        <p className="text-xs text-muted leading-relaxed">{report.privacy_notice}</p>
        <p className="text-xs text-muted mt-2 leading-relaxed">
          Sistem tidak menyediakan fitur ranking, pemeringkatan kecerdasan, atau publikasi hasil individual kepada pihak luar
          sesuai dengan Undang-Undang Perlindungan Data Pribadi (UU PDP) dan kebijakan sekolah.
        </p>
      </div>
    </div>
  );
};
