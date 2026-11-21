import React, { useState, useEffect } from 'react';
import { api, ApiError } from '../services/api';

interface KelolaPenggunaPageProps {
  onShowToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

interface UserItem {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'guru_bk' | 'wali_kelas';
  is_active: boolean;
  created_at: string;
  classes?: Array<{ id: number; name: string; grade_level: number }>;
}

interface ClassOption {
  id: number;
  grade_level: number;
  name: string;
}

export const KelolaPenggunaPage: React.FC<KelolaPenggunaPageProps> = ({ onShowToast }) => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'guru_bk' | 'wali_kelas'>('all');

  // Modal State for CRUD
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'wali_kelas' as 'admin' | 'guru_bk' | 'wali_kelas',
    class_id: '' as string,
    is_active: true,
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete confirmation modal state
  const [deleteTarget, setDeleteTarget] = useState<UserItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Load users & public classes list
  const loadUsers = () => {
    setLoading(true);
    api.getUsers()
      .then((res) => {
        setUsers(res.users || []);
      })
      .catch((err) => {
        console.error('Gagal mengambil daftar pengguna:', err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
    api.getPublicClasses()
      .then((res) => {
        setClasses(res.classes || []);
      })
      .catch(() => {});
  }, []);

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'wali_kelas',
      class_id: classes.length > 0 ? String(classes[0].id) : '',
      is_active: true,
    });
    setFormError('');
    setShowModal(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (user: UserItem) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      class_id: user.classes && user.classes.length > 0 ? String(user.classes[0].id) : (classes.length > 0 ? String(classes[0].id) : ''),
      is_active: user.is_active,
    });
    setFormError('');
    setShowModal(true);
  };

  // Handle Form Submit (Create / Update)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError('');

    try {
      const payload: any = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        is_active: formData.is_active,
        class_id: formData.role === 'wali_kelas' && formData.class_id ? Number(formData.class_id) : null,
      };

      if (!editingUser) {
        if (!formData.password) {
          setFormError('Kata sandi wajib diisi untuk pengguna baru.');
          setFormSubmitting(false);
          return;
        }
        payload.password = formData.password;
        await api.createUser(payload);
        if (onShowToast) onShowToast('Akun pendidik berhasil ditambahkan!', 'success');
      } else {
        if (formData.password) {
          payload.password = formData.password;
        }
        await api.updateUser(editingUser.id, payload);
        if (onShowToast) onShowToast('Data akun pendidik berhasil diperbarui!', 'success');
      }

      setShowModal(false);
      loadUsers();
    } catch (err: any) {
      if (err instanceof ApiError) {
        setFormError(err.message || 'Gagal menyimpan data pengguna.');
      } else {
        setFormError('Terjadi kesalahan saat memproses permintaan.');
      }
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handle Delete User
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await api.deleteUser(deleteTarget.id);
      if (onShowToast) onShowToast(res.message || 'Pengguna berhasil dihapus.', 'info');
      setDeleteTarget(null);
      loadUsers();
    } catch (err: any) {
      if (onShowToast) {
        onShowToast(err.message || 'Gagal menghapus pengguna.', 'error');
      }
    } finally {
      setDeleting(false);
    }
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const countAdmin = users.filter((u) => u.role === 'admin').length;
  const countBK = users.filter((u) => u.role === 'guru_bk').length;
  const countWali = users.filter((u) => u.role === 'wali_kelas').length;

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Manajemen Akun Pendidik</h1>
          <p className="text-sm text-muted mt-0.5">
            Kelola data staf sekolah, akun akses login, otoritas peran, dan penugasan rombongan belajar.
          </p>
        </div>
        <button onClick={handleOpenCreate} className="btn-primary shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Tambah Pendidik Baru
        </button>
      </div>

      {/* Metric Cards Ringkas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-xs text-muted font-medium">Total Akun Terdaftar</p>
          <p className="text-3xl font-extrabold text-ink mt-2">{loading ? '…' : users.length}</p>
          <span className="badge badge-gray mt-2">Semua Akun</span>
        </div>
        <div className="card">
          <p className="text-xs text-muted font-medium">Wali Kelas</p>
          <p className="text-3xl font-extrabold text-ink mt-2">{countWali}</p>
          <span className="badge badge-orange mt-2">Rombel 1A–6F</span>
        </div>
        <div className="card">
          <p className="text-xs text-muted font-medium">Guru BK / Konselor</p>
          <p className="text-3xl font-extrabold text-ink mt-2">{countBK}</p>
          <span className="badge badge-green mt-2">Pakar Skrining</span>
        </div>
        <div className="card">
          <p className="text-xs text-muted font-medium">Administrator</p>
          <p className="text-3xl font-extrabold text-ink mt-2">{countAdmin}</p>
          <span className="badge badge-blue mt-2">Hak Akses Penuh</span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card space-y-4">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-border">
          <div className="relative flex-1 max-w-sm">
            <svg className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cari nama atau email pendidik…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input text-xs pl-9 py-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted font-medium">Filter Peran:</span>
            <select
              value={roleFilter}
              onChange={(e: any) => setRoleFilter(e.target.value)}
              className="form-select text-xs py-1.5 px-3 rounded-lg border-border"
            >
              <option value="all">Semua Peran ({users.length})</option>
              <option value="admin">Administrator ({countAdmin})</option>
              <option value="guru_bk">Guru BK ({countBK})</option>
              <option value="wali_kelas">Wali Kelas ({countWali})</option>
            </select>
          </div>
        </div>

        {/* Table of Users */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-12 text-center text-xs text-muted">Memuat data pengguna…</div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted">
              Tidak ada pengguna yang sesuai dengan pencarian atau filter.
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="py-2.5 px-3 font-semibold">Nama Pendidik</th>
                  <th className="py-2.5 px-3 font-semibold">Alamat Surel (Email)</th>
                  <th className="py-2.5 px-3 font-semibold">Peran & Akses</th>
                  <th className="py-2.5 px-3 font-semibold">Penugasan Rombel</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((u) => {
                  const roleBadge =
                    u.role === 'admin'
                      ? 'badge-blue'
                      : u.role === 'guru_bk'
                      ? 'badge-green'
                      : 'badge-orange';
                  const roleLabel =
                    u.role === 'admin'
                      ? 'Administrator'
                      : u.role === 'guru_bk'
                      ? 'Guru BK'
                      : 'Wali Kelas';

                  return (
                    <tr key={u.id} className="hover:bg-page/70 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                            u.role === 'admin' ? 'bg-blue-100 text-info' : u.role === 'guru_bk' ? 'bg-primary-light text-primary' : 'bg-accent-light text-accent'
                          }`}>
                            {u.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-ink text-xs">{u.name}</p>
                            <p className="text-[11px] text-muted">Terdaftar: {new Date(u.created_at).toLocaleDateString('id-ID')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-muted font-mono">{u.email}</td>
                      <td className="py-3 px-3">
                        <span className={`badge ${roleBadge}`}>{roleLabel}</span>
                      </td>
                      <td className="py-3 px-3">
                        {u.role === 'wali_kelas' ? (
                          u.classes && u.classes.length > 0 ? (
                            <span className="font-semibold text-ink bg-page px-2 py-0.5 rounded border border-border">
                              Kelas {u.classes.map((c) => c.name).join(', ')}
                            </span>
                          ) : (
                            <span className="text-muted italic">Belum ditentukan</span>
                          )
                        ) : (
                          <span className="text-muted text-[11px]">Akses Semua Kelas</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {u.is_active ? (
                          <span className="badge badge-green text-[10px]">Aktif</span>
                        ) : (
                          <span className="badge badge-red text-[10px]">Nonaktif</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="p-1.5 rounded-lg text-primary hover:bg-primary-light transition-colors"
                            title="Edit Pengguna"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteTarget(u)}
                            className="p-1.5 rounded-lg text-danger hover:bg-red-50 transition-colors"
                            title="Hapus Pengguna"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL TAMBAH / EDIT PENGGUNA */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface w-full max-w-lg rounded-2xl border border-border shadow-2xl p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-muted hover:bg-page hover:text-ink transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-lg font-bold text-ink mb-1">
              {editingUser ? 'Edit Data Pendidik' : 'Tambah Pendidik Baru'}
            </h3>
            <p className="text-xs text-muted mb-4">
              {editingUser ? 'Perbarui informasi profil dan hak akses pengguna sistem.' : 'Daftarkan akun staf pengajar atau konselor sekolah baru.'}
            </p>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 text-danger text-xs rounded-xl border border-red-200">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              <div>
                <label className="form-label text-xs">
                  Nama Lengkap & Gelar <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  placeholder="misal: Ustadzah Rahmawati, S.Pd"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input text-xs"
                  required
                />
              </div>

              <div>
                <label className="form-label text-xs">
                  Alamat Surel (Email) <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  placeholder="nama@sdit-uq.sch.id"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input text-xs"
                  required
                />
              </div>

              <div>
                <label className="form-label text-xs">
                  {editingUser ? 'Kata Sandi Baru (Kosongkan jika tidak diubah)' : 'Kata Sandi Akun'} {!editingUser && <span className="text-danger">*</span>}
                </label>
                <input
                  type="password"
                  placeholder={editingUser ? 'Minimal 6 karakter baru' : 'Minimal 6 karakter'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="form-input text-xs"
                  required={!editingUser}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="form-label text-xs">
                    Peran / Otoritas <span className="text-danger">*</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e: any) => setFormData({ ...formData, role: e.target.value })}
                    className="form-select text-xs"
                  >
                    <option value="wali_kelas">Wali Kelas</option>
                    <option value="guru_bk">Guru BK / Konselor</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="form-label text-xs">Status Akun</label>
                  <select
                    value={formData.is_active ? '1' : '0'}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.value === '1' })}
                    className="form-select text-xs"
                  >
                    <option value="1">Aktif (Dapat Login)</option>
                    <option value="0">Nonaktif (Diblokir)</option>
                  </select>
                </div>
              </div>

              {formData.role === 'wali_kelas' && (
                <div className="p-3 bg-page rounded-xl border border-border">
                  <label className="form-label text-xs">
                    Penugasan Rombongan Belajar (Kelas) <span className="text-danger">*</span>
                  </label>
                  <select
                    value={formData.class_id}
                    onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
                    className="form-select text-xs"
                    required={formData.role === 'wali_kelas'}
                  >
                    <option value="">-- Pilih Rombel Kelas --</option>
                    {[1, 2, 3, 4, 5, 6].map((grade) => {
                      const gradeClasses = classes.filter((c) => c.grade_level === grade);
                      if (gradeClasses.length === 0) return null;
                      return (
                        <optgroup key={grade} label={`Jenjang Kelas ${grade}`}>
                          {gradeClasses.map((c) => (
                            <option key={c.id} value={c.id}>
                              Kelas {c.name}
                            </option>
                          ))}
                        </optgroup>
                      );
                    })}
                  </select>
                  <p className="text-[11px] text-muted mt-1">
                    Wali Kelas hanya memiliki hak akses skrining & daftar siswa untuk rombel yang dipilih.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary text-xs py-2 px-4"
                  disabled={formSubmitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-4"
                  disabled={formSubmitting}
                >
                  {formSubmitting ? 'Menyimpan…' : (editingUser ? 'Simpan Perubahan' : 'Tambah Pengguna')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS PENGGUNA */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface w-full max-w-sm rounded-2xl border border-border shadow-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-danger mx-auto flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-ink">Hapus Akun Pengguna?</h3>
              <p className="text-xs text-muted mt-1">
                Apakah Anda yakin ingin menghapus akun <span className="font-semibold text-ink">{deleteTarget.name}</span> ({deleteTarget.email})? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="btn-secondary flex-1 justify-center text-xs py-2"
                disabled={deleting}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="btn-danger flex-1 justify-center text-xs py-2"
                disabled={deleting}
              >
                {deleting ? 'Menghapus…' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

