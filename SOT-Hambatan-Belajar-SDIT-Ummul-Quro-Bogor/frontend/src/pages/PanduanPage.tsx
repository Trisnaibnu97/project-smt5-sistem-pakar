import React, { useState } from 'react';
import { RoleType } from '../types';

interface PanduanPageProps {
  currentRole: RoleType;
}

export const PanduanPage: React.FC<PanduanPageProps> = ({ currentRole }) => {
  const [activeTab, setActiveTab] = useState<'peran' | 'umum' | 'faq'>('peran');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-green">Pusat Bantuan & Panduan</span>
            <span className="badge badge-gray text-[11px]">v1.0 SDIT Ummul Quro</span>
          </div>
          <h1 className="page-title">Panduan Penggunaan Sistem</h1>
          <p className="text-sm text-muted mt-1">
            Petunjuk operasional, alur kerja, dan prinsip etika skrining hambatan belajar dengan metode Certainty Factor.
          </p>
        </div>
      </div>

      {/* Banner Prinsip Penting & Etika */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 text-amber-900 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 rounded-xl text-amber-700 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="space-y-1 text-sm">
            <p className="font-bold text-amber-950">Prinsip Etika & Batasan Sistem Penting:</p>
            <ul className="list-disc list-inside space-y-0.5 text-xs sm:text-sm text-amber-800">
              <li>Sistem ini adalah <strong>alat bantu identifikasi dini (skrining)</strong>, bukan vonis medis, psikologis, atau label permanen pada anak.</li>
              <li>Nilai Certainty Factor (CF) menunjukkan <strong>tingkat keyakinan sistem</strong> berbasis kecocokan pola observasi, bukan kebenaran mutlak.</li>
              <li>Data anak bersifat <strong>sangat rahasia</strong> dan dilindungi privasi ketat. Akses terbatas sesuai penugasan kelas dan tupoksi.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tabs Navigasi */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        <button
          onClick={() => setActiveTab('peran')}
          className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
            activeTab === 'peran'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-surface text-ink hover:bg-page border border-border'
          }`}
        >
          📘 Panduan Berdasarkan Peran ({currentRole === 'bk' ? 'Guru BK' : currentRole === 'wali' ? 'Wali Kelas' : 'Admin'})
        </button>
        <button
          onClick={() => setActiveTab('umum')}
          className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
            activeTab === 'umum'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-surface text-ink hover:bg-page border border-border'
          }`}
        >
          🧩 Alur Skrining & Rumus CF
        </button>
        <button
          onClick={() => setActiveTab('faq')}
          className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
            activeTab === 'faq'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-surface text-ink hover:bg-page border border-border'
          }`}
        >
          ❓ Tanya Jawab (FAQ) & Bantuan
        </button>
      </div>

      {/* Content Tab 1: Panduan Berdasarkan Peran */}
      {activeTab === 'peran' && (
        <div className="space-y-6">
          {/* Guru BK */}
          {currentRole === 'bk' && (
            <div className="space-y-4">
              <div className="card border-primary/30 bg-primary-light/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm">
                    BK
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-ink">Peran Guru Bimbingan Konseling (BK)</h2>
                    <p className="text-xs text-muted">Tanggung jawab utama: Tinjau observasi, eksekusi skrining komprehensif, dan rancang intervensi edukatif.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card space-y-3">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-primary-light flex items-center justify-center text-xs text-primary-dark">1</span>
                    Review Observasi dari Wali Kelas
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Periksa menu <strong>Dashboard BK</strong> atau <strong>Daftar Siswa</strong> untuk melihat catatan perilaku & indikator yang diajukan oleh wali kelas dengan status <em>Perlu Review</em>.
                  </p>
                </div>

                <div className="card space-y-3">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-primary-light flex items-center justify-center text-xs text-primary-dark">2</span>
                    Lakukan Skrining Tambahan / Komprehensif
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Gunakan menu <strong>Skrining Baru</strong>. Anda dapat melengkapi observasi klinis profesional pada 4 area (Literasi, Perhatian, Matematika, Sosial-Emosional) secara objektif.
                  </p>
                </div>

                <div className="card space-y-3">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-primary-light flex items-center justify-center text-xs text-primary-dark">3</span>
                    Analisis Hasil Certainty Factor (CF)
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Periksa indikasi hambatan, persentase CF gabungan, indikator pendukung, dan peringatan jika data belum cukup (misal terdapat banyak opsi "Belum diamati").
                  </p>
                </div>

                <div className="card space-y-3">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-primary-light flex items-center justify-center text-xs text-primary-dark">4</span>
                    Dokumentasi Tindak Lanjut & Laporan
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Masuk ke menu <strong>Tindak Lanjut</strong> untuk mencatat program remedial, konsultasi orang tua, atau pendampingan khusus. Ekspor ringkasan agregat di menu <strong>Laporan Agregat</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Wali Kelas */}
          {currentRole === 'wali' && (
            <div className="space-y-4">
              <div className="card border-accent/40 bg-accent-light/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-accent text-white flex items-center justify-center font-bold text-sm">
                    WK
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-ink">Peran Wali Kelas</h2>
                    <p className="text-xs text-muted">Tanggung jawab utama: Mengamati perilaku belajar saat KBM harian dan mencatat indikator objektif kelas yang diampu.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card space-y-3">
                  <div className="flex items-center gap-2 text-accent font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-accent-light flex items-center justify-center text-xs text-accent">1</span>
                    Cek Siswa di Bawah Kewenangan Kelas
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Buka <strong>Dashboard Wali Kelas</strong> atau <strong>Daftar Siswa</strong>. Wali Kelas hanya memiliki akses terhadap siswa di rombongan belajar kelas yang ditugaskan.
                  </p>
                </div>

                <div className="card space-y-3">
                  <div className="flex items-center gap-2 text-accent font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-accent-light flex items-center justify-center text-xs text-accent">2</span>
                    Input Observasi Skrining
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Klik <strong>Skrining Baru</strong> atau tombol <em>Isi Observasi</em> pada siswa. Berikan penilaian frekuensi kejadian (Tidak Pernah s/d Selalu). Jika belum sempat mengamati, pilih <em>Belum diamati / Tidak cukup data</em>.
                  </p>
                </div>

                <div className="card space-y-3">
                  <div className="flex items-center gap-2 text-accent font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-accent-light flex items-center justify-center text-xs text-accent">3</span>
                    Kirim & Ajukan ke Guru BK
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Setelah observasi selesai diisi, hasil awal akan terkirim dan ditandai sebagai kasus yang perlu ditelaah lebih lanjut oleh Guru BK sekolah.
                  </p>
                </div>

                <div className="card space-y-3">
                  <div className="flex items-center gap-2 text-accent font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-accent-light flex items-center justify-center text-xs text-accent">4</span>
                    Kolaborasi Tindak Lanjut di Kelas
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Pantau rekomendasi strategi pembelajaran di menu <strong>Tindak Lanjut</strong> untuk diterapkan di kelas, seperti penyesuaian posisi duduk atau instruksi bertahap.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Admin */}
          {currentRole === 'admin' && (
            <div className="space-y-4">
              <div className="card border-blue-200 bg-blue-50/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-info text-white flex items-center justify-center font-bold text-sm">
                    ADM
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-ink">Peran Administrator Sistem</h2>
                    <p className="text-xs text-muted">Tanggung jawab utama: Tata kelola basis pengetahuan (rule CF), audit trail, dan manajemen akun pengguna.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card space-y-3">
                  <div className="flex items-center gap-2 text-info font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs text-info">1</span>
                    Basis Pengetahuan & Bobot Pakar (MB & MD)
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Akses menu <strong>Basis Pengetahuan</strong> untuk meninjau kategori hipotesis (H01-H04) serta indikator observasi. Pastikan nilai Measure of Increased Belief (MB) dan Disbelief (MD) telah disetujui reviewer pakar.
                  </p>
                </div>

                <div className="card space-y-3">
                  <div className="flex items-center gap-2 text-info font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs text-info">2</span>
                    Pemantauan Audit Trail & Log Keamanan
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Di <strong>Dashboard Admin</strong>, pantau rekam jejak setiap aksi penting (login, simpan skrining, update basis data) demi kepatuhan privasi data siswa sensitif.
                  </p>
                </div>

                <div className="card space-y-3">
                  <div className="flex items-center gap-2 text-info font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs text-info">3</span>
                    Daftar Siswa & Sinkronisasi Kelas
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Tinjau data siswa seluruh kelas di menu <strong>Daftar Siswa</strong> untuk memastikan status skrining ter-update dan siap integrasi API backend.
                  </p>
                </div>

                <div className="card space-y-3">
                  <div className="flex items-center gap-2 text-info font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs text-info">4</span>
                    Laporan Agregat Statistik
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Akses menu <strong>Laporan Agregat</strong> untuk rekapitulasi data tingkat sekolah tanpa menampilkan data identitas anak yang berisiko pelanggaran privasi.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Ringkasan Hak Akses Antar Peran */}
          <div className="card">
            <h3 className="section-title mb-3">Tabel Matriks Akses Fitur Berdasarkan Peran</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-page border-b border-border text-muted uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Fitur / Halaman</th>
                    <th className="py-2.5 px-3 text-center">Guru BK</th>
                    <th className="py-2.5 px-3 text-center">Wali Kelas</th>
                    <th className="py-2.5 px-3 text-center">Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-ink">Dashboard Utama</td>
                    <td className="py-2.5 px-3 text-center text-primary font-bold">✓ (Kasus Sekolah)</td>
                    <td className="py-2.5 px-3 text-center text-accent font-bold">✓ (Siswa Kelas)</td>
                    <td className="py-2.5 px-3 text-center text-info font-bold">✓ (Audit & Sistem)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-ink">Skrining Baru (Input Observasi)</td>
                    <td className="py-2.5 px-3 text-center text-primary font-bold">✓</td>
                    <td className="py-2.5 px-3 text-center text-accent font-bold">✓</td>
                    <td className="py-2.5 px-3 text-center text-muted">—</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-ink">Daftar Siswa</td>
                    <td className="py-2.5 px-3 text-center text-primary font-bold">✓ (Semua Kelas)</td>
                    <td className="py-2.5 px-3 text-center text-accent font-bold">✓ (Kelas Diampu)</td>
                    <td className="py-2.5 px-3 text-center text-info font-bold">✓ (Semua Kelas)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-ink">Tindak Lanjut & Intervensi</td>
                    <td className="py-2.5 px-3 text-center text-primary font-bold">✓</td>
                    <td className="py-2.5 px-3 text-center text-accent font-bold">✓</td>
                    <td className="py-2.5 px-3 text-center text-muted">—</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-ink">Basis Pengetahuan (Rules CF)</td>
                    <td className="py-2.5 px-3 text-center text-muted">—</td>
                    <td className="py-2.5 px-3 text-center text-muted">—</td>
                    <td className="py-2.5 px-3 text-center text-info font-bold">✓ (Penuh)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-ink">Laporan Agregat Sekolah</td>
                    <td className="py-2.5 px-3 text-center text-primary font-bold">✓</td>
                    <td className="py-2.5 px-3 text-center text-muted">—</td>
                    <td className="py-2.5 px-3 text-center text-info font-bold">✓</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-ink">Panduan Penggunaan Sistem</td>
                    <td className="py-2.5 px-3 text-center text-primary font-bold">✓</td>
                    <td className="py-2.5 px-3 text-center text-accent font-bold">✓</td>
                    <td className="py-2.5 px-3 text-center text-info font-bold">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Content Tab 2: Skrining & Rumus CF */}
      {activeTab === 'umum' && (
        <div className="space-y-6">
          <div className="card space-y-4">
            <h2 className="section-title">Alur 5 Langkah Skrining Certainty Factor</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-center">
              <div className="p-3 bg-page rounded-xl border border-border">
                <div className="w-7 h-7 mx-auto rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center mb-2">1</div>
                <p className="font-semibold text-xs text-ink">Pilih Siswa</p>
                <p className="text-[11px] text-muted mt-1">Pilih siswa aktif yang menjadi target pengamatan</p>
              </div>
              <div className="p-3 bg-page rounded-xl border border-border">
                <div className="w-7 h-7 mx-auto rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center mb-2">2</div>
                <p className="font-semibold text-xs text-ink">Isi Indikator</p>
                <p className="text-[11px] text-muted mt-1">Jawab skala frekuensi pada 4 kategori hambatan</p>
              </div>
              <div className="p-3 bg-page rounded-xl border border-border">
                <div className="w-7 h-7 mx-auto rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center mb-2">3</div>
                <p className="font-semibold text-xs text-ink">Hitung CF</p>
                <p className="text-[11px] text-muted mt-1">Sistem mengkombinasikan CF Pakar × CF Pengguna</p>
              </div>
              <div className="p-3 bg-page rounded-xl border border-border">
                <div className="w-7 h-7 mx-auto rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center mb-2">4</div>
                <p className="font-semibold text-xs text-ink">Review Hasil</p>
                <p className="text-[11px] text-muted mt-1">Cek indikasi pendukung dan kecukupan data</p>
              </div>
              <div className="p-3 bg-page rounded-xl border border-border">
                <div className="w-7 h-7 mx-auto rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center mb-2">5</div>
                <p className="font-semibold text-xs text-ink">Tindak Lanjut</p>
                <p className="text-[11px] text-muted mt-1">Catat intervensi edukatif & simpan ke sistem</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card space-y-3">
              <h3 className="section-title text-base">Skala Jawaban Observasi Pengguna</h3>
              <p className="text-xs text-muted">Setiap pilihan memiliki bobot keyakinan pengguna (CF User):</p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 bg-page rounded-lg border border-border">
                  <span className="font-medium text-ink">Tidak Pernah</span>
                  <span className="font-mono font-semibold text-primary">0.0 (0%)</span>
                </div>
                <div className="flex justify-between p-2 bg-page rounded-lg border border-border">
                  <span className="font-medium text-ink">Jarang (1–2× / minggu)</span>
                  <span className="font-mono font-semibold text-primary">0.25 (25%)</span>
                </div>
                <div className="flex justify-between p-2 bg-page rounded-lg border border-border">
                  <span className="font-medium text-ink">Kadang (3–4× / minggu)</span>
                  <span className="font-mono font-semibold text-primary">0.50 (50%)</span>
                </div>
                <div className="flex justify-between p-2 bg-page rounded-lg border border-border">
                  <span className="font-medium text-ink">Sering (hampir setiap hari)</span>
                  <span className="font-mono font-semibold text-primary">0.75 (75%)</span>
                </div>
                <div className="flex justify-between p-2 bg-page rounded-lg border border-border">
                  <span className="font-medium text-ink">Selalu</span>
                  <span className="font-mono font-semibold text-primary">1.00 (100%)</span>
                </div>
                <div className="flex justify-between p-2 bg-amber-50 rounded-lg border border-amber-200 text-amber-900">
                  <span className="font-medium">Belum diamati / Tidak cukup data</span>
                  <span className="font-mono font-bold">null (Data Kurang)</span>
                </div>
              </div>
            </div>

            <div className="card space-y-3">
              <h3 className="section-title text-base">Rumus Certainty Factor (CF)</h3>
              <p className="text-xs text-muted">Kalkulasi menggunakan standar metode Certainty Factor:</p>
              <div className="p-3 bg-page rounded-xl border border-border text-xs space-y-2 font-mono">
                <p className="text-primary font-semibold">1. CF Pakar (Rule):</p>
                <p className="text-ink pl-3">CF_pakar = MB - MD</p>
                <p className="text-primary font-semibold">2. CF Tunggal Indikator:</p>
                <p className="text-ink pl-3">CF(H, E) = CF_pakar × CF_user</p>
                <p className="text-primary font-semibold">3. CF Kombinasi Majemuk:</p>
                <p className="text-ink pl-3">CF_combine = CF1 + CF2 × (1 - CF1)</p>
              </div>
              <p className="text-[11px] text-muted italic">
                *Jika indikator dijawab "Belum diamati" melebihi ambang batas, sistem akan menampilkan badge <strong>Data Belum Cukup</strong> agar tidak menghasilkan kesimpulan prematur.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content Tab 3: FAQ */}
      {activeTab === 'faq' && (
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Pertanyaan yang Sering Diajukan (FAQ)</h2>
            <div className="w-64">
              <input
                type="text"
                placeholder="Cari pertanyaan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input text-xs py-1.5"
              />
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'Apakah hasil dari sistem ini dapat dijadikan rujukan diagnosis klinis?',
                a: 'Tidak. Sistem ini hanya instrumen skrining dini di lingkungan sekolah SDIT Ummul Quro Bogor. Hasilnya berfungsi sebagai data pemantik untuk koordinasi Guru BK, Wali Kelas, dan pertimbangan rujukan profesional luar jika diperlukan.',
              },
              {
                q: 'Apa yang harus dilakukan jika ada indikator yang belum pernah saya amati di kelas?',
                a: 'Pilih opsi "Belum diamati / Tidak cukup data". Jangan menebak-nebak jawaban karena akan mendistorsi akurasi nilai Certainty Factor.',
              },
              {
                q: 'Mengapa Wali Kelas tidak dapat melihat data siswa dari kelas lain?',
                a: 'Prinsip perlindungan data anak mengharuskan minimisasi akses. Wali Kelas hanya memiliki hak akses observasi terhadap siswa di kelas asuhannya masing-masing.',
              },
              {
                q: 'Bagaimana jika skor CF menunjukkan indikasi di atas 75%?',
                a: 'Guru BK akan menjadwalkan observasi mendalam lanjutan, berdiskusi dengan wali kelas, dan mengagendakan sesi konsultasi edukatif bersama orang tua siswa untuk merancang pendampingan belajar yang nyaman bagi anak.',
              },
              {
                q: 'Apakah data skrining ini dapat dicetak untuk laporan?',
                a: 'Ya, hasil skrining dan laporan agregat dapat dicetak atau disimpan ke PDF dengan format rapi melalui tombol cetak/ekspor di halaman terkait.',
              },
            ]
              .filter((f) => f.q.toLowerCase().includes(searchTerm.toLowerCase()) || f.a.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((item, idx) => (
                <div key={idx} className="p-4 bg-page rounded-xl border border-border space-y-1.5">
                  <p className="text-sm font-bold text-ink flex items-center gap-2">
                    <span className="text-primary font-bold">Q:</span> {item.q}
                  </p>
                  <p className="text-xs text-muted leading-relaxed pl-5">
                    <span className="font-semibold text-primary-dark">A:</span> {item.a}
                  </p>
                </div>
              ))}
          </div>

          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted">
            <span>Butuh bantuan teknis lebih lanjut? Hubungi Tim IT SDIT Ummul Quro Bogor.</span>
            <span className="font-semibold text-primary">it-support@sdit-uq.sch.id</span>
          </div>
        </div>
      )}
    </div>
  );
};
