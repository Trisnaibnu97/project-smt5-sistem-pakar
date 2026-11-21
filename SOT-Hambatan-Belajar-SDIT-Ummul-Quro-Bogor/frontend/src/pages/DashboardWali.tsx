import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { api } from '../services/api';

interface DashboardWaliProps {
  onNavigate: (page: string) => void;
  currentUser?: UserProfile | null;
}

interface AssignedClass {
  id: number;
  grade_level: number;
  name: string;
  students_count?: number;
}

interface StudentItem {
  id: number;
  student_code: string;
  name: string;
  is_active: boolean;
}

export const DashboardWali: React.FC<DashboardWaliProps> = ({ onNavigate, currentUser }) => {
  const [classes, setClasses] = useState<AssignedClass[]>([]);
  const [activeClass, setActiveClass] = useState<AssignedClass | null>(null);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [screeningsCount, setScreeningsCount] = useState<number>(0);

  // Ambil kelas yang diampu oleh user yang login
  useEffect(() => {
    setLoading(true);
    api.getMyClasses()
      .then((res) => {
        const clsList = res.classes || [];
        setClasses(clsList);
        if (clsList.length > 0) {
          setActiveClass(clsList[0]);
        }
      })
      .catch((err) => {
        console.error('Gagal mengambil kelas:', err);
        // Fallback dari currentUser.classes jika ada
        if (currentUser?.classes && currentUser.classes.length > 0) {
          setClasses(currentUser.classes);
          setActiveClass(currentUser.classes[0]);
        }
      })
      .finally(() => setLoading(false));

    // Ambil rekap skrining
    api.getScreenings()
      .then((res: any) => {
        const list = Array.isArray(res) ? res : (res.data || []);
        setScreeningsCount(list.length);
      })
      .catch(() => {});
  }, [currentUser]);

  // Ambil daftar siswa ketika activeClass berganti
  useEffect(() => {
    if (!activeClass) return;
    api.getClassStudents(activeClass.id)
      .then((res) => {
        setStudents(res.students || []);
      })
      .catch((err) => {
        console.error('Gagal mengambil siswa:', err);
      });
  }, [activeClass]);

  const classNameDisplay = activeClass ? `Kelas ${activeClass.name}` : (currentUser?.classes?.[0]?.name ? `Kelas ${currentUser.classes[0].name}` : 'Wali Kelas');

  return (
    <div className="space-y-6">
      {/* Header section dengan nama kelas dinamis */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="page-title">Dashboard {classNameDisplay}</h1>
            {classes.length > 1 && (
              <span className="badge badge-blue">Multi-Kelas</span>
            )}
          </div>
          <p className="text-sm text-muted mt-0.5">
            Selamat datang, <span className="font-semibold text-ink">{currentUser?.name || 'Wali Kelas'}</span>. Catat observasi KBM siswa dan pantau tindak lanjut edukatif.
          </p>
        </div>
        <button onClick={() => onNavigate('skrining')} className="btn-primary shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Mulai Observasi Siswa
        </button>
      </div>

      {/* Selector jika wali kelas mengampu lebih dari 1 kelas */}
      {classes.length > 1 && (
        <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-border">
          <span className="text-xs font-semibold text-muted uppercase tracking-wider">Pilih Rombel Aktif:</span>
          <div className="flex gap-2">
            {classes.map((cls) => (
              <button
                key={cls.id}
                onClick={() => setActiveClass(cls)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeClass?.id === cls.id
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-page text-ink border border-border hover:border-primary'
                }`}
              >
                Kelas {cls.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Metric Cards Dinamis Sesuai Kelas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-xs text-muted font-medium">Siswa {classNameDisplay}</p>
          <p className="text-3xl font-extrabold text-ink mt-2">
            {loading ? '…' : (students.length > 0 ? students.length : (activeClass?.students_count || 0))}
          </p>
          <span className="badge badge-gray mt-2">Aktif KBM</span>
        </div>
        <div className="card">
          <p className="text-xs text-muted font-medium">Total Skrining Kelas</p>
          <p className="text-3xl font-extrabold text-ink mt-2">{screeningsCount}</p>
          <span className="badge badge-orange mt-2">Tercatat di sistem</span>
        </div>
        <div className="card">
          <p className="text-xs text-muted font-medium">Jenjang Tingkat</p>
          <p className="text-3xl font-extrabold text-ink mt-2">
            {activeClass?.grade_level ? `Tingkat ${activeClass.grade_level}` : '—'}
          </p>
          <span className="badge badge-green mt-2">{classNameDisplay}</span>
        </div>
        <div className="card">
          <p className="text-xs text-muted font-medium">Status Penugasan</p>
          <p className="text-3xl font-extrabold text-ink mt-2">Aktif</p>
          <span className="badge badge-blue mt-2">Tahun Ajaran 2026/2027</span>
        </div>
      </div>

      {/* Daftar Siswa yang Berada di Kelas ini */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Daftar Siswa {classNameDisplay}</h2>
          <button onClick={() => onNavigate('daftar-siswa')} className="text-primary text-xs font-semibold hover:underline">
            Buka Daftar Lengkap Siswa →
          </button>
        </div>

        {students.length === 0 ? (
          <div className="py-8 text-center text-muted text-sm">
            {loading ? 'Memuat data siswa kelas…' : `Belum ada siswa terdaftar di ${classNameDisplay}.`}
          </div>
        ) : (
          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {students.slice(0, 6).map((s) => (
              <div key={s.id} className="flex items-center justify-between p-3.5 bg-page rounded-xl border border-border hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-light text-primary font-bold text-xs flex items-center justify-center">
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{s.name}</p>
                    <p className="text-xs text-muted font-mono">{s.student_code} · {classNameDisplay}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('skrining')}
                    className="btn-primary text-xs py-1.5 px-3"
                  >
                    Observasi
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
