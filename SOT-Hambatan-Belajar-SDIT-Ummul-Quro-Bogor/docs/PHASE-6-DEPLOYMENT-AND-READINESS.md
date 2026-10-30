# DOKUMEN DEPLOYMENT DAN PRODUCTION READINESS (PHASE 6)
**Sistem Pakar Diagnosa Dini Hambatan Belajar Siswa Berbasis Web**  
*Studi Kasus: SDIT Ummul Quro Bogor*  
*Status: Phase 6 Deployment Readiness Passed*  
*Tanggal: 30 Oktober 2026*  

---

## 1. Ringkasan Eksekutif

Sesuai dokumen acuan `docs/IMPLEMENTATION-PLAN.md` bagian **Phase 6 — Deployment**, seluruh persiapan kesiapan rilis produksi telah berhasil diimplementasikan:
1. **Production Environment Blueprint**: Template konfigurasi `.env.production.example` dengan penegakan HTTPS, cookie terenkripsi, level log warning/error, dan secret management.
2. **Otomatisasi Backup Database**: Perintah CLI `php artisan sipakar:backup-db` dengan retensi otomatis 30 hari di `backend/storage/backups/`.
3. **Automated Smoke Test Deployment**: Perintah CLI `php artisan sipakar:smoke-test` untuk validasi konektivitas DB, akun default, basis pengetahuan aktif, data referensi kelas/siswa, dan integritas audit trail.
4. **Optimasi Frontend Production**: Asset build Vite terkompilasi optimal (Vite + Tailwind CSS + TypeScript) tanpa warning maupun error.

---

## 2. Checklists Kesiapan Produksi (Production Readiness)

| Komponen | Spesifikasi & Tindakan | Status |
|---|---|---|
| **Secret Management** | `APP_KEY` digenerate di server target, tidak pernah dikomit ke repositori. File `.env` diproteksi chmod 600. | **SIAP** |
| **Enkripsi & HTTPS** | `APP_DEBUG=false`, `SESSION_SECURE_COOKIE=true`, `SESSION_ENCRYPT=true`. Semua transmisi via SSL TLS 1.3. | **SIAP** |
| **Audit Trail & Logging** | Log aplikasi menggunakan channel `daily` dengan retensi harian; Audit log aktivitas tersimpan otomatis di database. | **SIAP** |
| **Backup Terjadwal** | Scheduler Cron harian disiapkan via `sipakar:backup-db` dan retensi 30 hari otomatis. | **SIAP** |
| **Smoke Testing** | Script validasi sistem satu langkah via `sipakar:smoke-test` lulus 100%. | **LULUS** |

---

## 3. Hasil Deployment Smoke Test

```bash
=================================================
  SiPakar SDIT Ummul Quro - Deployment Smoke Test
=================================================
• Menguji Koneksi Database... [LULUS] OK (Terhubung)
• Menguji Pemeriksaan Akun Default... [LULUS] OK (Admin, BK, Wali Kelas terdaftar)
• Menguji Basis Pengetahuan Aktif... [LULUS] OK (Versi: v1.0-RC, Hipotesis: 4, Indikator: 15, Aturan CF: 15)
• Menguji Integritas Kelas & Siswa Demo... [LULUS] OK (36 Kelas, 108 Siswa)
• Menguji Audit Logging System... [LULUS] OK (Tamper-evident audit log aktif)

✓ SEMUA SMOKE TEST LULUS DENGAN SUKSES! Siap untuk Production.
```

---

## 4. Prosedur Operasional Deployment ke Server Produksi

### Langkah 1: Persiapan Server (Nginx / Apache + PHP 8.2+ & Node 18+)
```bash
git clone <repository_url> /var/www/sipakar
cd /var/www/sipakar/SOT-Hambatan-Belajar-SDIT-Ummul-Quro-Bogor/backend
cp .env.production.example .env
php artisan key:generate
composer install --no-dev --optimize-autoloader
php artisan migrate --force --seed
```

### Langkah 2: Build Frontend
```bash
cd /var/www/sipakar/SOT-Hambatan-Belajar-SDIT-Ummul-Quro-Bogor/frontend
npm install --production=false
npm run build
```

### Langkah 3: Setup Backup Cron Otomatis
Tambahkan pada crontab server (`crontab -e`):
```cron
# Backup otomatis setiap hari pukul 02:00 dini hari
0 2 * * * cd /var/www/sipakar/SOT-Hambatan-Belajar-SDIT-Ummul-Quro-Bogor/backend && php artisan sipakar:backup-db >> /var/log/sipakar_backup.log 2>&1
```

### Langkah 4: Smoke Test Pasca-Deploy
```bash
cd /var/www/sipakar/SOT-Hambatan-Belajar-SDIT-Ummul-Quro-Bogor/backend
php artisan sipakar:smoke-test
```

---

## 5. Prosedur Penanganan Insiden & Rollback
- **Rollback Database**: Bila terjadi inkonsistensi saat pembaruan, salin file snapshot dari `storage/backups/sipakar_backup_<timestamp>.sqlite` kembali ke `database/database.sqlite`.
- **Insiden Keamanan**: Token pengguna dapat direvoke serentak via `php artisan sanctum:prune-expired` atau mengosongkan tabel `personal_access_tokens`.