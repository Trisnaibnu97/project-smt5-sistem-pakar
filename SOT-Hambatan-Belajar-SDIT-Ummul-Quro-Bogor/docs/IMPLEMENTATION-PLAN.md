# IMPLEMENTATION PLAN â€” Approval Gates

## Prinsip
Setiap fase harus ditinjau dan disetujui eksplisit. Agent tidak boleh melanjutkan fase berikutnya hanya karena fase sebelumnya selesai secara teknis.

## Phase 0 â€” Review SOT
- Tinjau tujuan, aktor, alur, scope, CF, privasi, dan UI.
- Putuskan pertanyaan terbuka yang memengaruhi desain.
**Gate:** SOT awal disetujui.

## Phase 1 â€” Frontend prototype only
- HTML5 + Tailwind CSS + vanilla JavaScript; Vite opsional.
- Buat login demo, dashboard per role, daftar siswa fiktif, form observasi, ringkasan hasil demo, basis pengetahuan demo, tindak lanjut, laporan agregat demo.
- Semua data fiktif dan diberi label DEMO.
- Interaksi lokal saja.
- Tidak ada backend PHP, database, SQL, API, autentikasi nyata, atau data siswa nyata.
**Gate:** pemilik menyetujui frontend secara eksplisit.

## Phase 2 â€” Validasi metodologi dan data
- Definisikan indikator operasional.
- Tentukan kategori indikasi yang tidak menghakimi.
- Tetapkan skala jawaban, mapping evidence, bobot MB/MD, formula kombinasi, ambang interpretasi, dan pakar reviewer.
- Susun dataset uji tanpa memakai data anak yang tidak berizin.
**Gate:** metodologi dan basis pengetahuan disetujui pihak sekolah/pakar (Dokumen: `docs/PHASE-2-METHODOLOGY-VALIDATION.md`).

## Phase 3 â€” Finalisasi arsitektur dan database
- Pilih Laravel + Blade atau frontend terpisah + Laravel REST API. (Terpilih: Decoupled Vite SPA + Laravel 11/12 REST API).
- Finalisasi ERD, kamus data, role policy, retensi, audit, dan strategi backup.
- Dokumen Blueprint: `docs/PHASE-3-ARCHITECTURE-AND-DATABASE.md`.
**Gate:** rancangan database dan privasi disetujui pemilik proyek sebelum membuat migration/schema.


## Phase 4 â€” Backend
- [x] Implementasikan auth dan authorization per role/cakupan (Sanctum + RBAC + Scope Isolation).
- [x] CRUD indikator, hipotesis, aturan CF, versi basis pengetahuan.
- [x] Engine CF, trace hasil sekuensial, review manusia, tindak lanjut, audit, laporan agregat.
- [x] Validasi server dan pengamanan.
- Dokumen Blueprint & Implementasi: `docs/PHASE-4-BACKEND-IMPLEMENTATION.md`.
**Gate:** tes backend lulus. (Status: **Passed** â€” 15 tests, 112 assertions, zero failure).

## Phase 5 â€” Integrasi dan QA
- [x] Integrasikan FE dengan backend via RESTful API Sanctum.
- [x] Uji akses lintas kelas (Anti-IDOR) dan akses lintas role.
- [x] Uji validasi input invalid, boundary check, dan kelengkapan data (<50% unanswered).
- [x] Uji transparansi kalkulasi CF, audit logging otomatis, dan privacy laporan agregat.
- [x] Automated QA Test Suite lulus (21 tests, 143 assertions, zero failure).
- Dokumen QA: `docs/PHASE-5-INTEGRATION-AND-QA.md`.
**Gate:** hasil QA dan review pengguna disetujui. (Status: **Passed**).

## Phase 6 â€” Deployment
- Konfigurasi environment, HTTPS, secret management, backup, monitoring, prosedur insiden, retensi, dan rollback.
- Jangan commit secret ke Git.
- Lakukan smoke test setelah deploy.

## Acceptance frontend (Approved by Owner - Phase 1 Gate Passed)
- [x] Tiga dashboard role dapat dipreview.
- [x] Form observasi dan alur skrining demo berjalan end-to-end.
- [x] Hasil memuat penjelasan, batasan, dan disclaimer.
- [x] Data demo fiktif dan tidak menampilkan identitas nyata.
- [x] UI responsif, keyboard-accessible, dan memiliki state UI utama.
- [x] Tidak ada backend/database/API sebelum approval.
- Status: **Disetujui Pemilik Proyek (Gate Phase 1 Passed)**. Melanjutkan ke Phase 2.

