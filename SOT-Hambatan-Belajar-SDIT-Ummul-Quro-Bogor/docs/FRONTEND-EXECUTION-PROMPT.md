# FRONTEND EXECUTION PROMPT — Codex

Bertindak sebagai Senior Frontend Engineer, UI/UX Engineer, dan AI Engineer. Implementasikan hanya **Phase 1 — Frontend prototype** untuk Sistem Pakar Diagnosa Dini Hambatan Belajar Siswa Berbasis Web Menggunakan Certainty Factor, Studi Kasus SDIT Ummul Quro Bogor.

## Wajib dibaca
Baca `AGENTS.md` dan seluruh dokumen `docs/`. SOT adalah Source of Truth. Jika ada keputusan yang belum ditetapkan dan memengaruhi metodologi atau privasi, gunakan placeholder yang jelas atau minta klarifikasi.

## Stack
HTML5, Tailwind CSS, vanilla JavaScript. Vite opsional untuk dev server/build. Jangan gunakan backend PHP, Laravel server, database, API, atau autentikasi nyata.

## Halaman
1. Login internal demo.
2. Dashboard Admin.
3. Dashboard Guru BK.
4. Dashboard Wali Kelas.
5. Daftar siswa dengan identitas fiktif.
6. Form observasi indikator dengan opsi “Belum diamati”.
7. Review jawaban.
8. Ringkasan hasil skrining demo.
9. Daftar/detail tindak lanjut.
10. Pengelolaan indikator dan kategori demo.
11. Editor aturan CF demo dengan status draft/review/approved/active.
12. Laporan agregat demo dan audit log demo.

## Visual
- Dominasi hijau `#15803D` dan orange `#F97316`.
- Ikuti `docs/UI-GUIDELINES.md`.
- Profesional, tenang, tidak menghakimi, mendukung kerja guru.
- Jangan membuat logo resmi tanpa aset yang diberikan.
- Jangan menampilkan ranking atau label stigmatisasi siswa.

## Data dan metodologi
- Semua siswa, observasi, aturan, bobot, dan hasil harus fiktif dan diberi label DEMO.
- Jangan mengarang MB/MD, mapping jawaban, atau ambang CF seolah telah divalidasi.
- Hasil demo wajib menyebut bahwa itu simulasi, bukan diagnosis medis/psikologis.
- Jangan mengumpulkan data pribadi nyata.
- CRUD hanya mengubah state lokal dan tidak mengklaim tersimpan permanen.

## Kualitas
- Responsive mulai viewport 320px.
- Keyboard navigation, focus state, label dan error form.
- Tidak ada horizontal overflow.
- Semua tombol yang terlihat punya perilaku demo yang jelas.
- Sediakan loading, empty, validation error, success, no-data, needs-review, dan unauthorized states.
- Hindari dependensi dan kompleksitas yang tidak perlu.

## Workflow
1. Laporkan rencana singkat.
2. Implementasikan frontend saja.
3. Uji build dan alur utama.
4. Laporkan file, cara menjalankan, hasil tes, serta keputusan terbuka.
5. Berhenti sampai pemilik proyek menyetujui frontend. Jangan mulai backend/database.
