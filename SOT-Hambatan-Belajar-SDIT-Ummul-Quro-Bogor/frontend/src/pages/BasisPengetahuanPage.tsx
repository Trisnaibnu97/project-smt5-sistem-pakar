import React, { useState, useEffect } from 'react';
import { api, ApiError } from '../services/api';

interface BasisPengetahuanPageProps {
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

interface IndicatorData {
  id: number;
  code: string;
  operational_text: string;
  observation_guide: string | null;
}

interface CfRuleData {
  id: number;
  expert_mb: number;
  expert_md: number;
  expert_cf: number;
  indicator: IndicatorData;
}

interface HypothesisData {
  id: number;
  code: string;
  name: string;
  description: string;
  cf_rules: CfRuleData[];
}

interface ApiKbVersion {
  id: number;
  version_code: string;
  status: string;
  reviewer_name: string;
  notes: string;
  activated_at: string | null;
  hypotheses: HypothesisData[];
}

export const BasisPengetahuanPage: React.FC<BasisPengetahuanPageProps> = ({ onShowToast }) => {
  const [kbVersion, setKbVersion] = useState<ApiKbVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal states
  const [modalType, setModalType] = useState<'edit-rule' | 'add-rule' | 'edit-hypo' | 'add-hypo' | 'delete-confirm' | null>(null);
  const [activeHypothesis, setActiveHypothesis] = useState<HypothesisData | null>(null);
  const [activeRule, setActiveRule] = useState<CfRuleData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'rule' | 'hypo'; id: number; name: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form fields for Hypothesis
  const [hypoForm, setHypoForm] = useState({ code: '', name: '', description: '' });

  // Form fields for Rule & Indicator
  const [ruleForm, setRuleForm] = useState({
    indicatorCode: '',
    indicatorText: '',
    observationGuide: '',
    mb: '0.70',
    md: '0.10',
  });

  const loadKb = async () => {
    try {
      const res = await api.getActiveKb();
      setKbVersion(res.kb_version as unknown as ApiKbVersion);
      setError('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal memuat basis pengetahuan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKb();
  }, []);

  // --- Modal Openers ---
  const handleOpenAddHypothesis = () => {
    setHypoForm({ code: '', name: '', description: '' });
    setModalType('add-hypo');
  };

  const handleOpenEditHypothesis = (hypo: HypothesisData) => {
    setActiveHypothesis(hypo);
    setHypoForm({ code: hypo.code, name: hypo.name, description: hypo.description || '' });
    setModalType('edit-hypo');
  };

  const handleOpenAddRule = (hypo: HypothesisData) => {
    setActiveHypothesis(hypo);
    setRuleForm({
      indicatorCode: `I${Math.floor(Math.random() * 90 + 10)}`,
      indicatorText: '',
      observationGuide: '',
      mb: '0.70',
      md: '0.10',
    });
    setModalType('add-rule');
  };

  const handleOpenEditRule = (hypo: HypothesisData, rule: CfRuleData) => {
    setActiveHypothesis(hypo);
    setActiveRule(rule);
    setRuleForm({
      indicatorCode: rule.indicator.code,
      indicatorText: rule.indicator.operational_text,
      observationGuide: rule.indicator.observation_guide || '',
      mb: rule.expert_mb.toString(),
      md: rule.expert_md.toString(),
    });
    setModalType('edit-rule');
  };

  const handleOpenDelete = (type: 'rule' | 'hypo', id: number, name: string) => {
    setDeleteTarget({ type, id, name });
    setModalType('delete-confirm');
  };

  // --- Submissions ---
  const handleSaveHypothesis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kbVersion) return;
    setIsSubmitting(true);
    try {
      if (modalType === 'add-hypo') {
        await api.createHypothesis({
          kb_version_id: kbVersion.id,
          code: hypoForm.code.trim().toUpperCase(),
          name: hypoForm.name.trim(),
          description: hypoForm.description.trim(),
        });
        onShowToast(`Kategori ${hypoForm.code} berhasil ditambahkan!`, 'success');
      } else if (modalType === 'edit-hypo' && activeHypothesis) {
        await api.updateHypothesis(activeHypothesis.id, {
          code: hypoForm.code.trim().toUpperCase(),
          name: hypoForm.name.trim(),
          description: hypoForm.description.trim(),
        });
        onShowToast(`Kategori ${hypoForm.code} berhasil diperbarui!`, 'success');
      }
      setModalType(null);
      await loadKb();
    } catch (err) {
      onShowToast(err instanceof ApiError ? err.message : 'Gagal menyimpan kategori hipotesis.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kbVersion || !activeHypothesis) return;
    setIsSubmitting(true);

    const mbNum = parseFloat(ruleForm.mb);
    const mdNum = parseFloat(ruleForm.md);

    if (isNaN(mbNum) || mbNum < 0 || mbNum > 1 || isNaN(mdNum) || mdNum < 0 || mdNum > 1) {
      onShowToast('Nilai MB dan MD harus berupa angka antara 0.00 dan 1.00', 'error');
      setIsSubmitting(false);
      return;
    }

    try {
      if (modalType === 'add-rule') {
        // 1. Buat indikator terlebih dahulu
        const indRes = await api.createIndicator({
          kb_version_id: kbVersion.id,
          code: ruleForm.indicatorCode.trim().toUpperCase(),
          operational_text: ruleForm.indicatorText.trim(),
          observation_guide: ruleForm.observationGuide.trim() || undefined,
        });

        // 2. Hubungkan ke CF Rule
        await api.createRule({
          hypothesis_id: activeHypothesis.id,
          indicator_id: indRes.indicator.id,
          expert_mb: mbNum,
          expert_md: mdNum,
        });

        onShowToast(`Indikator & Aturan ${ruleForm.indicatorCode} berhasil ditambahkan!`, 'success');
      } else if (modalType === 'edit-rule' && activeRule) {
        // Update teks indikator
        await api.updateIndicator(activeRule.indicator.id, {
          code: ruleForm.indicatorCode.trim().toUpperCase(),
          operational_text: ruleForm.indicatorText.trim(),
          observation_guide: ruleForm.observationGuide.trim() || undefined,
        });

        // Update bobot MB / MD
        await api.updateRule(activeRule.id, {
          expert_mb: mbNum,
          expert_md: mdNum,
        });

        onShowToast(`Aturan CF ${ruleForm.indicatorCode} berhasil diperbarui!`, 'success');
      }
      setModalType(null);
      await loadKb();
    } catch (err) {
      onShowToast(err instanceof ApiError ? err.message : 'Gagal menyimpan aturan indikator.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    try {
      if (deleteTarget.type === 'rule') {
        await api.deleteRule(deleteTarget.id);
        onShowToast(`Aturan CF berhasil dihapus.`, 'info');
      } else {
        await api.deleteHypothesis(deleteTarget.id);
        onShowToast(`Kategori hipotesis ${deleteTarget.name} berhasil dihapus.`, 'info');
      }
      setModalType(null);
      await loadKb();
    } catch (err) {
      onShowToast(err instanceof ApiError ? err.message : 'Gagal menghapus item.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Basis Pengetahuan Certainty Factor</h1>
          <p className="text-sm text-muted mt-0.5">
            Kelola dan modifikasi kategori hipotesis hambatan belajar, indikator observasi, dan bobot pakar (MB/MD).
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button onClick={handleOpenAddHypothesis} className="btn-primary text-xs py-2 px-3.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Tambah Kategori Baru
          </button>
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
          <div key={hypo.id} className="card shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 pb-3 border-b border-border">
              <div>
                <h2 className="section-title flex items-center gap-2">
                  <span className="font-mono bg-primary-light text-primary-dark px-2 py-0.5 rounded text-sm font-bold">
                    {hypo.code}
                  </span>
                  <span>{hypo.name}</span>
                </h2>
                {hypo.description && (
                  <p className="text-xs text-muted mt-1 leading-relaxed">{hypo.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleOpenAddRule(hypo)}
                  className="btn-primary text-xs py-1.5 px-3"
                  title="Tambah indikator observasi ke kategori ini"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah Indikator
                </button>
                <button
                  onClick={() => handleOpenEditHypothesis(hypo)}
                  className="btn-secondary text-xs py-1.5 px-3"
                  title="Edit judul/deskripsi kategori"
                >
                  Edit Kategori
                </button>
                <button
                  onClick={() => handleOpenDelete('hypo', hypo.id, `${hypo.code}: ${hypo.name}`)}
                  className="p-1.5 text-danger hover:bg-red-50 rounded-lg transition-colors"
                  title="Hapus Kategori Hipotesis"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Rules Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted text-left text-xs uppercase tracking-wider">
                    <th className="pb-2 font-medium w-16">Kode</th>
                    <th className="pb-2 font-medium">Indikator Observasi Terukur</th>
                    <th className="pb-2 font-medium text-right w-16">MB</th>
                    <th className="pb-2 font-medium text-right w-16">MD</th>
                    <th className="pb-2 font-medium text-right w-20">CF Pakar</th>
                    <th className="pb-2 font-medium text-center w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {hypo.cf_rules.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-xs text-muted">
                        Belum ada indikator untuk kategori hipotesis ini. Klik tombol "Tambah Indikator" di atas.
                      </td>
                    </tr>
                  ) : (
                    hypo.cf_rules.map((rule) => (
                      <tr key={rule.id} className="hover:bg-page transition-colors">
                        <td className="py-2.5 text-primary font-mono font-bold">{rule.indicator.code}</td>
                        <td className="py-2.5 text-ink">
                          <div className="font-medium text-xs sm:text-sm">{rule.indicator.operational_text}</div>
                          {rule.indicator.observation_guide && (
                            <div className="text-xs text-muted italic mt-0.5">📋 Panduan: {rule.indicator.observation_guide}</div>
                          )}
                        </td>
                        <td className="py-2.5 text-primary font-semibold text-right font-mono">{rule.expert_mb.toFixed(2)}</td>
                        <td className="py-2.5 text-danger font-semibold text-right font-mono">{rule.expert_md.toFixed(2)}</td>
                        <td className="py-2.5 font-bold text-ink text-right font-mono">{rule.expert_cf.toFixed(2)}</td>
                        <td className="py-2.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleOpenEditRule(hypo, rule)}
                              className="p-1 text-primary hover:bg-primary-light rounded transition-colors"
                              title="Edit Indikator & Bobot"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleOpenDelete('rule', rule.id, `${rule.indicator.code}: ${rule.indicator.operational_text}`)}
                              className="p-1 text-danger hover:bg-red-50 rounded transition-colors"
                              title="Hapus Indikator Ini"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Modal 1: Form Hypothesis (Tambah / Edit) */}
      {(modalType === 'add-hypo' || modalType === 'edit-hypo') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface rounded-2xl border border-border p-6 max-w-md w-full shadow-xl animate-in fade-in">
            <h3 className="section-title mb-4">
              {modalType === 'add-hypo' ? 'Tambah Kategori Hipotesis Baru' : `Edit Kategori ${hypoForm.code}`}
            </h3>
            <form onSubmit={handleSaveHypothesis} className="space-y-4">
              <div>
                <label className="form-label">Kode Hipotesis (contoh: H05)</label>
                <input
                  type="text"
                  required
                  value={hypoForm.code}
                  onChange={(e) => setHypoForm({ ...hypoForm, code: e.target.value })}
                  placeholder="H05"
                  className="form-input font-mono"
                />
              </div>
              <div>
                <label className="form-label">Nama Kategori Hambatan</label>
                <input
                  type="text"
                  required
                  value={hypoForm.name}
                  onChange={(e) => setHypoForm({ ...hypoForm, name: e.target.value })}
                  placeholder="contoh: Hambatan Sensori & Motorik"
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Deskripsi / Ruang Lingkup (Opsional)</label>
                <textarea
                  rows={3}
                  value={hypoForm.description}
                  onChange={(e) => setHypoForm({ ...hypoForm, description: e.target.value })}
                  placeholder="Keterangan singkat tentang karakteristik hambatan..."
                  className="form-input"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  disabled={isSubmitting}
                  className="btn-secondary text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary text-xs"
                >
                  {isSubmitting ? 'Menyimpan…' : 'Simpan Kategori'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Form Rule & Indicator (Tambah / Edit) */}
      {(modalType === 'add-rule' || modalType === 'edit-rule') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface rounded-2xl border border-border p-6 max-w-lg w-full shadow-xl animate-in fade-in">
            <h3 className="section-title mb-1">
              {modalType === 'add-rule' ? 'Tambah Indikator Observasi' : `Edit Aturan ${ruleForm.indicatorCode}`}
            </h3>
            <p className="text-xs text-muted mb-4">
              Kategori: <strong className="text-primary">{activeHypothesis?.code} — {activeHypothesis?.name}</strong>
            </p>
            <form onSubmit={handleSaveRule} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="form-label">Kode Indikator</label>
                  <input
                    type="text"
                    required
                    value={ruleForm.indicatorCode}
                    onChange={(e) => setRuleForm({ ...ruleForm, indicatorCode: e.target.value })}
                    placeholder="I16"
                    className="form-input font-mono"
                  />
                </div>
                <div>
                  <label className="form-label">MB (Keyakinan)</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="1"
                    required
                    value={ruleForm.mb}
                    onChange={(e) => setRuleForm({ ...ruleForm, mb: e.target.value })}
                    className="form-input font-mono"
                  />
                </div>
                <div>
                  <label className="form-label">MD (Ketidakyakinan)</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="1"
                    required
                    value={ruleForm.md}
                    onChange={(e) => setRuleForm({ ...ruleForm, md: e.target.value })}
                    className="form-input font-mono"
                  />
                </div>
              </div>

              {/* Preview CF Pakar */}
              <div className="p-2.5 bg-page rounded-xl border border-border flex items-center justify-between text-xs">
                <span className="text-muted">Kalkulasi CF Pakar (MB - MD):</span>
                <span className="font-mono font-bold text-primary text-sm">
                  {(parseFloat(ruleForm.mb || '0') - parseFloat(ruleForm.md || '0')).toFixed(2)}
                </span>
              </div>

              <div>
                <label className="form-label">Pernyataan Observasi Terukur</label>
                <textarea
                  rows={2}
                  required
                  value={ruleForm.indicatorText}
                  onChange={(e) => setRuleForm({ ...ruleForm, indicatorText: e.target.value })}
                  placeholder="Perilaku nyata yang tampak pada siswa saat KBM..."
                  className="form-input text-xs"
                />
              </div>

              <div>
                <label className="form-label">Panduan Pengamatan untuk Guru (Opsional)</label>
                <textarea
                  rows={2}
                  value={ruleForm.observationGuide}
                  onChange={(e) => setRuleForm({ ...ruleForm, observationGuide: e.target.value })}
                  placeholder="Tips pengamatan di kelas, waktu konteks, dll..."
                  className="form-input text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  disabled={isSubmitting}
                  className="btn-secondary text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary text-xs"
                >
                  {isSubmitting ? 'Menyimpan…' : 'Simpan Aturan CF'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Konfirmasi Hapus */}
      {modalType === 'delete-confirm' && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface rounded-2xl border border-border p-6 max-w-sm w-full shadow-xl">
            <div className="w-10 h-10 rounded-full bg-red-100 text-danger flex items-center justify-center mb-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="section-title text-base mb-1">Konfirmasi Penghapusan</h3>
            <p className="text-xs text-muted mb-4">
              Apakah Anda yakin ingin menghapus <strong>{deleteTarget.name}</strong>? Tindakan ini akan dicatat ke dalam log audit sistem.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalType(null)}
                disabled={isSubmitting}
                className="btn-secondary text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isSubmitting}
                className="btn-danger text-xs"
              >
                {isSubmitting ? 'Menghapus…' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
