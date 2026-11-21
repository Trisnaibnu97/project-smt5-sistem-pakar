export interface LandingPageConfig {
  hero: {
    badge: string;
    headlinePart1: string;
    highlight1: string;
    headlinePart2: string;
    highlight2: string;
    subheadline: string;
    ctaPrimaryText: string;
    ctaSecondaryText: string;
    stat1Number: string;
    stat1Label: string;
    stat2Number: string;
    stat2Label: string;
    stat3Number: string;
    stat3Label: string;
  };
  features: {
    sectionBadge: string;
    sectionTitle: string;
    sectionSubtitle: string;
    items: Array<{
      title: string;
      desc: string;
      badge: string;
    }>;
  };
  contact: {
    schoolName: string;
    unitName: string;
    address: string;
    phone: string;
    email: string;
    operatingHours: string;
  };
}

export const DEFAULT_LANDING_CONFIG: LandingPageConfig = {
  hero: {
    badge: 'Sistem Pakar Certainty Factor & Forward Chaining',
    headlinePart1: 'Deteksi Dini Hambatan Belajar Siswa',
    highlight1: 'Lebih Cepat',
    headlinePart2: 'dan',
    highlight2: 'Akurat.',
    subheadline: 'Bantu Wali Kelas dan Guru BK menganalisis gejala akademik, emosional, dan perilaku siswa secara objektif menggunakan teknologi Sistem Pakar.',
    ctaPrimaryText: 'Mulai Diagnosa Sekarang',
    ctaSecondaryText: 'Pelajari Lebih Lanjut',
    stat1Number: '20+',
    stat1Label: 'Indikator Observasi Terstandar',
    stat2Number: '4 Fokus',
    stat2Label: 'Klasifikasi Masalah Siswa',
    stat3Number: '100%',
    stat3Label: 'Kerahasiaan Privasi Siswa',
  },
  features: {
    sectionBadge: 'Keunggulan Utama',
    sectionTitle: 'Mengapa EduCare Menjadi Solusi Terbaik?',
    sectionSubtitle: 'Dirancang khusus untuk ekosistem sekolah Islam terpadu dengan standar bimbingan konseling komprehensif.',
    items: [
      {
        title: 'Certainty Factor Multi-Hipotesis',
        desc: 'Menghitung derajat kepastian gejala secara matematis sehingga hasil analisis objektif dan dapat dipertanggungjawabkan.',
        badge: 'Metode Ilmiah',
      },
      {
        title: 'Kolaborasi Wali Kelas & BK',
        desc: 'Wali kelas dapat mengisi observasi berkala dan guru BK melakukan verifikasi serta merumuskan rekomendasi intervensi edukatif.',
        badge: 'Terintegrasi',
      },
      {
        title: 'Tindak Lanjut & Intervensi Terarah',
        desc: 'Menyediakan panduan pendampingan konkret mulai dari penyesuaian kelas hingga rujukan profesional jika diperlukan.',
        badge: 'Solutif',
      },
    ],
  },
  contact: {
    schoolName: 'SDIT Ummul Quro Bogor',
    unitName: 'Layanan Bimbingan Konseling & Rumah Sahabat',
    address: 'Jl. KH. Sholeh Iskandar No. 1, Parakan Jaya, Kemang, Kota Bogor, Jawa Barat',
    phone: '(0251) 7535824',
    email: 'bk@sdit-uq.sch.id',
    operatingHours: 'Senin - Jumat | 07.30 - 15.30 WIB',
  },
};

const LANDING_CONFIG_KEY = 'educare_landing_config';

export const getLandingConfig = (): LandingPageConfig => {
  try {
    const saved = localStorage.getItem(LANDING_CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        hero: { ...DEFAULT_LANDING_CONFIG.hero, ...(parsed.hero || {}) },
        features: { ...DEFAULT_LANDING_CONFIG.features, ...(parsed.features || {}) },
        contact: { ...DEFAULT_LANDING_CONFIG.contact, ...(parsed.contact || {}) },
      };
    }
  } catch (e) {
    console.error('Failed to parse landing config from localStorage', e);
  }
  return DEFAULT_LANDING_CONFIG;
};

export const saveLandingConfig = (config: LandingPageConfig): void => {
  try {
    localStorage.setItem(LANDING_CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save landing config to localStorage', e);
  }
};

export const resetLandingConfig = (): LandingPageConfig => {
  try {
    localStorage.removeItem(LANDING_CONFIG_KEY);
  } catch (e) {
    console.error('Failed to reset landing config', e);
  }
  return DEFAULT_LANDING_CONFIG;
};
