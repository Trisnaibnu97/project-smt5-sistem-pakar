import React, { useState, useEffect } from 'react';
import { api, ApiError } from '../services/api';

interface BasisPengetahuanPageProps {
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

interface ApiKbVersion {
  id: number;
  version_code: string;
  status: string;
  reviewer_name: string;
  notes: string;
  activated_at: string | null;
  hypotheses: Array<{
    id: number;
    code: string;
    name: string;
    description: string;
    cf_rules: Array<{
      id: number;
      expert_mb: number;
      expert_md: number;
      expert_cf: number;
      indicator: {
        id: number;
        code: string;
        operational_text: string;
        observation_guide: string | null;
      };
    }>;
  }>;
}

export const BasisPengetahuanPage: React.FC<BasisPengetahuanPageProps> = ({ onShowToast }) => {
  const [kbVersion, setKbVersion] = useState<ApiKbVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getActiveKb()
      .then((res) => setKbVersion(res.kb_version as unknown as ApiKbVersion))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Gagal memuat basis pengetahuan.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted">
        <svg className="animate-spin w-6 h-6 mr-2 text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        Memuat basis pengetahuan aktif…
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="page-title">Basis Pengetahuan Certainty Factor</h1>
        <div className="card bg-red-50 border-red-200 text-danger text-sm">{error}</div>
      </div>
    );
  }

  if (!kbVersion) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Basis Pengetahuan Certainty Factor</h1>
          <p className="text-sm text-muted mt-0.5">
            Daftar indikator, aturan hipotesis, dan bobot pakar (MB/MD) tervalidasi Phase 2.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-green py-1 px-3">Versi Aktif: {kbVersion.version_code}</span>
        </div>
      </div>

      {/* KB Meta info */}
      <div className="card bg-primary-light/30 border border-primary/20 text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <p className="text-xs text-muted">Reviewer / Pakar</p>
            <p className="font-medium text-ink">{kbVersion.reviewer_name ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Status</p>
            <p className="font-semibold text-success capitalize">{kbVersion.status}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Diaktifkan</p>
            <p className="font-medium text-ink">
              {kbVersion.activated_at
                ? new Date(kbVersion.activated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                : '—'}
            </p>
          </div>
        </div>
        {kbVersion.notes && (
          <p className="text-xs text-muted mt-3 italic">{kbVersion.notes}</p>
        )}
      </div>

      {/* Hypothesis cards */}
      <div className="space-y-6">
        {kbVersion.hypotheses.map((hypo) => (
          <div key={hypo.id} className="card">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h2 className="section-title">
                  <span className="font-mono text-primary mr-1">{hypo.code}</span> — {hypo.name}
                </h2>
                {hypo.description && (
                  <p className="text-xs text-muted mt-1">{hypo.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="badge badge-green">Aktif</span>
                <button
                  onClick={() => onShowToast('Perubahan basis pengetahuan hanya dapat dilakukan oleh Pakar Reviewer & Admin.', 'info')}
                  className="btn-secondary text-xs py-1 px-3"
                >
                  Ajukan Revisi
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted text-left">
                    <th className="pb-2 font-medium">Kode</th>
                    <th className="pb-2 font-medium">Indikator Observasi Terukur</th>
                    <th className="pb-2 font-medium text-right">MB</th>
                    <th className="pb-2 font-medium text-right">MD</th>
                    <th className="pb-2 font-medium text-right">CF Pakar</th>
                  </tr>
                </thead>
                <tbody>
                  {hypo.cf_rules.map((rule) => (
                    <tr key={rule.id} className="border-b border-border last:border-0 hover:bg-page transition-colors">
                      <td className="py-2.5 text-primary font-mono font-bold">{rule.indicator.code}</td>
                      <td className="py-2.5 text-ink">
                        <div>{rule.indicator.operational_text}</div>
                        {rule.indicator.observation_guide && (
                          <div className="text-xs text-muted italic mt-0.5">📋 {rule.indicator.observation_guide}</div>
                        )}
                      </td>
                      <td className="py-2.5 text-primary font-semibold text-right">{rule.expert_mb.toFixed(2)}</td>
                      <td className="py-2.5 text-danger font-semibold text-right">{rule.expert_md.toFixed(2)}</td>
                      <td className="py-2.5 font-bold text-ink text-right">{rule.expert_cf.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-muted mt-3">
              ⚠ Nilai MB dan MD mencerminkan derajat keyakinan dan ketidakyakinan pakar reviewer SDIT Ummul Quro Bogor. Tidak boleh diubah tanpa proses review formal.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
