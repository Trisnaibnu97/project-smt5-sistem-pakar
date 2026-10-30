import React, { useState, useEffect } from 'react';
import { RoleType, ToastState, UserProfile } from './types';
import { ROLES } from './data/mockData';
import { api } from './services/api';
import { LoginPage } from './pages/LoginPage';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';
import { DashboardBK } from './pages/DashboardBK';
import { DashboardWali } from './pages/DashboardWali';
import { DashboardAdmin } from './pages/DashboardAdmin';
import { DaftarSiswaPage } from './pages/DaftarSiswaPage';
import { SkriningPage } from './pages/SkriningPage';
import { BasisPengetahuanPage } from './pages/BasisPengetahuanPage';
import { TindakLanjutPage } from './pages/TindakLanjutPage';
import { LaporanPage } from './pages/LaporanPage';
import { PanduanPage } from './pages/PanduanPage';

/**
 * Map backend role string to frontend RoleType key
 */
function mapBackendRole(backendRole: string): RoleType {
  if (backendRole === 'guru_bk') return 'bk';
  if (backendRole === 'wali_kelas') return 'wali';
  return 'admin';
}

export const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<RoleType | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toast, setToast] = useState<ToastState>({ show: false, msg: '', type: 'success' });

  // On app start: restore session from stored token
  useEffect(() => {
    const token = api.getToken();
    if (token) {
      api.getMe()
        .then((res) => {
          const role = mapBackendRole(res.user.role);
          const profile: UserProfile = {
            ...ROLES[role],
            name: res.user.name,
            email: res.user.email,
          };
          setCurrentRole(role);
          setCurrentUser(profile);
          setCurrentPage(ROLES[role].defaultPage);
        })
        .catch(() => {
          // Token expired or invalid — clear it
          api.clearToken();
        });
    }
  }, []);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3500);
  };

  /**
   * Called by LoginPage after successful API auth.
   */
  const handleLogin = (role: RoleType, profile: UserProfile) => {
    setCurrentRole(role);
    setCurrentUser(profile);
    setCurrentPage(ROLES[role].defaultPage);
    showToast(`Selamat datang, ${profile.name}!`, 'success');
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch {
      // Ignore logout errors — clear state anyway
    }
    setCurrentRole(null);
    setCurrentUser(null);
    setCurrentPage('dashboard');
    showToast('Anda telah keluar dari sesi.', 'info');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // If not logged in, render Login page
  if (!currentRole || !currentUser) {
    return (
      <>
        <LoginPage onLogin={handleLogin} onShowToast={showToast} />
        <Toast toast={toast} />
      </>
    );
  }

  // Render main page content
  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard-bk':
        return <DashboardBK onNavigate={handleNavigate} />;
      case 'dashboard-wali':
        return <DashboardWali onNavigate={handleNavigate} />;
      case 'dashboard-admin':
        return <DashboardAdmin onNavigate={handleNavigate} />;
      case 'skrining':
        return <SkriningPage onShowToast={showToast} />;
      case 'daftar-siswa':
        return <DaftarSiswaPage onNavigate={handleNavigate} />;
      case 'tindak-lanjut':
        return <TindakLanjutPage onShowToast={showToast} />;
      case 'basis-pengetahuan':
        return <BasisPengetahuanPage onShowToast={showToast} />;
      case 'laporan':
        return <LaporanPage />;
      case 'panduan':
        return <PanduanPage currentRole={currentRole} />;
      default:
        if (currentRole === 'bk') return <DashboardBK onNavigate={handleNavigate} />;
        if (currentRole === 'wali') return <DashboardWali onNavigate={handleNavigate} />;
        return <DashboardAdmin onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Header
        user={currentUser}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onLogout={handleLogout}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          currentRole={currentRole}
          currentPage={currentPage}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onNavigate={handleNavigate}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="page max-w-6xl mx-auto">{renderContent()}</div>
        </main>
      </div>

      <Toast toast={toast} />
    </div>
  );
};
export default App;
