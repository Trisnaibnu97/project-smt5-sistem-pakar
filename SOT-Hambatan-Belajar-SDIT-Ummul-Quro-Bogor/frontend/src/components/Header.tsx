import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../types';
import { Logo } from './Logo';

interface HeaderProps {
  user: UserProfile;
  onToggleSidebar: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onToggleSidebar, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-surface border-b border-border sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        {/* Hamburger mobile */}
        <button
          onClick={onToggleSidebar}
          aria-label="Buka/tutup menu"
          className="md:hidden p-2 rounded-lg hover:bg-page text-ink mr-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <Logo size="sm" />
          <div className="hidden sm:block">
            <span className="font-bold text-primary text-sm leading-tight block">Rumah Sahabat</span>
            <span className="text-xs text-muted leading-tight block">SDIT Ummul Quro Bogor</span>
          </div>
        </div>

        {/* Search placeholder */}
        <div className="flex-1 mx-4 hidden md:block max-w-xs">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              placeholder="Cari siswa, kasus…"
              aria-label="Cari"
              className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-page focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted"
            />
          </div>
        </div>

        {/* Badge Demo */}
        <span className="hidden md:flex badge badge-orange mr-3">⚠ DATA DEMO</span>

        {/* User profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-page transition-colors"
          >
            <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center text-primary font-bold text-sm">
              {user.initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium leading-tight">{user.name}</p>
              <p className="text-xs text-muted leading-tight">{user.label} [DEMO]</p>
            </div>
            <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-surface rounded-xl border border-border shadow-lg z-50">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-xs font-semibold text-ink">{user.name}</p>
                <p className="text-xs text-muted">{user.label} [DEMO]</p>
              </div>
              <button
                onClick={onLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-danger hover:bg-red-50 rounded-b-xl transition-colors"
              >
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
