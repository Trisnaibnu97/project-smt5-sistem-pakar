import React, { useState, useEffect } from 'react';
import { api, ApiError } from '../services/api';

interface TindakLanjutPageProps {
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

interface ApiScreeningItem {
  id: number;
  student: {
    id: number;
    name: string;
    student_code: string;
    school_class?: { name: string };
  };
  observation_period: string;
  status: string;
  follow_ups?: Array<{
    id: number;
    action_type: string;
    status: string;
    notes: string;
    created_at: string;
    created_by_user?: { name: string; role: string };
  }>;
}

const ACTION_LABELS: Record<string, string> = {
  observasi_lanjutan: 'Observasi lanjutan di kelas',
  diferensiasi_pembelajaran: 'Diferensiasi pembelajaran (instruksi khusus)',
  diskusi_internal: 'Diskusi internal Wali Kelas & Guru BK',
  rujukan_ahli: 'Rujukan pemeriksaan psikolog / profesional',
};

export const TindakLanjutPage: React.FC<TindakLanjutPageProps> = ({ onShowToast }) => {
  const [screenings, setScreenings] = useState<ApiScreeningItem[]>([]);
  const [selectedScreeningId, setSelectedScreeningId] = useState<number | null>(null);
  const [actionType, setActionType] = useState('observasi_lanjutan');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchScreenings = async () => {
    try {
      setLoading(true);
      const res = await api.getScreenings();
      // Handle Laravel paginator response (res.data) or simple array
      const list = Array.isArray(res) ? res : (res.data || []);
      setScreenings(list);
      if (list.length > 0 && !selectedScreeningId) {
        setSelectedScreeningId(list[0].id);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal memuat data skrining & tindak lanjut.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScreenings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScreeningId) {
      onShowToast('Pilih sesi skrining siswa terlebih dahulu.', 'error');
      return;
    }
    if (!notes.trim()) {
      onShowToast('Mohon isi catatan dan rencana evaluasi tindak lanjut.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      await api.addFollowUp(selectedScreeningId, {
        action_type: actionType,
        notes: notes.trim(),
        status: 'berjalan',
      });
      onShowToast('Tindak lanjut berhasil dicatat ke sistem!', 'success');
      setNotes('');
      await fetchScreenings();
    } catch (err) {
      onShowToast(err instanceof ApiError ? err.message : 'Gagal menyimpan tindak lanjut.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Kumpulkan seluruh follow-ups dari seluruh sesi skrining yang dapat diakses pengguna
  const allFollowUps = screenings.flatMap((s) =>
    (s.follow_ups || []).map((f) => ({
      ...f,
      studentName: s.student?.name ?? 'Siswa',
      studentCode: s.student?.student_code ?? '',
      className: s.student?.school_class?.name ?? '',
    }))
  );

  const statusBadge = (status: string) => {
    switch (status) {
      case 'berjalan':
        return <span className="badge badge-blue">Berjalan</span>;
      case 'selesai':
        return <span className="badge badge-green">Selesai</span>;
      default:
        return <span className="badge badge-gray">Menunggu</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Tindak Lanjut & Intervensi Edukatif</h1>
        <p className="text-sm text-muted mt-0.5">
          Pencatatan strategi pendampingan dan pemantauan perkembangan hasil skrining siswa.
        </p>
      </div>

      {error && <div className="card bg-red-50 border-red-200 text-danger text-sm">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Tambah */}
        <div className="card h-fit">
          <h2 className="section-title mb-4">Tambah Rekomendasi</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label" htmlFor="tl-skrining">
                Pilih Sesi Skrining Siswa <span className="text-danger">*</span>
              </label>
              <select
                id="tl-skrining"
                className="form-select"
                value={selectedScreeningId ?? ''}
                onChange={(e) => setSelectedScreeningId(Number(e.target.value))}
                disabled={loading || screenings.length === 0}
              >
                {screenings.length === 0 ? (
                  <option value="">(Belum ada sesi skrining tersedia)</option>
                ) : (
                  screenings.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.student.name} ({s.student.school_class?.name ?? s.student.student_code}) — {s.observation_period}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="form-label" htmlFor="tl-jenis">
                Jenis Tindakan
              </label>
              <select
                id="tl-jenis"
                className="form-select"
                value={actionType}
                onChange={(e) => setActionType(e.target.value)}
              >
                <option value="observasi_lanjutan">Observasi lanjutan di kelas</option>
                <option value="diferensiasi_pembelajaran">Diferensiasi pembelajaran (instruksi khusus)</option>
                <option value="diskusi_internal">Diskusi internal Wali Kelas & Guru BK</option>
                <option value="rujukan_ahli">Rujukan pemeriksaan psikolog / profesional</option>
              </select>
            </div>

            <div>
              <label className="form-label" htmlFor="tl-catatan">
                Catatan & Rencana Evaluasi <span className="text-danger">*</span>
              </label>
              <textarea
                id="tl-catatan"
                rows={3}
                placeholder="Contoh: Berikan lembar latihan kartu visual suku kata di jam pendampingan selama 2 minggu..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="form-input"
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full justify-center"
              disabled={submitting || loading || screenings.length === 0}
            >
              {submitting ? 'Menyimpan…' : 'Simpan Tindak Lanjut'}
            </button>
          </form>
        </div>

        {/* Riwayat List */}
        <div className="lg:col-span-2 card">
          <h2 className="section-title mb-4">Riwayat Tindak Lanjut Terdaftar ({allFollowUps.length})</h2>
          {loading ? (
            <div className="py-12 text-center text-muted text-sm">Memuat riwayat tindak lanjut…</div>
          ) : allFollowUps.length === 0 ? (
            <div className="py-12 text-center text-muted text-sm bg-page rounded-xl border border-dashed border-border">
              Belum ada tindak lanjut yang dicatat. Lakukan skrining observasi terlebih dahulu lalu tambahkan rekomendasi pendampingan.
            </div>
          ) : (
            <div className="space-y-3">
              {allFollowUps.map((t) => (
                <div key={t.id} className="flex flex-col sm:flex-row sm:items-start gap-3 p-4 bg-page rounded-xl border border-border">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-ink">{t.studentName}</p>
                      {t.className && <span className="text-xs text-muted">({t.className})</span>}
                      {statusBadge(t.status)}
                    </div>
                    <p className="text-xs text-muted mt-0.5">
                      {ACTION_LABELS[t.action_type] ?? t.action_type} · Ditambahkan oleh: {t.created_by_user?.name ?? 'Staf'}
                    </p>
                    <p className="text-sm text-ink mt-1.5">{t.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

