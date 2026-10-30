# DOKUMEN IMPLEMENTASI BACKEND (PHASE 4)
**Sistem Pakar Diagnosa Dini Hambatan Belajar Siswa Berbasis Web**  
*Studi Kasus: SDIT Ummul Quro Bogor*  
*Status: Phase 4 Completed & All Tests Passed*  
*Tanggal: 28 Oktober 2026*  

---

## 1. Ringkasan Eksekutif

Sesuai dengan arahan pemilik proyek dan dokumen acuan SOT ([docs/IMPLEMENTATION-PLAN.md](file:///d:/project-programming/SOT-Hambatan-Belajar-SDIT-Ummul-Quro-Bogor/SOT-Hambatan-Belajar-SDIT-Ummul-Quro-Bogor/docs/IMPLEMENTATION-PLAN.md) & [docs/PHASE-3-ARCHITECTURE-AND-DATABASE.md](file:///d:/project-programming/SOT-Hambatan-Belajar-SDIT-Ummul-Quro-Bogor/SOT-Hambatan-Belajar-SDIT-Ummul-Quro-Bogor/docs/PHASE-3-ARCHITECTURE-AND-DATABASE.md)), seluruh komponen **Phase 4 — Backend** telah berhasil dibangun dan diuji secara komprehensif.

Semua pengujian unit dan fitur (15 tes, 112 assertions) **100% LULUS** tanpa ada kegagalan (*zero failure*).

---

## 2. Rincian Komponen Backend yang Diimplementasikan

### A. Database Migrations (14 Entitas Relasional)
1. `users` — Pengguna sistem terbagi atas 3 role (`admin`, `guru_bk`, `wali_kelas`).
2. `classes` — Rombongan belajar SDIT Ummul Quro (`grade_level`, `name`, `academic_year`).
3. `user_class_assignments` — Penugasan wali kelas untuk isolasi akses data siswa (anti-IDOR).
4. `students` — Siswa terpseudonim (data minimisasi edukatif, nama fiktif berlabel `[DEMO]`).
5. `kb_versions` — Versi basis pengetahuan (`draft`, `review`, `approved`, `active`, `archived`).
6. `hypotheses` — Kategori hipotesis edukatif (H01 s/d H04).
7. `indicators` — Indikator observasi perilaku teramati (I01 s/d I15).
8. `cf_rules` — Bobot pakar ($MB$, $MD$, $CF = MB - MD$).
9. `screenings` — Sesi skrining observasi belajar siswa.
10. `screening_answers` — Jawaban observasi per indikator beserta pemetaan $CF_{User}$.
11. `screening_results` — Hasil inferensi akhir per kategori hipotesis beserta tingkat indikasi.
12. `screening_result_traces` — Log jejak langkah kalkulasi inferensi berurutan (*step-by-step explainability*).
13. `follow_ups` — Rencana tindak lanjut edukatif (`observasi_lanjutan`, `diferensiasi_pembelajaran`, `diskusi_internal`, `rujukan_ahli`).
14. `audit_logs` — Pencatatan otomatis aktivitas penting sistem (keamanan dan audit).

### B. Certainty Factor Engine Service (`app/Services/CertaintyFactorEngine.php`)
- **Mapping Evidence**:
  - `tidak-pernah` $\rightarrow 0.00$
  - `jarang` $\rightarrow 0.25$
  - `kadang` $\rightarrow 0.50$
  - `sering` $\rightarrow 0.75$
  - `selalu` $\rightarrow 1.00$
  - `belum` $\rightarrow null$ (*dikeluarkan dari kalkulasi*)
- **Perhitungan Evidence**: $CF(E_i) = CF_{User}(E_i) \times CF_{Pakar}(H, E_i)$
- **Kombinasi Sekuensial**:
  $$CF_{combine} = CF_1 + CF_2 \times (1 - CF_1)$$
- **Completeness Check**: Jika persentase indikator terjawab $< 50\%$, status dikunci pada `'belum_cukup_data'`.
- **Ambang Batas**:
  - $< 0.25$: `'rendah'`
  - $0.25 - 0.54$: `'sedang'`
  - $\ge 0.55$: `'kuat'`
- **Auditability**: Merekam jejak kalkulasi lengkap ke tabel `screening_result_traces`.

### C. Autentikasi & Otorisasi Berbasis Role (RBAC)
- Autentikasi API berbasis token menggunakan **Laravel Sanctum**.
- Middleware `role:admin,guru_bk,wali_kelas` untuk melindungi endpoint administratif.
- **Isolasi Cakupan Kelas (Anti-IDOR)**:
  - Wali Kelas hanya dapat melihat siswa dan membuat skrining pada kelas yang ditugaskan kepadanya. Permintaan ke kelas lain langsung ditolak dengan status **403 Forbidden**.
  - Guru BK memiliki cakupan akses seluruh sekolah (*School-Wide Scope*).
  - Admin memiliki wewenang mengelola basis pengetahuan dan melihat jejak audit, tetapi dibatasi dari intervensi catatan skrining siswa tanpa wewenang.

### D. RESTful API Endpoints (`routes/api.php`)
- `POST /api/auth/login` & `POST /api/auth/logout` & `GET /api/auth/me`
- `GET /api/classes/mine` & `GET /api/classes/{id}/students`
- `GET /api/students/{id}`
- `GET /api/screenings` & `POST /api/screenings`
- `POST /api/screenings/{id}/answers`
- `POST /api/screenings/{id}/calculate`
- `GET /api/screenings/{id}/result`
- `POST /api/screenings/{id}/review`
- `POST /api/screenings/{id}/follow-ups`
- `GET /api/kb/active`
- `GET /api/admin/kb-versions` & `POST /api/admin/kb-versions`
- `POST /api/admin/kb-versions/{id}/activate`
- `POST /api/admin/hypotheses`, `POST /api/admin/indicators`, `POST /api/admin/cf-rules`
- `GET /api/admin/audit-logs`
- `GET /api/reports/aggregate`

---

## 3. Hasil Eksekusi Uji Otomatis (Test Suite)

```bash
   PASS  Tests\Unit\CertaintyFactorEngineTest
  ✓ tc01 dominant literacy strong cf                                       0.53s  
  ✓ tc02 dominant numeracy strong cf                                       0.08s  
  ✓ tc05 all never yields zero cf                                          0.07s  
  ✓ tc06 all unobserved yields insufficient data                           0.07s  
  ✓ tc07 under 50 percent answered yields insufficient data                0.06s  

   PASS  Tests\Unit\ExampleTest
  ✓ that true is true                                                      0.02s  

   PASS  Tests\Feature\AuthenticationAndAuthorizationTest
  ✓ user can login with valid credentials                                  0.21s  
  ✓ user cannot login with invalid credentials                             0.06s  
  ✓ unauthenticated request is rejected                                    0.08s  
  ✓ wali kelas can only access assigned classes                            0.07s  
  ✓ guru bk can access all classes                                         0.06s  
  ✓ wali kelas cannot perform admin actions                                0.06s  
  ✓ admin can view audit logs                                              0.08s  

   PASS  Tests\Feature\ExampleTest
  ✓ the application returns a successful response                          0.21s  

   PASS  Tests\Feature\ScreeningWorkflowApiTest
  ✓ complete screening workflow via api                                    0.19s  

  Tests:    15 passed (112 assertions)
  Duration: 2.20s
```

---

## 4. Cara Menjalankan Backend

Dari direktori root proyek:
1. Menjalankan pengujian otomatis backend:
   ```bash
   npm run backend:test
   ```
2. Menjalankan server backend lokal:
   ```bash
   npm run backend:serve
   ```
   *(Server REST API aktif di `http://127.0.0.1:8000`)*.
