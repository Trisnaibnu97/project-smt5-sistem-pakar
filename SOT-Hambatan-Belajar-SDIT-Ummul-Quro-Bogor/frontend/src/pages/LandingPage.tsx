import React, { useState } from 'react';

interface LandingPageProps {
  onGoToLogin: () => void;
  onGoToRegister: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGoToLogin, onGoToRegister }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFDFB] text-[#1F2937] font-sans selection:bg-[#DCFCE7] selection:text-[#166534]">
      {/* ========================================================
          1. HEADER / NAVBAR
      ======================================================== */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo EduCare */}
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-[#E2E8F0] p-1 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <img
                  src="/logo.png"
                  alt="Logo EduCare"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl text-[#15803D] tracking-tight">EduCare</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#166534] border border-[#15803D]/20">
                    Sistem Pakar
                  </span>
                </div>
                <p className="text-xs text-[#64748B] font-medium leading-none mt-0.5">
                  Rumah Sahabat · SDIT Ummul Quro Bogor
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#475569]">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-[#15803D] transition-colors">
                Beranda
              </button>
              <button onClick={() => scrollTo('keunggulan')} className="hover:text-[#15803D] transition-colors">
                Fitur & Keunggulan
              </button>
              <button onClick={() => scrollTo('cara-kerja')} className="hover:text-[#15803D] transition-colors">
                Cara Kerja
              </button>
              <button onClick={() => scrollTo('diagnosa')} className="hover:text-[#15803D] transition-colors">
                Lingkup Diagnosa
              </button>
            </nav>

            {/* Right CTA Button: Navy Blue */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={onGoToLogin}
                className="inline-flex items-center gap-2 bg-[#1E3A5F] hover:bg-[#162D4A] active:scale-95 text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-md shadow-[#1E3A5F]/20 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login Sistem
              </button>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-[#F1F5F9] text-[#1E293B] hover:bg-[#E2E8F0]"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-[#E2E8F0] px-6 py-5 space-y-3">
            <button
              onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 text-sm font-semibold text-[#1E293B]"
            >
              Beranda
            </button>
            <button
              onClick={() => scrollTo('keunggulan')}
              className="block w-full text-left py-2 text-sm font-semibold text-[#1E293B]"
            >
              Fitur & Keunggulan
            </button>
            <button
              onClick={() => scrollTo('cara-kerja')}
              className="block w-full text-left py-2 text-sm font-semibold text-[#1E293B]"
            >
              Cara Kerja
            </button>
            <button
              onClick={() => scrollTo('diagnosa')}
              className="block w-full text-left py-2 text-sm font-semibold text-[#1E293B]"
            >
              Lingkup Diagnosa
            </button>
            <div className="pt-3 border-t border-[#E2E8F0] flex flex-col gap-2">
              <button
                onClick={onGoToLogin}
                className="w-full text-center bg-[#1E3A5F] text-white font-bold text-sm py-3 rounded-xl shadow"
              >
                Login Sistem
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================
          2. HERO SECTION
          Dominasi Sage Green & Off-White, Elemen Bersih & Rapi
      ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EBF3EA] via-[#F4F8F3] to-[#FBFDFB] pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Soft background ambient glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#DCFCE7]/60 to-[#FEF3C7]/40 blur-3xl pointer-events-none -z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* Left Column: Headlines & CTA (Col 7) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge Pills */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#15803D]/25 shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#15803D] animate-ping" />
                <span className="text-xs font-bold text-[#166534]">
                  Sistem Pakar Certainty Factor & Forward Chaining
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-[1.2]">
                Deteksi Dini Hambatan Belajar Siswa{' '}
                <span className="text-[#15803D] underline decoration-[#F59E0B] decoration-wavy underline-offset-8">
                  Lebih Cepat
                </span>{' '}
                dan{' '}
                <span className="text-[#15803D]">
                  Akurat.
                </span>
              </h1>

              {/* Sub-headline */}
              <p className="text-base sm:text-lg text-[#475569] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Bantu Wali Kelas dan Guru BK menganalisis gejala akademik, emosional, dan perilaku siswa secara objektif menggunakan teknologi Sistem Pakar.
              </p>

              {/* CTA Buttons (Amber/Soft Orange & Outline) */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3">
                <button
                  onClick={onGoToLogin}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#F59E0B] hover:bg-[#D97706] active:scale-95 text-white font-extrabold text-base px-8 py-3.5 rounded-xl shadow-lg shadow-[#F59E0B]/30 hover:shadow-xl transition-all duration-200"
                >
                  <span>Mulai Diagnosa Sekarang</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>

                <button
                  onClick={() => scrollTo('cara-kerja')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-[#15803D] text-[#15803D] hover:bg-[#DCFCE7]/50 active:scale-95 font-bold text-base px-7 py-3.5 rounded-xl transition-all duration-200"
                >
                  Pelajari Lebih Lanjut
                </button>
              </div>

              {/* Micro Trust Indicators */}
              <div className="pt-6 border-t border-[#E2E8F0]/80 grid grid-cols-3 gap-3 text-left">
                <div className="bg-white/70 backdrop-blur rounded-xl p-3 border border-[#E2E8F0]">
                  <p className="text-xl font-black text-[#15803D]">20+</p>
                  <p className="text-[11px] text-[#64748B] font-medium leading-tight mt-0.5">Indikator Observasi Terstandar</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl p-3 border border-[#E2E8F0]">
                  <p className="text-xl font-black text-[#F59E0B]">5 Fokus</p>
                  <p className="text-[11px] text-[#64748B] font-medium leading-tight mt-0.5">Klasifikasi Masalah Siswa</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl p-3 border border-[#E2E8F0]">
                  <p className="text-xl font-black text-[#1E3A5F]">100%</p>
                  <p className="text-[11px] text-[#64748B] font-medium leading-tight mt-0.5">Kerahasiaan Privasi Siswa</p>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Dashboard Mockup (Col 5) */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Visual Glow */}
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-[#15803D]/20 via-[#F59E0B]/20 to-[#1E3A5F]/20 blur-xl opacity-75" />

                <div className="relative bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl p-6 sm:p-7 space-y-5">
                  {/* Mockup Card Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-white border border-[#E2E8F0] p-1 flex items-center justify-center shadow-xs">
                        <img
                          src="/logo.png"
                          alt="Logo EduPakar"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#1E293B]">Ananda M. Fikri</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#F1F5F9] text-[#475569] rounded-md">Kelas 8-B</span>
                        </div>
                        <p className="text-[11px] text-[#64748B]">Simulasi Hasil Skrining Observasi</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FEF3C7] text-[#B45309] border border-[#F59E0B]/30">
                      Perlu Intervensi
                    </span>
                  </div>

                  {/* Confidence Bars (Certainty Factor visualization) */}
                  <div className="space-y-3.5">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-[#1E293B]">Kecemasan Akademik (H01)</span>
                        <span className="text-[#D97706]">84.6% CF</span>
                      </div>
                      <div className="w-full bg-[#F1F5F9] rounded-full h-2.5 overflow-hidden">
                        <div className="bg-[#F59E0B] h-2.5 rounded-full" style={{ width: '84.6%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-[#1E293B]">Inatensi & Atensi Belajar (H03)</span>
                        <span className="text-[#15803D]">68.2% CF</span>
                      </div>
                      <div className="w-full bg-[#F1F5F9] rounded-full h-2.5 overflow-hidden">
                        <div className="bg-[#15803D] h-2.5 rounded-full" style={{ width: '68.2%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-[#1E293B]">Demotivasi Belajar (H02)</span>
                        <span className="text-[#64748B]">32.0% CF</span>
                      </div>
                      <div className="w-full bg-[#F1F5F9] rounded-full h-2.5 overflow-hidden">
                        <div className="bg-[#94A3B8] h-2.5 rounded-full" style={{ width: '32%' }} />
                      </div>
                    </div>
                  </div>

                  {/* Automated Interventions Box */}
                  <div className="bg-[#F8FAF8] rounded-xl p-4 border border-[#15803D]/15 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#15803D]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Rekomendasi Intervensi Guru BK:
                    </div>
                    <p className="text-xs text-[#475569] leading-relaxed">
                      Lakukan sesi konseling relaksasi ujian & penyesuaian target bertahap bersama orang tua dan wali kelas.
                    </p>
                  </div>

                  {/* Status footer inside card */}
                  <div className="pt-2 flex items-center justify-between text-[11px] text-[#64748B]">
                    <span className="flex items-center gap-1.5 font-medium">
                      <span className="w-2 h-2 rounded-full bg-[#15803D]" />
                      Rule Base Terverifikasi Guru BK
                    </span>
                    <span className="font-mono font-semibold">CF-Engine v2.1</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          3. SECTION: KENAPA MEMILIH EDUPAKAR? (KEUNGGULAN)
          3 Kolom dengan Ikon: Otak/AI, Cepat/Petir, Dokumen/Laporan
      ======================================================== */}
      <section id="keunggulan" className="py-20 lg:py-24 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#DCFCE7] text-[#166534] text-xs font-bold tracking-wider uppercase">
              Fitur & Keunggulan
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Kenapa Memilih <span className="text-[#15803D]">EduCare</span>?
            </h2>
            <p className="text-base text-[#64748B] leading-relaxed">
              Dirancang khusus membantu Wali Kelas dan Guru BK mendiagnosa hambatan belajar lebih cepat, terstruktur, dan berbasis metode ilmiah.
            </p>
          </div>

          {/* 3 Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Card 1: Otak / AI */}
            <div className="relative group bg-[#F8FAF8] hover:bg-white rounded-2xl p-8 border border-[#E2E8F0] hover:border-[#15803D]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                  {/* Ikon Otak / AI */}
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#0F172A]">
                  Berbasis Pengetahuan Pakar
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed">
                  Mengimplementasikan algoritma <span className="font-semibold text-[#15803D]">Certainty Factor & Forward Chaining</span> yang dirumuskan secara langsung berdasarkan kaidah bimbingan konseling dan psikopedagogik.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center text-xs font-bold text-[#15803D]">
                <span>Tingkat Kepastian Matematis Terukur</span>
              </div>
            </div>

            {/* Card 2: Cepat / Petir */}
            <div className="relative group bg-[#FFFDF8] hover:bg-white rounded-2xl p-8 border border-[#FDE68A] hover:border-[#F59E0B]/60 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                  {/* Ikon Cepat / Petir */}
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#0F172A]">
                  Hasil Diagnosa Instan
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed">
                  Menghemat waktu observasi manual secara drastis. Begitu indikator gejala dipilih, sistem langsung mengkalkulasi skor kepastian hambatan belajar dalam hitungan detik.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#FDE68A] flex items-center text-xs font-bold text-[#D97706]">
                <span>Efisiensi Waktu Guru & Konselor</span>
              </div>
            </div>

            {/* Card 3: Dokumen / Laporan */}
            <div className="relative group bg-[#F8FAF8] hover:bg-white rounded-2xl p-8 border border-[#E2E8F0] hover:border-[#15803D]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                  {/* Ikon Dokumen / Laporan */}
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#0F172A]">
                  Rekomendasi Terarah
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed">
                  Bukan hanya diagnosis, tetapi memberikan solusi intervensi awal otomatis: panduan langkah konseling, penyesuaian proses belajar, hingga arahan rujukan ahli bila diperlukan.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center text-xs font-bold text-[#15803D]">
                <span>Tindak Lanjut Solutif & Aplikatif</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          4. SECTION: CARA KERJA (ALUR 3 LANGKAH)
          Secondary Color: Soft Orange Warm Background
      ======================================================== */}
      <section id="cara-kerja" className="py-20 lg:py-24 bg-gradient-to-b from-[#FFF7ED] via-[#FFEDD5]/40 to-[#FFF7ED] border-y border-[#FED7AA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EA580C]/10 text-[#C2410C] text-xs font-bold tracking-wider uppercase border border-[#FDBA74]">
              Alur Penggunaan Sistem
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Cara Kerja EduCare
            </h2>
            <p className="text-base text-[#7C2D12] leading-relaxed">
              Tiga langkah mudah bagi Wali Kelas dan Guru BK dalam mengidentifikasi hambatan belajar siswa.
            </p>
          </div>

          {/* 3 Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">

            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-7 border border-[#FDBA74] shadow-md shadow-[#EA580C]/5 space-y-4 text-center sm:text-left relative">
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-xl bg-[#FFEDD5] text-[#C2410C] font-black text-xl flex items-center justify-center border border-[#FDBA74]">
                  01
                </span>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-[#FEF3C7] text-[#92400E]">
                  Langkah 1
                </span>
              </div>
              <h4 className="text-lg font-bold text-[#0F172A]">
                Input 20 Indikator Observasi
              </h4>
              <p className="text-sm text-[#475569] leading-relaxed">
                Wali Kelas mengamati perilaku siswa dan menginput 20 indikator observasi yang relevan sesuai panduan skala gejala yang telah disiapkan.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-7 border border-[#FDBA74] shadow-md shadow-[#EA580C]/5 space-y-4 text-center sm:text-left relative">
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-xl bg-[#DCFCE7] text-[#15803D] font-black text-xl flex items-center justify-center border border-[#15803D]/30">
                  02
                </span>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-[#DCFCE7] text-[#166534]">
                  Langkah 2
                </span>
              </div>
              <h4 className="text-lg font-bold text-[#0F172A]">
                Pemrosesan Rule Base Pakar
              </h4>
              <p className="text-sm text-[#475569] leading-relaxed">
                Sistem memproses seluruh data dengan basis aturan (Rule Base) Guru BK menggunakan inferensi Certainty Factor & Forward Chaining.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-7 border border-[#FDBA74] shadow-md shadow-[#EA580C]/5 space-y-4 text-center sm:text-left relative">
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-xl bg-[#E0F2FE] text-[#0369A1] font-black text-xl flex items-center justify-center border border-[#0369A1]/30">
                  03
                </span>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-[#E0F2FE] text-[#0369A1]">
                  Langkah 3
                </span>
              </div>
              <h4 className="text-lg font-bold text-[#0F172A]">
                Hasil Diagnosa & Rekomendasi
              </h4>
              <p className="text-sm text-[#475569] leading-relaxed">
                Dapatkan persentase kepastian tingkat hambatan siswa beserta rekomendasi tindakan konkret untuk intervensi lanjutan di sekolah.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          5. SECTION: LINGKUP DIAGNOSA
          5 Masalah: Kecemasan Akademik, Demotivasi/Burnout, 
          Inatensi, Hambatan Spesifik, Hambatan Sosial-Emosional
      ======================================================== */}
      <section id="diagnosa" className="py-20 lg:py-24 bg-[#FBFDFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#DCFCE7] text-[#166534] text-xs font-bold tracking-wider uppercase">
              Cakupan Masalah Siswa
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Lingkup Diagnosa EduCare
            </h2>
            <p className="text-base text-[#64748B] leading-relaxed">
              Lima kategori utama hambatan belajar yang dapat diidentifikasi secara akurat melalui sistem ini.
            </p>
          </div>

          {/* 5 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* 1. Kecemasan Akademik */}
            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] hover:border-[#F59E0B] hover:shadow-lg transition-all duration-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold px-3 py-1 rounded-lg bg-[#FEF3C7] text-[#B45309] font-mono">
                  H01
                </span>
                <span className="text-[11px] font-semibold text-[#15803D] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full">
                  Emosional
                </span>
              </div>
              <h4 className="text-lg font-bold text-[#0F172A]">Kecemasan Akademik</h4>
              <p className="text-xs text-[#475569] leading-relaxed">
                Kondisi ketegangan berlebih saat menghadapi ujian, tugas, atau presentasi, yang menghambat kemampuan siswa mengekspresikan pemahaman akademiknya.
              </p>
            </div>

            {/* 2. Demotivasi / Burnout */}
            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] hover:border-[#EA580C] hover:shadow-lg transition-all duration-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold px-3 py-1 rounded-lg bg-[#FFEDD5] text-[#C2410C] font-mono">
                  H02
                </span>
                <span className="text-[11px] font-semibold text-[#EA580C] bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
                  Motivasi
                </span>
              </div>
              <h4 className="text-lg font-bold text-[#0F172A]">Demotivasi / Burnout</h4>
              <p className="text-xs text-[#475569] leading-relaxed">
                Kehilangan minat belajar yang signifikan, rasa jenuh berkepanjangan, pasif di kelas, serta keengganan menyelesaikan kewajiban tugas sekolah.
              </p>
            </div>

            {/* 3. Inatensi */}
            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] hover:border-[#15803D] hover:shadow-lg transition-all duration-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold px-3 py-1 rounded-lg bg-[#DCFCE7] text-[#166534] font-mono">
                  H03
                </span>
                <span className="text-[11px] font-semibold text-[#15803D] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full">
                  Atensi
                </span>
              </div>
              <h4 className="text-lg font-bold text-[#0F172A]">Inatensi</h4>
              <p className="text-xs text-[#475569] leading-relaxed">
                Kesulitan menjaga konsentrasi, mudah teralihkan oleh stimulus kecil, sering lupa instruksi guru, dan rentang perhatian yang singkat dalam proses belajar.
              </p>
            </div>

            {/* 4. Hambatan Spesifik */}
            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] hover:border-[#0369A1] hover:shadow-lg transition-all duration-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold px-3 py-1 rounded-lg bg-[#E0F2FE] text-[#0369A1] font-mono">
                  H04
                </span>
                <span className="text-[11px] font-semibold text-[#0369A1] bg-[#E0F2FE] px-2.5 py-0.5 rounded-full">
                  Kognitif
                </span>
              </div>
              <h4 className="text-lg font-bold text-[#0F172A]">Hambatan Spesifik</h4>
              <p className="text-xs text-[#475569] leading-relaxed">
                Kendala spesifik dalam keterampilan membaca fonologis (disleksia), menulis motorik halus (disgrafia), atau memahami konsep hitungan dasar (diskalkulia).
              </p>
            </div>

            {/* 5. Hambatan Sosial-Emosional */}
            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] hover:border-[#8B5CF6] hover:shadow-lg transition-all duration-200 space-y-3 md:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold px-3 py-1 rounded-lg bg-[#F3E8FF] text-[#7E22CE] font-mono">
                  H05
                </span>
                <span className="text-[11px] font-semibold text-[#7E22CE] bg-[#F3E8FF] px-2.5 py-0.5 rounded-full">
                  Sosial
                </span>
              </div>
              <h4 className="text-lg font-bold text-[#0F172A]">Hambatan Sosial-Emosional</h4>
              <p className="text-xs text-[#475569] leading-relaxed">
                Kesulitan dalam regulasi emosi, interaksi dengan teman sebaya, rasa rendah diri, atau kecenderungan menarik diri dari dinamika kelompok belajar.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          6. BANNER CALL TO ACTION
      ======================================================== */}
      <section className="bg-gradient-to-r from-[#166534] via-[#15803D] to-[#14532D] text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur">
            SMPIT Ummul Quro Bogor · Rumah Sahabat
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Siap Membantu Setiap Siswa Menggapai Potensi Terbaiknya?
          </h2>
          <p className="text-white/80 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Gunakan EduCare untuk diagnosa dini yang objektif dan rencanakan tindak lanjut intervensi belajar sedini mungkin.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onGoToLogin}
              className="bg-[#F59E0B] hover:bg-[#D97706] active:scale-95 text-white font-extrabold px-8 py-3.5 rounded-xl shadow-lg shadow-[#F59E0B]/30 transition-all text-base"
            >
              Masuk ke Sistem EduCare
            </button>
            <button
              onClick={onGoToRegister}
              className="border-2 border-white/60 hover:bg-white/10 active:scale-95 text-white font-bold px-7 py-3.5 rounded-xl transition-all text-base"
            >
              Registrasi Akun Wali Kelas
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. FOOTER
      ======================================================== */}
      <footer className="bg-white border-t border-[#E2E8F0] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#E2E8F0]">
            {/* Branding */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] p-1 flex items-center justify-center shadow-xs">
                <img
                  src="/logo.png"
                  alt="Logo EduCare"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-extrabold text-lg text-[#15803D] leading-none block">EduCare</span>
                <span className="text-xs text-[#64748B]">Sistem Pakar Diagnosa Dini Hambatan Belajar Siswa</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-[#475569]">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-[#15803D] transition-colors">
                Beranda
              </button>
              <button onClick={() => scrollTo('keunggulan')} className="hover:text-[#15803D] transition-colors">
                Keunggulan
              </button>
              <button onClick={() => scrollTo('cara-kerja')} className="hover:text-[#15803D] transition-colors">
                Cara Kerja
              </button>
              <button onClick={() => scrollTo('diagnosa')} className="hover:text-[#15803D] transition-colors">
                Lingkup Diagnosa
              </button>
              <button onClick={onGoToLogin} className="text-[#1E3A5F] font-bold hover:underline">
                Kontak Admin
              </button>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
            <p>
              Dikembangkan oleh <span className="font-bold text-[#0F172A]">Trisna Ibnu Maknun</span> — STIKOM El Rahma
            </p>
            <p>
              &copy; 2026 EduCare · SDIT Ummul Quro Bogor. Seluruh hak cipta dilindungi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
