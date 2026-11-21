import React, { useState, useEffect } from 'react';
import { RoleType, UserProfile } from '../types';
import { ROLES } from '../data/mockData';
import { api, ApiError } from '../services/api';
import { Logo } from '../components/Logo';

interface LoginPageProps {
  initialTab?: 'login' | 'register';
  onLogin: (role: RoleType, profile: UserProfile) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onBackToHome?: () => void;
}

function mapBackendRole(backendRole: string): RoleType {
  if (backendRole === 'guru_bk') return 'bk';
  if (backendRole === 'wali_kelas') return 'wali';
  return 'admin';
}

interface PublicClassItem {
  id: number;
  grade_level: number;
  name: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  initialTab = 'login',
  onLogin,
  onShowToast,
  onBackToHome,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regRole, setRegRole] = useState<'guru_bk' | 'wali_kelas' | 'admin'>('wali_kelas');
  const [regClassId, setRegClassId] = useState<number | null>(null);
  const [availableClasses, setAvailableClasses] = useState<PublicClassItem[]>([]);

  // Common state
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Load public classes list for Wali Kelas registration
  useEffect(() => {
    api.getPublicClasses()
      .then((res) => {
        setAvailableClasses(res.classes);
        if (res.classes.length > 0) {
          setRegClassId(res.classes[0].id);
        }
      })
      .catch(() => {});
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !/\S+@\S+\.\S+/.test(loginEmail)) {
      setError('Masukkan alamat surel yang valid.');
      return;
    }
    if (!loginPassword) {
      setError('Kata sandi tidak boleh kosong.');
      return;
    }

    setLoading(true);
    setError('');
    setInfoMessage('');
    try {
      const res = await api.login(loginEmail, loginPassword);
      const mappedRole = mapBackendRole(res.user.role);
      const profile: UserProfile = {
        ...ROLES[mappedRole],
        name: res.user.name,
        email: res.user.email,
        classes: res.user.classes,
      };
      onLogin(mappedRole, profile);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 422) {
          setError('Email atau kata sandi tidak sesuai. Periksa kembali data login Anda.');
        } else if (err.status === 403) {
          setError('Akun Anda dinonaktifkan. Hubungi administrator.');
        } else {
          setError(`Gagal terhubung ke server (${err.message}).`);
        }
      } else {
        setError('Tidak dapat terhubung ke server backend.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      setError('Nama lengkap wajib diisi.');
      return;
    }
    if (!regEmail || !/\S+@\S+\.\S+/.test(regEmail)) {
      setError('Masukkan alamat surel yang valid.');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setError('Kata sandi minimal 6 karakter.');
      return;
    }

    setLoading(true);
    setError('');
    setInfoMessage('');

    try {
      const res = await api.register({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        role: regRole,
        class_id: regRole === 'wali_kelas' ? regClassId : null,
      });

      if (res.redirected_to_wali) {
        onShowToast(res.message, 'info');
      } else {
        onShowToast('Registrasi berhasil! Anda telah masuk otomatis.', 'success');
      }

      const mappedRole = mapBackendRole(res.user.role);
      const profile: UserProfile = {
        ...ROLES[mappedRole],
        name: res.user.name,
        email: res.user.email,
        classes: res.user.classes,
      };
      onLogin(mappedRole, profile);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 422) {
          const validationErrors = err.data?.errors;
          const firstErr = validationErrors ? Object.values(validationErrors).flat()[0] : null;
          setError(typeof firstErr === 'string' ? firstErr : err.message);
        } else {
          setError(err.message || 'Gagal melakukan pendaftaran akun.');
        }
      } else {
        setError('Tidak dapat terhubung ke server backend.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !/\S+@\S+\.\S+/.test(forgotEmail)) {
      setError('Masukkan alamat surel yang valid untuk reset password.');
      return;
    }

    setForgotLoading(true);
    setError('');
    try {
      const res = await api.resetPassword(forgotEmail);
      setForgotSuccess(true);
      setLoginEmail(forgotEmail);
      setLoginPassword('password123');
      onShowToast(res.message, 'success');
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (err.status === 404 || err.status === 422) {
          setError(err.message || 'Alamat email tidak terdaftar dalam sistem.');
        } else {
          setError(err.message || 'Gagal mereset kata sandi.');
        }
      } else {
        setError('Tidak dapat terhubung ke server backend.');
      }
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-primary-light via-page to-accent-light relative">
      {onBackToHome && (
        <button
          onClick={onBackToHome}
          className="absolute top-6 left-6 inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-primary transition-colors bg-surface/80 backdrop-blur px-3.5 py-2 rounded-xl border border-border shadow-xs"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Kembali ke Beranda
        </button>
      )}

      <div className="w-full max-w-md">
        {/* Logo & Heading */}
        <div className="flex flex-col items-center mb-6">
          <div className="mb-3">
            <Logo size="lg" className="shadow-lg" />
          </div>
          <h1 className="text-2xl font-extrabold text-primary">Rumah Sahabat</h1>
          <p className="text-sm text-muted mt-1 text-center">Sistem Pendukung Observasi Hambatan Belajar · SDIT Ummul Quro Bogor</p>
        </div>

        {/* Card Form */}
        <div className="card shadow-xl">
          {/* Tabs: Masuk vs Registrasi */}
          <div className="flex border-b border-border mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setError('');
                setInfoMessage('');
              }}
              className={`flex-1 py-2.5 text-center text-sm font-semibold border-b-2 transition-all ${
                activeTab === 'login'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setError('');
                setInfoMessage('');
              }}
              className={`flex-1 py-2.5 text-center text-sm font-semibold border-b-2 transition-all ${
                activeTab === 'register'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              Daftar Akun Baru
            </button>
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 text-danger text-xs rounded-xl border border-red-200">{error}</div>}
          {infoMessage && <div className="mb-4 p-3 bg-blue-50 text-info text-xs rounded-xl border border-blue-200">{infoMessage}</div>}

          {/* TAB 1: FORM LOGIN */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} noValidate>
              <div className="mb-4">
                <label className="form-label" htmlFor="login-email">
                  Surel <span className="text-danger">*</span>
                </label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="nama@sdit-uq.sch.id"
                  className="form-input"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-1">
                  <label className="form-label mb-0" htmlFor="login-password">
                    Kata Sandi <span className="text-danger">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(loginEmail);
                      setError('');
                      setForgotSuccess(false);
                      setShowForgotModal(true);
                    }}
                    className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
                  >
                    Lupa Kata Sandi?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showLoginPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="form-input pr-10"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    aria-label="Tampilkan/sembunyikan kata sandi"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full justify-center text-base" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Memverifikasi…
                  </span>
                ) : (
                  'Masuk ke Sistem'
                )}
              </button>
            </form>
          )}

          {/* TAB 2: FORM REGISTRASI AKUN BARU */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} noValidate>
              <div className="mb-4">
                <label className="form-label" htmlFor="reg-name">
                  Nama Lengkap & Gelar <span className="text-danger">*</span>
                </label>
                <input
                  id="reg-name"
                  type="text"
                  placeholder="Contoh: Ustadzah Nurul, S.Pd"
                  className="form-input"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="mb-4">
                <label className="form-label" htmlFor="reg-email">
                  Surel Resmi <span className="text-danger">*</span>
                </label>
                <input
                  id="reg-email"
                  type="email"
                  placeholder="nama@sdit-uq.sch.id"
                  className="form-input"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="mb-4">
                <label className="form-label" htmlFor="reg-password">
                  Kata Sandi (Min. 6 Karakter) <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    type={showRegPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="form-input pr-10"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    aria-label="Tampilkan/sembunyikan kata sandi"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label" htmlFor="reg-role">
                  Pilih Peran / Role <span className="text-danger">*</span>
                </label>
                <select
                  id="reg-role"
                  className="form-select"
                  value={regRole}
                  disabled={loading}
                  onChange={(e) => setRegRole(e.target.value as 'guru_bk' | 'wali_kelas' | 'admin')}
                >
                  <option value="wali_kelas">Wali Kelas</option>
                  <option value="guru_bk">Guru BK (Maks. 2 Akun)</option>
                  <option value="admin">Admin Sistem (Maks. 2 Akun)</option>
                </select>
                <p className="text-[11px] text-muted mt-1">
                  Catatan: Akun Guru BK & Admin dibatasi maksimal 2 akun. Jika kuota penuh, registrasi otomatis dialihkan ke Wali Kelas.
                </p>
              </div>

              {/* Rombel Kelas khusus jika Wali Kelas */}
              {regRole === 'wali_kelas' && (
                <div className="mb-6 p-3 bg-page rounded-xl border border-border">
                  <label className="form-label text-xs" htmlFor="reg-class">
                    Penugasan Rombel Kelas (Opsional)
                  </label>
                  <select
                    id="reg-class"
                    className="form-select text-xs"
                    value={regClassId ?? ''}
                    disabled={loading}
                    onChange={(e) => setRegClassId(Number(e.target.value))}
                  >
                    <option value="">-- Pilih Rombel Kelas yang Diampu --</option>
                    {[1, 2, 3, 4, 5, 6].map((grade) => {
                      const gradeClasses = availableClasses.filter((c) => c.grade_level === grade);
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
                </div>
              )}

              <button type="submit" className="btn-primary w-full justify-center text-base" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Mendaftarkan Akun…
                  </span>
                ) : (
                  'Daftar Sekarang'
                )}
              </button>
            </form>
          )}
        </div>

        <p className="text-xs text-center text-muted mt-6">
          Alat bantu skrining awal. Bukan alat diagnosis medis, psikologis, atau penetapan label siswa.
        </p>
      </div>

      {/* MODAL LUPA KATA SANDI */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface w-full max-w-md rounded-2xl border border-border shadow-2xl p-6 relative">
            <button
              onClick={() => {
                setShowForgotModal(false);
                setError('');
                setForgotSuccess(false);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-muted hover:bg-page hover:text-ink transition-colors"
              aria-label="Tutup modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink">Lupa Kata Sandi?</h3>
                <p className="text-xs text-muted">Reset kata sandi akun Anda ke nilai default</p>
              </div>
            </div>

            {forgotSuccess ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-primary-light/60 border border-primary/30 text-xs text-primary-dark space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-primary-dark">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Kata Sandi Berhasil Direset!
                  </div>
                  <p>
                    Kata sandi untuk surel <span className="font-semibold underline">{forgotEmail}</span> telah diubah ke default:
                  </p>
                  <div className="p-2.5 bg-white rounded-lg border border-primary/40 font-mono font-bold text-center text-sm text-ink selection:bg-primary-light">
                    password123
                  </div>
                  <p className="text-[11px] text-muted">
                    Formulir login di belakang telah otomatis diisikan dengan kata sandi baru.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSuccess(false);
                  }}
                  className="btn-primary w-full justify-center"
                >
                  Masuk Sekarang dengan Kata Sandi Baru
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <p className="text-xs text-muted leading-relaxed">
                  Masukkan surel akun Anda yang terdaftar. Sistem akan mereset kata sandi akun Anda ke default: <code className="bg-page px-1.5 py-0.5 rounded text-primary font-bold">password123</code>.
                </p>

                {error && (
                  <div className="p-3 bg-red-50 text-danger text-xs rounded-xl border border-red-200">
                    {error}
                  </div>
                )}

                <div>
                  <label className="form-label" htmlFor="forgot-email">
                    Alamat Surel Terdaftar <span className="text-danger">*</span>
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    placeholder="nama@sdit-uq.sch.id"
                    className="form-input"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    disabled={forgotLoading}
                    autoFocus
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(false);
                      setError('');
                    }}
                    className="btn-secondary flex-1 justify-center"
                    disabled={forgotLoading}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1 justify-center"
                    disabled={forgotLoading}
                  >
                    {forgotLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" stroke="currentColor" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Mereset…
                      </span>
                    ) : (
                      'Reset Kata Sandi'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

