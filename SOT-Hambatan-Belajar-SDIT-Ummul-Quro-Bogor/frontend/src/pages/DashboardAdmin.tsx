import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

interface DashboardAdminProps {
  onNavigate: (page: string) => void;
}

interface ApiAuditLog {
  id: number;
  action: string;
  entity_name: string;
  entity_id: number | null;
  created_at: string;
  user?: { name: string; email: string; role: string };
}

interface UserItem {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'guru_bk' | 'wali_kelas';
  is_active: boolean;
}

export const DashboardAdmin: React.FC<DashboardAdminProps> = ({ onNavigate }) => {
  const [auditLogs, setAuditLogs] = useState<ApiAuditLog[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil log audit
    api.getAuditLogs()
      .then((res) => {
        const list = Array.isArray(res) ? res : (res.data || []);
        setAuditLogs(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Ambil daftar pengguna untuk ringkasan cepat
    api.getUsers()
      .then((res) => {
        setUsers(res.users || []);
      })
      .catch(() => {});
  }, []);

  const countAdmin = users.filter((u) => u.role === 'admin').length;
  const countBK = users.filter((u) => u.role === 'guru_bk').length;
  const countWali = users.filter((u) => u.role === 'wali_kelas').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Dashboard Administrator</h1>
          <p className="text-sm text-muted mt-0.5">Kelola akun staf, versi basis pengetahuan, dan audit trail sistem.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => onNavigate('kelola-pengguna')} className="btn-secondary shrink-0 text-xs py-2 px-3.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Kelola Pendidik
          </button>
          <button onClick={() => onNavigate('basis-pengetahuan')} className="btn-primary shrink-0 text-xs py-2 px-3.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            Basis Pengetahuan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-xs text-muted font-medium">Pengguna Aktif</p>
          <p className="text-3xl font-extrabold text-ink mt-2">{users.length > 0 ? users.length : 14}</p>
          <span className="badge badge-green mt-2">
            {countAdmin > 0 ? `${countAdmin} Admin · ${countBK} BK · ${countWali} Wali` : '1 Admin · 3 BK · 10 Wali'}
          </span>
        </div>
        <div className="card">
          <p className="text-xs text-muted font-medium">Versi Basis Pengetahuan</p>
          <p className="text-3xl font-extrabold text-ink mt-2">v1.0-RC</p>
          <span className="badge badge-green mt-2">Tervalidasi Phase 2</span>
        </div>
        <div className="card">
          <p className="text-xs text-muted font-medium">Total Indikator Aktif</p>
          <p className="text-3xl font-extrabold text-ink mt-2">15</p>
          <span className="badge badge-blue mt-2">4 Kategori Hipotesis</span>
        </div>
        <div className="card">
          <p className="text-xs text-muted font-medium">Log Aktivitas Tercatat</p>
          <p className="text-3xl font-extrabold text-ink mt-2">{auditLogs.length > 0 ? auditLogs.length : '12+'}</p>
          <span className="badge badge-gray mt-2">Audit trail aktif</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Pengguna Sistem</h2>
            <button onClick={() => onNavigate('kelola-pengguna')} className="text-xs font-semibold text-primary hover:underline">
              Kelola Semua Pendidik →
            </button>
          </div>
          <div className="space-y-3">
            {users.length > 0 ? (
              users.slice(0, 4).map((u) => (
                <div key={u.id} className="flex items-center justify-between p-3 bg-page rounded-xl border border-border">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      u.role === 'admin' ? 'bg-blue-100 text-info' : u.role === 'guru_bk' ? 'bg-primary-light text-primary' : 'bg-accent-light text-accent'
                    }`}>
                      {u.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">{u.name}</p>
                      <p className="text-xs text-muted">
                        {u.role === 'admin' ? 'Administrator' : u.role === 'guru_bk' ? 'Guru BK' : 'Wali Kelas'} · {u.email}
                      </p>
                    </div>
                  </div>
                  <span className={`badge ${u.is_active ? 'badge-green' : 'badge-red'}`}>
                    {u.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
              ))
            ) : (
              <>
                <div className="flex items-center justify-between p-3 bg-page rounded-xl border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-xs">
                      SW
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">Sri Wahyuni, S.Psi [DEMO]</p>
                      <p className="text-xs text-muted">Guru BK · bk@sdit-uq.sch.id</p>
                    </div>
                  </div>
                  <span className="badge badge-green">Aktif</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-page rounded-xl border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent-light flex items-center justify-center text-accent font-bold text-xs">
                      AF
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">Ahmad Fauzi, S.Pd [DEMO]</p>
                      <p className="text-xs text-muted">Wali Kelas 4A · wali4a@sdit-uq.sch.id</p>
                    </div>
                  </div>
                  <span className="badge badge-green">Aktif</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="section-title mb-4">Jejak Audit Aktivitas Terakhir</h2>
          {loading ? (
            <p className="text-xs text-muted py-6 text-center">Memuat riwayat audit…</p>
          ) : auditLogs.length === 0 ? (
            <p className="text-xs text-muted py-6 text-center">Belum ada jejak audit yang dicatat.</p>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {auditLogs.slice(0, 10).map((a) => (
                <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-page transition-colors border border-border/50">
                  <div className="w-2 h-2 mt-1.5 shrink-0 rounded-full bg-primary"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink">{a.action} ({a.entity_name})</p>
                    <p className="text-xs text-muted">
                      {new Date(a.created_at).toLocaleString('id-ID')} · {a.user?.name ?? 'Sistem'}
                    </p>
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
