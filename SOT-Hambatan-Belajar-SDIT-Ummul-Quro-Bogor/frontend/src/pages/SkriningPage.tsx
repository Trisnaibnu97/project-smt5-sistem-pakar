import React, { useState, useEffect } from 'react';
import { ANSWER_SCALE } from '../data/mockData';
import { AnswerScaleValue } from '../types';
import { api, ApiError } from '../services/api';

interface SkriningPageProps {
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

interface ApiClass {
  id: number;
  name: string;
  grade_level: number;
}

interface ApiStudent {
  id: number;
  student_code: string;
  name: string;
}

interface ApiIndicator {
  id: number;
  code: string;
  operational_text: string;
  observation_guide: string;
}

interface ApiHypothesis {
  id: number;
  code: string;
  name: string;
  description: string;
  cf_rules: Array<{
    id: number;
    indicator: ApiIndicator;
    expert_mb: number;
    expert_md: number;
    expert_cf: number;
  }>;
}

interface ApiResult {
  id: number;
  hypothesis: { code: string; name: string };
  final_cf: number | null;
  indication_level: 'belum_cukup_data' | 'rendah' | 'sedang' | 'kuat';
  answered_count: number;
  total_indicators: number;
  traces: Array<{
    cf_user: number;
    cf_expert: number;
    cf_evidence: number;
    step_order: number;
    running_cf: number;
    cf_rule: { indicator: { code: string; operational_text: string } };
  }>;
}

const indicationLabel = (level: string) => {
  switch (level) {
    case 'kuat': return { text: 'Indikasi Kuat', color: 'text-danger', bg: 'bg-red-50', bar: 'bg-danger' };
    case 'sedang': return { text: 'Indikasi Sedang', color: 'text-warning', bg: 'bg-orange-50', bar: 'bg-warning' };
    case 'rendah': return { text: 'Indikasi Rendah', color: 'text-success', bg: 'bg-green-50', bar: 'bg-success' };
    default: return { text: 'Belum Cukup Data', color: 'text-muted', bg: 'bg-gray-50', bar: 'bg-gray-300' };
  }
};

export const SkriningPage: React.FC<SkriningPageProps> = ({ onShowToast }) => {
  const [step, setStep] = useState<number>(1);

  // Step 1
  const [classes, setClasses] = useState<ApiClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [students, setStudents] = useState<ApiStudent[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [observationPeriod, setObservationPeriod] = useState(`${new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' })}`);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [step1Error, setStep1Error] = useState('');

  // Step 2
  const [hypotheses, setHypotheses] = useState<ApiHypothesis[]>([]);
  const [answers, setAnswers] = useState<Record<number, AnswerScaleValue>>({});
  const [screeningId, setScreeningId] = useState<number | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [step2Error, setStep2Error] = useState('');

  // Step 3
  const [results, setResults] = useState<ApiResult[]>([]);
  const [disclaimer, setDisclaimer] = useState('');

  // Load classes on mount
  useEffect(() => {
    api.getMyClasses()
      .then((res) => {
        setClasses(res.classes);
        if (res.classes.length > 0) setSelectedClassId(res.classes[0].id);
      })
      .catch((err) => setStep1Error(err instanceof ApiError ? err.message : 'Gagal memuat kelas.'))
      .finally(() => setLoadingClasses(false));
  }, []);

  // Load students when class changes
  useEffect(() => {
    if (!selectedClassId) return;
    setLoadingStudents(true);
    setStudents([]);
    setSelectedStudentId(null);
    api.getClassStudents(selectedClassId)
      .then((res) => setStudents(res.students))
      .catch((err) => setStep1Error(err instanceof ApiError ? err.message : 'Gagal memuat siswa.'))
      .finally(() => setLoadingStudents(false));
  }, [selectedClassId]);

  // Proceed to Step 2: load KB + create screening session
  const handleProceedToStep2 = async () => {
    if (!selectedStudentId) {
      setStep1Error('Pilih siswa terlebih dahulu.');
      return;
    }
    if (!observationPeriod.trim()) {
      setStep1Error('Masukkan periode observasi.');
      return;
    }
    setStep1Error('');
    setCalculating(true);

    try {
      // 1. Get active KB with hypotheses & indicators
      const kbRes = await api.getActiveKb();
      setHypotheses(kbRes.kb_version.hypotheses);

      // 2. Create screening session
      const sRes = await api.createScreening(selectedStudentId, observationPeriod.trim());
      setScreeningId(sRes.screening.id);

      // Initialize all answers to 'belum'
      const initAnswers: Record<number, AnswerScaleValue> = {};
      kbRes.kb_version.hypotheses.forEach((h) => {
        h.cf_rules.forEach((r) => {
          initAnswers[r.indicator.id] = 'belum';
        });
      });
      setAnswers(initAnswers);

      setStep(2);
      window.scrollTo(0, 0);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Gagal memulai sesi skrining.';
      setStep1Error(msg);
      onShowToast(msg, 'error');
    } finally {
      setCalculating(false);
    }
  };

  const handleAnswerChange = (indicatorId: number, val: AnswerScaleValue) => {
    setAnswers((prev) => ({ ...prev, [indicatorId]: val }));
  };

  // Submit answers + calculate CF
  const handleCalculateCF = async () => {
    if (!screeningId) return;
    setCalculating(true);
    setStep2Error('');

    try {
      // Gather all indicators with their answers
      const answersPayload: Array<{ indicator_id: number; answer_value: string }> = [];
      hypotheses.forEach((h) => {
        h.cf_rules.forEach((r) => {
          answersPayload.push({
            indicator_id: r.indicator.id,
            answer_value: answers[r.indicator.id] ?? 'belum',
          });
        });
      });

      // Save answers
      await api.saveScreeningAnswers(screeningId, answersPayload);

      // Calculate CF
      const calcRes = await api.calculateScreening(screeningId);
      setResults(calcRes.results as ApiResult[]);
      setDisclaimer(calcRes.disclaimer);

      setStep(3);
      window.scrollTo(0, 0);
      onShowToast('Kalkulasi Certainty Factor berhasil dihitung!', 'success');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Gagal menghitung CF. Coba lagi.';
      setStep2Error(msg);
      onShowToast(msg, 'error');
    } finally {
      setCalculating(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedStudentId(null);
    setAnswers({});
    setResults([]);
    setScreeningId(null);
    setStep1Error('');
    setStep2Error('');
    window.scrollTo(0, 0);
  };

  const todayFormatted = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <div className="card">
        <div className="flex items-center justify-between max-w-xl mx-auto">
          {[1, 2, 3].map((s, idx) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center ${
                  step === s ? 'bg-primary text-white' : step > s ? 'bg-primary-light text-primary-dark' : 'bg-border text-muted'
                }`}>
                  {step > s ? '✓' : s}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${step === s ? 'text-primary' : step > s ? 'text-ink' : 'text-muted'}`}>
                  {s === 1 ? 'Pilih Siswa' : s === 2 ? 'Observasi 15 Indikator' : 'Hasil CF & Rekomendasi'}
                </span>
              </div>
              {idx < 2 && <div className="flex-1 h-0.5 bg-border mx-2" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="card max-w-2xl mx-auto space-y-6">
          <div>
            <h2 className="section-title">Langkah 1: Informasi Skrining & Identitas Siswa</h2>
            <p className="text-sm text-muted mt-1">Pilih kelas, siswa, dan periode pengamatan.</p>
          </div>

          {step1Error && (
            <div className="p-3 bg-red-50 text-danger text-xs rounded-lg border border-red-200">{step1Error}</div>
          )}

          {/* Class selector */}
          <div>
            <label className="form-label">Pilih Kelas <span className="text-danger">*</span></label>
            {loadingClasses ? (
              <p className="text-sm text-muted">Memuat kelas…</p>
            ) : (
              <select className="form-select" value={selectedClassId ?? ''} onChange={(e) => setSelectedClassId(Number(e.target.value))}>
                {[1, 2, 3, 4, 5, 6].map((grade) => {
                  const gradeClasses = classes.filter((c) => c.grade_level === grade);
                  if (gradeClasses.length === 0) return null;
                  return (
                    <optgroup key={grade} label={`Jenjang Kelas ${grade}`}>
                      {gradeClasses.map((c) => (
                        <option key={c.id} value={c.id}>Kelas {c.name}</option>
                      ))}
                    </optgroup>
                  );
                })}
              </select>
            )}
          </div>

          {/* Student selector */}
          <div>
            <label className="form-label" htmlFor="sk-siswa">
              Pilih Siswa <span className="text-danger">*</span>
            </label>
            {loadingStudents ? (
              <p className="text-sm text-muted">Memuat siswa…</p>
            ) : (
              <select
                id="sk-siswa"
                className="form-select"
                value={selectedStudentId ?? ''}
                onChange={(e) => setSelectedStudentId(Number(e.target.value))}
              >
                <option value="">-- Pilih Siswa --</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="form-label" htmlFor="sk-period">Periode Observasi</label>
            <input
              id="sk-period"
              type="text"
              className="form-input"
              value={observationPeriod}
              onChange={(e) => setObservationPeriod(e.target.value)}
              placeholder="Contoh: Oktober 2026"
            />
          </div>

          <div className="p-4 bg-primary-light/40 border border-primary/20 rounded-xl text-xs text-primary-dark">
            <p className="font-semibold mb-1">ℹ Panduan Observasi</p>
            <p>Pengamatan sebaiknya dilakukan dalam rentang minimal 2–4 minggu KBM reguler agar data perilaku belajar siswa bersifat konsisten dan objektif.</p>
          </div>

          <div className="flex justify-end pt-2">
            <button onClick={handleProceedToStep2} className="btn-primary" disabled={calculating || loadingClasses || loadingStudents}>
              {calculating ? 'Memulai Sesi…' : 'Lanjut ke Form Observasi →'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs text-muted">Siswa Sedang Diskrining:</p>
              <h2 className="section-title text-primary">{selectedStudent?.name ?? '—'}</h2>
              <p className="text-xs text-muted mt-0.5">Sesi #{screeningId} · KB v1.0-RC · {observationPeriod}</p>
            </div>
            <span className="badge badge-orange self-start sm:self-auto">DATA DEMO</span>
          </div>

          {step2Error && (
            <div className="p-3 bg-red-50 text-danger text-xs rounded-lg border border-red-200">{step2Error}</div>
          )}

          {hypotheses.map((hypo) => (
            <div key={hypo.id} className="card">
              <h3 className="section-title mb-1 text-primary">{hypo.code}: {hypo.name}</h3>
              <p className="text-xs text-muted mb-4">{hypo.description}</p>
              <div className="space-y-5">
                {hypo.cf_rules.map((rule) => {
                  const ind = rule.indicator;
                  const currentAnswer = answers[ind.id] ?? 'belum';
                  return (
                    <fieldset key={ind.id} className="border border-border rounded-xl p-4 bg-surface">
                      <legend className="text-sm font-medium text-ink px-2">
                        <span className="font-mono text-primary font-bold mr-1">{ind.code}</span> — {ind.operational_text}
                      </legend>
                      {ind.observation_guide && (
                        <p className="text-xs text-muted italic mt-1 px-1">📋 {ind.observation_guide}</p>
                      )}
                      <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                        {ANSWER_SCALE.map((s) => (
                          <label
                            key={s.value}
                            className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg border transition-colors ${
                              currentAnswer === s.value
                                ? 'bg-primary-light/50 border-primary/40 font-medium'
                                : 'hover:bg-page border-transparent'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`ind-${ind.id}`}
                              value={s.value}
                              checked={currentAnswer === s.value}
                              onChange={() => handleAnswerChange(ind.id, s.value)}
                              className="accent-primary w-4 h-4 shrink-0"
                            />
                            <span className="text-xs text-ink">{s.label}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-2">
            <button onClick={() => setStep(1)} className="btn-secondary">← Kembali</button>
            <button onClick={handleCalculateCF} className="btn-primary" disabled={calculating}>
              {calculating ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Menghitung…
                </span>
              ) : 'Hitung Indikasi CF →'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="card border-l-4 border-primary bg-primary-light/30">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-muted">Hasil Skrining Indikatif</p>
                <h2 className="section-title mt-0.5">{selectedStudent?.name ?? '—'}</h2>
                <p className="text-xs text-muted mt-1">
                  Diperiksa: {todayFormatted} · Sesi #{screeningId} · KB v1.0-RC [DEMO]
                </p>
              </div>
              <span className="badge badge-orange shrink-0">DEMO</span>
            </div>
            {disclaimer && (
              <div className="mt-4 p-4 bg-accent-light rounded-xl text-sm text-ink border border-accent/20">
                <p className="font-semibold mb-1">⚠ Disclaimer Penting</p>
                <p>{disclaimer}</p>
              </div>
            )}
          </div>

          {results.map((r) => {
            const lbl = indicationLabel(r.indication_level);
            const pct = r.final_cf !== null ? Math.round(r.final_cf * 100) : 0;
            return (
              <div key={r.id} className="card">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-semibold text-ink">{r.hypothesis.name}</h3>
                    <p className="text-xs text-muted">
                      {r.answered_count}/{r.total_indicators} indikator terjawab
                      {r.answered_count < r.total_indicators * 0.5 && (
                        <span className="ml-2 text-warning">⚠ Data kurang dari 50%</span>
                      )}
                    </p>
                  </div>
                  <span className={`text-sm font-bold ${lbl.color}`}>
                    {r.final_cf !== null ? `CF = ${r.final_cf.toFixed(3)}` : '—'}
                  </span>
                </div>

                {r.final_cf !== null && (
                  <div className="w-full bg-gray-100 rounded-full h-2.5 mb-3 overflow-hidden">
                    <div className={`h-2.5 rounded-full transition-all ${lbl.bar}`} style={{ width: `${pct}%` }} />
                  </div>
                )}

                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${lbl.bg} mb-4`}>
                  <span className={`text-sm font-medium ${lbl.color}`}>{lbl.text}</span>
                </div>

                {/* Traces (Explainability) */}
                {r.traces.length > 0 && (
                  <details className="mt-2">
                    <summary className="text-xs font-semibold text-muted cursor-pointer hover:text-ink">
                      🔍 Lihat jejak kalkulasi inferensi ({r.traces.length} langkah)
                    </summary>
                    <div className="mt-3 overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-border text-muted">
                            <th className="text-left pb-2 font-medium">Langkah</th>
                            <th className="text-left pb-2 font-medium">Indikator</th>
                            <th className="text-right pb-2 font-medium">CF User</th>
                            <th className="text-right pb-2 font-medium">CF Pakar</th>
                            <th className="text-right pb-2 font-medium">CF Evidence</th>
                            <th className="text-right pb-2 font-medium">CF Kumulatif</th>
                          </tr>
                        </thead>
                        <tbody>
                          {r.traces.map((t) => (
                            <tr key={t.step_order} className="border-b border-border/50 last:border-0">
                              <td className="py-2 font-mono text-muted">#{t.step_order}</td>
                              <td className="py-2 font-mono text-primary">{t.cf_rule?.indicator?.code ?? '—'}</td>
                              <td className="py-2 text-right">{t.cf_user.toFixed(3)}</td>
                              <td className="py-2 text-right">{t.cf_expert.toFixed(3)}</td>
                              <td className="py-2 text-right">{t.cf_evidence.toFixed(3)}</td>
                              <td className="py-2 text-right font-semibold text-primary">{t.running_cf.toFixed(3)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </details>
                )}
              </div>
            );
          })}

          <div className="card border border-info/30 bg-blue-50/50">
            <p className="text-sm font-semibold text-info mb-2">Rekomendasi Tindak Lanjut Edukatif</p>
            <ul className="text-sm text-ink space-y-1.5">
              <li className="flex gap-2"><span className="shrink-0 text-info">→</span> Tinjau hasil bersama Guru BK sebelum mengambil keputusan tindakan apapun.</li>
              <li className="flex gap-2"><span className="shrink-0 text-info">→</span> Lakukan pengamatan lanjutan untuk indikator yang belum cukup data.</li>
              <li className="flex gap-2"><span className="shrink-0 text-info">→</span> Terapkan strategi diferensiasi instruksi belajar ramah anak di kelas.</li>
            </ul>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button onClick={() => setStep(2)} className="btn-secondary">← Edit Jawaban</button>
            <button onClick={handleReset} className="btn-primary">Mulai Skrining Lain</button>
          </div>
        </div>
      )}
    </div>
  );
};
