# AGENTS.md â€” Guardrails for AI Coding Agents

## Source of Truth
Baca `README.md` dan semua dokumen `docs/` sebelum mengubah project. Bila prompt bertentangan dengan SOT, berhenti dan minta klarifikasi.

## Fase aktif
**Phase 6 — Deployment & Production Readiness selesai (Semua Tahap Phase 0 - Phase 6 Selesai).**

## Larangan keras
- Jangan membuat backend, PHP/Laravel server logic, database, migration, schema SQL, API nyata, autentikasi nyata, atau koneksi jaringan sebelum frontend disetujui eksplisit.
- Jangan gunakan data siswa nyata. Semua contoh harus fiktif dan berlabel DEMO.
- Jangan mengarang nilai CF, MB/MD, skala, ambang, atau aturan seolah sudah disetujui pakar.
- Jangan menyebut hasil sebagai diagnosis medis/psikologis atau label permanen.
- Jangan membuat fitur ranking siswa atau keputusan otomatis berisiko tinggi.
- Jangan mengumpulkan data pribadi berlebih.
- Jangan mengubah scope, stack, atau SOT diam-diam.
- Jangan lanjut ke fase berikutnya tanpa approval eksplisit.

## Stack frontend
React 18 + TypeScript + Tailwind CSS (Vite dev server/build tool). Disetujui eksplisit oleh pemilik proyek pada Phase 2/3.

## Workflow
1. Nyatakan fase aktif dan acuan SOT.
2. Berikan rencana dan daftar file.
3. Implementasikan scope fase aktif saja.
4. Jalankan pemeriksaan build dan alur utama.
5. Laporkan hasil, cara menjalankan, keterbatasan, dan keputusan terbuka.
6. Berhenti pada approval gate.

## Definisi selesai Phase 1
- Semua halaman inti tersedia.
- Alur demo dapat dijalankan.
- Responsif mulai viewport 320px.
- Fokus keyboard, label form, dan error states tersedia.
- Data jelas fiktif.
- Tidak ada backend, database, API, atau data siswa nyata.
