import React from 'react';
import { RoleType } from '../types';

interface SidebarProps {
  currentRole: RoleType;
  currentPage: string;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  currentPage,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      roles: ['bk', 'wali', 'admin'],
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'skrining',
      label: 'Skrining Baru',
      roles: ['bk', 'wali'],
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      id: 'daftar-siswa',
      label: 'Daftar Siswa',
      roles: ['bk', 'wali', 'admin'],
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      id: 'tindak-lanjut',
      label: 'Tindak Lanjut',
      roles: ['bk', 'wali'],
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'basis-pengetahuan',
      label: 'Basis Pengetahuan',
      roles: ['admin'],
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      id: 'laporan',
      label: 'Laporan Agregat',
      roles: ['bk', 'admin'],
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      id: 'panduan',
      label: 'Panduan Sistem',
      roles: ['bk', 'wali', 'admin'],
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
  ];

  const roleLabels: Record<RoleType, { text: string; cls: string }> = {
    bk: { text: 'Guru BK', cls: 'badge-green' },
    wali: { text: 'Wali Kelas', cls: 'badge-orange' },
    admin: { text: 'Admin', cls: 'badge-blue' },
  };

  const allowedItems = navItems.filter((item) => item.roles.includes(currentRole));

  const roleDashboard = `dashboard-${currentRole}`;
  const isDashboardActive = currentPage === roleDashboard || currentPage === 'dashboard';

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-surface border-r border-border flex flex-col pt-20 pb-6 px-3 transform transition-transform duration-300 md:relative md:inset-auto md:pt-6 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Role badge */}
        <div className="px-2 mb-4">
          <span className={`badge w-full justify-center py-1 ${roleLabels[currentRole].cls}`}>
            {roleLabels[currentRole].text}
          </span>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1" aria-label="Menu navigasi">
          {allowedItems.map((item) => {
            const isActive = item.id === 'dashboard' ? isDashboardActive : currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id === 'dashboard' ? roleDashboard : item.id);
                  onClose();
                }}
                className={`sidebar-link w-full text-left ${isActive ? 'active' : ''}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="mt-auto px-2">
          <div className="rounded-xl bg-primary-light p-3 text-xs text-primary-dark">
            <p className="font-semibold mb-1">⚡ React + TS Prototype</p>
            <p>Phase 2 data tervalidasi. Siap integrasi API.</p>
          </div>
        </div>
      </aside>

      {/* Overlay mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-20 md:hidden transition-opacity"
        />
      )}
    </>
  );
};
