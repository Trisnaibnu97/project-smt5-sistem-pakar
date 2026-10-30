import React, { useState, useEffect } from 'react';
import { api, ApiError } from '../services/api';

interface DaftarSiswaPageProps {
  onNavigate: (page: string) => void;
}

interface ApiClass {
  id: number;
  grade_level: number;
  name: string;
  academic_year: string;
  students_count: number;
}

interface ApiStudent {
  id: number;
  student_code: string;
  name: string;
  is_active: boolean;
}

export const DaftarSiswaPage: React.FC<DaftarSiswaPageProps> = ({ onNavigate }) => {
  const [classes, setClasses] = useState<ApiClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [students, setStudents] = useState<ApiStudent[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getMyClasses()
      .then((res) => {
        setClasses(res.classes);
        if (res.classes.length > 0) {
          setSelectedClassId(res.classes[0].id);
        }
      })
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : 'Gagal memuat daftar kelas.');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedClassId) return;
    setStudentsLoading(true);
    setStudents([]);
    api.getClassStudents(selectedClassId)
      .then((res) => setStudents(res.students))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Gagal memuat daftar siswa.'))
      .finally(() => setStudentsLoading(false));
  }, [selectedClassId]);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted">
        <svg className="animate-spin w-6 h-6 mr-2 text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        Memuat daftar kelas…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Daftar Siswa</h1>
          <p className="text-sm text-muted mt-0.5">Data sintetis fiktif berlabel [DEMO]. Prinsip minimisasi data anak diterapkan.</p>
        </div>
        <button onClick={() => onNavigate('skrining')} className="btn-primary shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Skrining Siswa
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-danger text-sm rounded-lg">{error}</div>
      )}

      {/* Class selector: Jenjang 1 - 6 & Rombel A - F */}
      {classes.length > 0 && (
        <div className="card space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-border">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">
              Pilih Jenjang Kelas
            </span>
            <span className="text-xs text-muted">
              Total {classes.length} Rombel Tersedia (Jenjang 1–6, Rombel A–F)
            </span>
          </div>

          {/* Grouping by grade level 1 to 6 */}
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((grade) => {
              const gradeClasses = classes.filter((c) => c.grade_level === grade);
              if (gradeClasses.length === 0) return null;

              return (
                <div key={grade} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-2.5 rounded-xl bg-page/60 border border-border/50">
                  <div className="w-20 shrink-0 font-semibold text-sm text-ink flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary/70"></span>
                    Kelas {grade}
                  </div>
                  <div className="flex flex-wrap gap-2 flex-1">
                    {gradeClasses.map((cls) => {
                      const isSelected = selectedClassId === cls.id;
                      return (
                        <button
                          key={cls.id}
                          onClick={() => setSelectedClassId(cls.id)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                            isSelected
                              ? 'bg-primary text-white border-primary shadow-sm font-semibold'
                              : 'bg-white text-ink border-border hover:border-primary hover:text-primary'
                          }`}
                        >
                          {cls.name}
                          <span className={`ml-1 text-[11px] ${isSelected ? 'text-white/80' : 'text-muted'}`}>
                            ({cls.students_count})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="relative max-w-sm w-full">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              placeholder="Cari nama siswa…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-page focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <p className="text-xs text-muted">Menampilkan {filtered.length} siswa [DEMO]</p>
        </div>

        {studentsLoading ? (
          <div className="py-10 text-center text-muted text-sm">Memuat siswa…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted text-left">
                  <th className="pb-3 font-medium">Nama Siswa</th>
                  <th className="pb-3 font-medium">Kode ID</th>
                  <th className="pb-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-b border-border last:border-0 hover:bg-page transition-colors">
                    <td className="py-3 font-medium text-ink">{s.name}</td>
                    <td className="py-3 text-muted font-mono text-xs">{s.student_code}</td>
                    <td className="py-3">
                      <button
                        onClick={() => onNavigate('skrining')}
                        className="text-primary text-xs font-semibold hover:underline mr-3"
                      >
                        Skrining
                      </button>
                      <button
                        onClick={() => onNavigate('tindak-lanjut')}
                        className="text-muted text-xs hover:underline"
                      >
                        Tindak Lanjut
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!studentsLoading && filtered.length === 0 && students.length > 0 && (
          <div className="py-12 text-center text-muted">
            <p className="text-base font-semibold">Siswa tidak ditemukan</p>
            <p className="text-xs mt-1">Coba kata kunci pencarian nama yang lain.</p>
          </div>
        )}

        {!studentsLoading && students.length === 0 && !error && (
          <div className="py-12 text-center text-muted">
            <p className="text-base font-semibold">Belum ada siswa di kelas ini</p>
          </div>
        )}
      </div>
    </div>
  );
};
