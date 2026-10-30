# UI GUIDELINES — SDIT Ummul Quro Bogor

## 1. Arah visual
Antarmuka profesional, tenang, hangat, aman, dan mendukung kolaborasi guru. Hindari visual yang menyerupai penilaian siswa atau papan peringkat. Gunakan bahasa yang mendukung, tidak menghakimi, dan tidak memberi label.

## 2. Warna
- Primary Green: `#15803D` — aksi utama dan identitas.
- Deep Green: `#166534` — hover/penekanan.
- Light Green: `#DCFCE7` — latar informasi positif.
- Primary Orange: `#F97316` — CTA sekunder, penanda perhatian, aksen.
- Light Orange: `#FFEDD5` — panel perhatian.
- Ink: `#1F2937` — teks utama.
- Muted: `#64748B` — teks sekunder.
- Surface: `#FFFFFF`.
- Page Background: `#F8FAFC`.
- Border: `#E2E8F0`.
- Info: `#0369A1`; Warning: `#B45309`; Danger: `#B91C1C`.

Warna bukan satu-satunya pembeda status. Gunakan teks, ikon berlabel, dan pola visual yang jelas. Pastikan kontras aksesibel.

## 3. Tipografi dan layout
- Sans-serif yang mudah dibaca, misalnya Inter atau system font.
- Body text 14–16px, label jelas, line-height nyaman.
- Sidebar untuk dashboard desktop; drawer/nav ringkas untuk mobile.
- Spacing konsisten kelipatan 4/8px; radius moderat; border halus.
- Hindari chart dekoratif atau KPI yang mendorong perbandingan siswa.

## 4. Halaman frontend
1. Login internal (demo, bukan autentikasi nyata).
2. Dashboard Admin: ringkasan konfigurasi, status basis pengetahuan, akun/role demo, aktivitas audit demo.
3. Dashboard Guru BK: kasus yang perlu review, observasi terbaru, tindak lanjut.
4. Dashboard Wali Kelas: kelas demo, daftar siswa fiktif, observasi yang perlu dilengkapi.
5. Daftar siswa: tabel dengan data fiktif dan akses peran simulasi.
6. Form observasi: indikator berbahasa netral, skala yang jelas, opsi “Belum diamati”.
7. Ringkasan skrining: indikasi CF, faktor pendukung, keterbatasan, saran tindak lanjut, disclaimer.
8. Basis pengetahuan: kategori, indikator, aturan, nilai MB/MD atau bobot sesuai metode yang disepakati.
9. Detail tindak lanjut dan riwayat.
10. Laporan agregat yang tidak membuka identitas siswa.

## 5. Komponen
- Button: primary green, secondary orange/outlined, text, danger.
- Form controls dengan label, helper text, required marker, error state.
- Badge: Draft, Perlu Review, Disetujui, Aktif, Belum Cukup Data.
- Table: search/filter, status jelas, mobile fallback.
- Observation card: indikator, periode, catatan faktual.
- Result panel: ringkasan indikatif, faktor pendukung, batasan, rekomendasi.
- Confirm dialog untuk aksi sensitif.
- Audit trail view untuk perubahan penting.

## 6. Aksesibilitas dan keselamatan
- Mobile-first, minimum viewport 320px tanpa horizontal overflow.
- Semua kontrol bisa diakses keyboard dan memiliki focus state.
- Label dan error form terhubung dengan input.
- Jangan menggunakan warna merah/oranye saja untuk menyebut siswa “bermasalah”.
- Hindari istilah seperti “anak gagal”, “malas”, atau label diagnosis definitif.
- Jangan tampilkan data siswa nyata pada prototype.
- Chart harus punya ringkasan teks dan tidak menampilkan ranking individu.

## 7. Batasan prototype
- Semua data siswa dan kasus harus fiktif serta berlabel DEMO.
- Tidak ada request ke backend/API.
- Interaksi boleh mengubah state lokal untuk demonstrasi, tetapi tidak boleh mengklaim data tersimpan permanen.
- Jangan membuat logo resmi atau aset sekolah tanpa file resmi.
