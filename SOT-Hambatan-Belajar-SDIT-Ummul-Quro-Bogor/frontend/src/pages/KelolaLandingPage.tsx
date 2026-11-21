import React, { useState } from 'react';
import {
  LandingPageConfig,
  getLandingConfig,
  saveLandingConfig,
  resetLandingConfig,
} from '../services/landingConfig';

interface KelolaLandingPageProps {
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onPreviewLanding?: () => void;
}

export const KelolaLandingPage: React.FC<KelolaLandingPageProps> = ({
  onShowToast,
  onPreviewLanding,
}) => {
  const [activeTab, setActiveTab] = useState<'hero' | 'features' | 'contact' | 'preview'>('hero');
  const [config, setConfig] = useState<LandingPageConfig>(() => getLandingConfig());
  const [hasChanges, setHasChanges] = useState(false);

  // Update nested hero config
  const updateHero = (key: keyof LandingPageConfig['hero'], value: string) => {
    setConfig((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  // Update feature item
  const updateFeatureItem = (index: number, key: 'title' | 'desc' | 'badge', value: string) => {
    setConfig((prev) => {
      const items = [...prev.features.items];
      items[index] = { ...items[index], [key]: value };
      return {
        ...prev,
        features: {
          ...prev.features,
          items,
        },
      };
    });
    setHasChanges(true);
  };

  // Update feature section headers
  const updateFeatures = (key: 'sectionBadge' | 'sectionTitle' | 'sectionSubtitle', value: string) => {
    setConfig((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  // Update contact
  const updateContact = (key: keyof LandingPageConfig['contact'], value: string) => {
    setConfig((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  // Save changes
  const handleSave = () => {
    saveLandingConfig(config);
    setHasChanges(false);
    onShowToast('Pengaturan Landing Page berhasil disimpan!', 'success');
  };

  // Reset to default
  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin mengembalikan teks Landing Page ke setelan default?')) {
      const def = resetLandingConfig();
      setConfig(def);
      setHasChanges(false);
      onShowToast('Landing Page dikembalikan ke setelan default pabrik.', 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="bg-white rounded-2xl border border-border-card p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-navy">Kelola Konten Landing Page</h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Admin CMS
            </span>
          </div>
          <p className="text-sm text-muted mt-1">
            Ubah teks headline, statistik, fitur unggulan, dan informasi kontak SDIT Ummul Quro secara langsung.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition border border-rose-200"
          >
            Reset Default
          </button>
          <button
            type="button"
            onClick={handleSave}
            className={`px-5 py-2.5 text-sm font-bold text-white rounded-xl shadow-md transition flex items-center gap-2 ${
              hasChanges
                ? 'bg-emerald-600 hover:bg-emerald-700 animate-pulse shadow-emerald-600/30'
                : 'bg-primary-forest hover:bg-primary-forest/90'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Simpan Perubahan
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-border-card pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'hero'
              ? 'bg-primary-forest text-white shadow-sm'
              : 'text-muted hover:text-navy hover:bg-slate-100'
          }`}
        >
          <span>🎯</span> Hero & Headline Utama
        </button>
        <button
          onClick={() => setActiveTab('features')}
          className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'features'
              ? 'bg-primary-forest text-white shadow-sm'
              : 'text-muted hover:text-navy hover:bg-slate-100'
          }`}
        >
          <span>✨</span> Fitur & Keunggulan
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'contact'
              ? 'bg-primary-forest text-white shadow-sm'
              : 'text-muted hover:text-navy hover:bg-slate-100'
          }`}
        >
          <span>📞</span> Kontak & Alamat Sekolah
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'preview'
              ? 'bg-primary-forest text-white shadow-sm'
              : 'text-muted hover:text-navy hover:bg-slate-100'
          }`}
        >
          <span>👁️</span> Pratinjau Teks
        </button>
      </div>

      {/* ========================================================
          TAB 1: HERO & HEADLINE
      ======================================================== */}
      {activeTab === 'hero' && (
        <div className="bg-white rounded-2xl border border-border-card p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-navy">Teks Hero & Ajakan Utama</h3>
            <p className="text-xs text-muted">Bagian paling atas yang pertama kali dilihat oleh pengunjung saat membuka web.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Badge pill */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Badge Atas (Pill)
              </label>
              <input
                type="text"
                value={config.hero.badge}
                onChange={(e) => updateHero('badge', e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-forest"
                placeholder="Contoh: Sistem Pakar Certainty Factor & Forward Chaining"
              />
            </div>

            {/* Headline part 1 */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Headline Teks Awal
              </label>
              <input
                type="text"
                value={config.hero.headlinePart1}
                onChange={(e) => updateHero('headlinePart1', e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-forest"
              />
            </div>

            {/* Highlight 1 (Green Wavy underline) */}
            <div>
              <label className="block text-xs font-bold text-emerald-700 mb-1">
                Kata Highlight 1 (Hijau + Garis Ombak)
              </label>
              <input
                type="text"
                value={config.hero.highlight1}
                onChange={(e) => updateHero('highlight1', e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50/30 focus:outline-none focus:ring-2 focus:ring-primary-forest font-semibold"
              />
            </div>

            {/* Headline part 2 */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kata Penyambung
              </label>
              <input
                type="text"
                value={config.hero.headlinePart2}
                onChange={(e) => updateHero('headlinePart2', e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-forest"
              />
            </div>

            {/* Highlight 2 */}
            <div>
              <label className="block text-xs font-bold text-emerald-700 mb-1">
                Kata Highlight 2 (Hijau Tebal)
              </label>
              <input
                type="text"
                value={config.hero.highlight2}
                onChange={(e) => updateHero('highlight2', e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50/30 focus:outline-none focus:ring-2 focus:ring-primary-forest font-semibold"
              />
            </div>

            {/* Subheadline */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sub-Headline (Deskripsi Singkat)
              </label>
              <textarea
                rows={3}
                value={config.hero.subheadline}
                onChange={(e) => updateHero('subheadline', e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-forest"
              />
            </div>

            {/* CTA Primary */}
            <div>
              <label className="block text-xs font-bold text-amber-700 mb-1">
                Teks Tombol Utama (Oranye Amber)
              </label>
              <input
                type="text"
                value={config.hero.ctaPrimaryText}
                onChange={(e) => updateHero('ctaPrimaryText', e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50/30 focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
              />
            </div>

            {/* CTA Secondary */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Teks Tombol Kedua (Outline)
              </label>
              <input
                type="text"
                value={config.hero.ctaSecondaryText}
                onChange={(e) => updateHero('ctaSecondaryText', e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-forest"
              />
            </div>
          </div>

          {/* Micro Stats in Hero */}
          <div className="border-t border-slate-100 pt-5 space-y-4">
            <h4 className="text-xs font-bold text-navy uppercase tracking-wider">
              3 Kotak Statistik Kecil di Bawah Tombol
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Stat 1 */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-[11px] font-bold text-emerald-700">Statistik 1</label>
                <input
                  type="text"
                  placeholder="Angka (misal: 20+)"
                  value={config.hero.stat1Number}
                  onChange={(e) => updateHero('stat1Number', e.target.value)}
                  className="w-full text-sm font-bold px-3 py-1.5 rounded-lg border border-slate-200"
                />
                <input
                  type="text"
                  placeholder="Keterangan singkat"
                  value={config.hero.stat1Label}
                  onChange={(e) => updateHero('stat1Label', e.target.value)}
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200"
                />
              </div>

              {/* Stat 2 */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-[11px] font-bold text-amber-700">Statistik 2</label>
                <input
                  type="text"
                  placeholder="Angka (misal: 4 Fokus)"
                  value={config.hero.stat2Number}
                  onChange={(e) => updateHero('stat2Number', e.target.value)}
                  className="w-full text-sm font-bold px-3 py-1.5 rounded-lg border border-slate-200"
                />
                <input
                  type="text"
                  placeholder="Keterangan singkat"
                  value={config.hero.stat2Label}
                  onChange={(e) => updateHero('stat2Label', e.target.value)}
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200"
                />
              </div>

              {/* Stat 3 */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-[11px] font-bold text-navy">Statistik 3</label>
                <input
                  type="text"
                  placeholder="Angka (misal: 100%)"
                  value={config.hero.stat3Number}
                  onChange={(e) => updateHero('stat3Number', e.target.value)}
                  className="w-full text-sm font-bold px-3 py-1.5 rounded-lg border border-slate-200"
                />
                <input
                  type="text"
                  placeholder="Keterangan singkat"
                  value={config.hero.stat3Label}
                  onChange={(e) => updateHero('stat3Label', e.target.value)}
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: FITUR & KEUNGGULAN
      ======================================================== */}
      {activeTab === 'features' && (
        <div className="bg-white rounded-2xl border border-border-card p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-navy">Teks Bagian Fitur & Keunggulan</h3>
            <p className="text-xs text-muted">Pengaturan judul bagian dan 3 kartu pilar keunggulan sistem pakar.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Badge Section
              </label>
              <input
                type="text"
                value={config.features.sectionBadge}
                onChange={(e) => updateFeatures('sectionBadge', e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-forest"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Judul Utama Section
              </label>
              <input
                type="text"
                value={config.features.sectionTitle}
                onChange={(e) => updateFeatures('sectionTitle', e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-forest"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sub-Judul Deskripsi
              </label>
              <input
                type="text"
                value={config.features.sectionSubtitle}
                onChange={(e) => updateFeatures('sectionSubtitle', e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-forest"
              />
            </div>
          </div>

          {/* 3 Items */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-navy uppercase tracking-wider">
              3 Kartu Keunggulan
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {config.features.items.map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Kartu #{idx + 1}
                    </span>
                    <input
                      type="text"
                      placeholder="Badge Tag"
                      value={item.badge}
                      onChange={(e) => updateFeatureItem(idx, 'badge', e.target.value)}
                      className="text-[11px] font-semibold px-2 py-1 rounded border border-slate-300 w-32 text-right"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Judul Fitur</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateFeatureItem(idx, 'title', e.target.value)}
                      className="w-full text-sm font-bold px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Deskripsi Fitur</label>
                    <textarea
                      rows={3}
                      value={item.desc}
                      onChange={(e) => updateFeatureItem(idx, 'desc', e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: KONTAK & ALAMAT SEKOLAH
      ======================================================== */}
      {activeTab === 'contact' && (
        <div className="bg-white rounded-2xl border border-border-card p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-navy">Informasi Instansi & Kontak</h3>
            <p className="text-xs text-muted">Ditampilkan pada bagian footer dan profil layanan SDIT Ummul Quro Bogor.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Sekolah
              </label>
              <input
                type="text"
                value={config.contact.schoolName}
                onChange={(e) => updateContact('schoolName', e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-forest font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Unit / Divisi
              </label>
              <input
                type="text"
                value={config.contact.unitName}
                onChange={(e) => updateContact('unitName', e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-forest"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Alamat Lengkap
              </label>
              <textarea
                rows={2}
                value={config.contact.address}
                onChange={(e) => updateContact('address', e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-forest"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nomor Telepon / Hotline
              </label>
              <input
                type="text"
                value={config.contact.phone}
                onChange={(e) => updateContact('phone', e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-forest"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Resmi
              </label>
              <input
                type="email"
                value={config.contact.email}
                onChange={(e) => updateContact('email', e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-forest"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Jam Layanan Operasional
              </label>
              <input
                type="text"
                value={config.contact.operatingHours}
                onChange={(e) => updateContact('operatingHours', e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-forest"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: PRATINJAU TEKS
      ======================================================== */}
      {activeTab === 'preview' && (
        <div className="bg-slate-50 rounded-2xl border border-border-card p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-navy">Pratinjau Live Konten</h3>
              <p className="text-xs text-muted">Tampilan ringkas teks yang akan dibaca oleh pengunjung di halaman depan.</p>
            </div>
            {onPreviewLanding && (
              <button
                type="button"
                onClick={onPreviewLanding}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-navy text-white hover:bg-navy/90"
              >
                Buka Halaman Depan
              </button>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              {config.hero.badge}
            </div>
            <h1 className="text-2xl font-black text-slate-900">
              {config.hero.headlinePart1}{' '}
              <span className="text-emerald-700 underline decoration-amber-400 decoration-wavy">
                {config.hero.highlight1}
              </span>{' '}
              {config.hero.headlinePart2}{' '}
              <span className="text-emerald-700">
                {config.hero.highlight2}
              </span>
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              {config.hero.subheadline}
            </p>
            <div className="flex gap-3 pt-2">
              <span className="px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs shadow">
                {config.hero.ctaPrimaryText}
              </span>
              <span className="px-4 py-2 rounded-xl border border-emerald-600 text-emerald-700 font-bold text-xs">
                {config.hero.ctaSecondaryText}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center">
              <div className="p-2 bg-slate-50 rounded-lg">
                <p className="font-black text-emerald-700">{config.hero.stat1Number}</p>
                <p className="text-[10px] text-slate-500">{config.hero.stat1Label}</p>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg">
                <p className="font-black text-amber-600">{config.hero.stat2Number}</p>
                <p className="text-[10px] text-slate-500">{config.hero.stat2Label}</p>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg">
                <p className="font-black text-navy">{config.hero.stat3Number}</p>
                <p className="text-[10px] text-slate-500">{config.hero.stat3Label}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
