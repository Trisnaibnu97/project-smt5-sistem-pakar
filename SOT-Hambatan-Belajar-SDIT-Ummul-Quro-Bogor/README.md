# SOT — Sistem Pakar Diagnosa Dini Hambatan Belajar Siswa
**Studi Kasus: SDIT Ummul Quro Bogor**

Paket Source of Truth (SOT) untuk membantu merancang aplikasi web pendukung identifikasi awal hambatan belajar siswa menggunakan metode Certainty Factor (CF).

## Prinsip penting
- Aplikasi adalah alat bantu skrining/identifikasi dini, bukan alat diagnosis medis, psikologis, atau penetapan label pada siswa.
- Hasil CF menunjukkan tingkat keyakinan sistem berdasarkan aturan dan bobot pakar yang disepakati; bukan probabilitas klinis dan bukan kebenaran mutlak.
- Hasil harus ditinjau manusia yang berwenang dan dikomunikasikan secara hati-hati.
- Data anak merupakan data sensitif. Terapkan minimisasi data, akses berbasis peran, audit, retensi terbatas, dan prosedur perlindungan anak.
- Fase aktif pertama adalah **frontend prototype only**. Dilarang membangun database/backend/API nyata sebelum frontend disetujui eksplisit.

## Daftar dokumen
1. `docs/PRD.md` — tujuan, aktor, scope, dan kebutuhan produk.
2. `docs/USER-FLOW.md` — alur Admin, Guru BK, dan Wali Kelas.
3. `docs/UI-GUIDELINES.md` — desain UI/UX dan warna hijau-oranye.
4. `docs/BUSINESS-RULES.md` — hak akses, privasi, dan aturan bisnis.
5. `docs/CF-METHOD-SPEC.md` — spesifikasi Certainty Factor.
6. `docs/DATA-DICTIONARY.md` — data yang dibutuhkan dan prinsip minimisasi.
7. `docs/DATABASE-SPEC.md` — rancangan konseptual database, belum SQL final.
8. `docs/API-SPEC.md` — kontrak integrasi konseptual, belum implementasi.
9. `docs/IMPLEMENTATION-PLAN.md` — tahapan dan approval gates.
10. `AGENTS.md` — pagar pembatas untuk AI coding agent.
11. `docs/FRONTEND-EXECUTION-PROMPT.md` — prompt siap pakai untuk implementasi FE.
12. `docs/PREPARATION-CHECKLIST.md` — persiapan paralel saat fiksasi FE.

## Rekomendasi stack
- Fase frontend: React 18 + TypeScript + Tailwind CSS, dengan Vite sebagai dev server/build tool (dimigrasi dan disetujui pemilik proyek).
- Backend tahap lanjut: PHP 8.3+ dan Laravel REST API versi stabil.
- Database tahap lanjut: MySQL 8.0+ / InnoDB / utf8mb4.
- Arsitektur: Decoupled Vite SPA (React TS) + Laravel REST API.
- Tooling: Git, npm, Composer, dan Laragon / Docker untuk pengembangan lokal.


## Status awal
- Fase: Phase 1 — Frontend prototype only.
- Seluruh data contoh wajib fiktif dan diberi label DEMO.
- Jangan gunakan nama atau data siswa nyata dalam prototype.
