# API SPEC — Konseptual

Kontrak berikut hanya untuk tahap backend mendatang. Tidak ada endpoint nyata pada fase frontend-only. Jika dipilih Laravel + Blade monolitik, route/controller web dapat menggantikan sebagian REST API.

## 1. Prinsip
- JSON untuk API.
- Autentikasi dan authorization harus diverifikasi di server.
- Cakupan kelas/kasus dicek untuk setiap permintaan.
- Validasi server, rate limiting, CSRF/session security, pagination, audit, dan error format konsisten.
- Hindari PII dalam URL dan log.
- Tidak boleh ada endpoint publik untuk mencari data siswa.

## 2. Endpoint konseptual
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- `GET /classes/mine`
- `GET /classes/{classId}/students` — hanya cakupan yang diizinkan.
- `GET /students/{studentId}` — data minimum sesuai role.
- `POST /screenings` — membuat sesi skrining.
- `POST /screenings/{id}/answers` — menyimpan jawaban.
- `POST /screenings/{id}/calculate` — menghitung CF menggunakan versi yang disetujui.
- `GET /screenings/{id}/result` — hasil sesuai otorisasi.
- `POST /screenings/{id}/review` — review manusia.
- `POST /screenings/{id}/follow-ups` — tindak lanjut.
- `GET|POST /admin/indicators`
- `GET|POST /admin/hypotheses`
- `GET|POST /admin/cf-rules`
- `POST /admin/cf-rules/{id}/validate`
- `POST /admin/cf-rules/{id}/publish`
- `GET /admin/audit-logs`
- `GET /reports/aggregate` — data agregat sesuai izin.

Path dan method final perlu mengikuti arsitektur dan kebijakan sekolah.

## 3. Contoh respons konseptual
```json
{
  "screening_reference": "DEMO-001",
  "status": "needs_human_review",
  "result_label": "Indikasi awal untuk ditinjau",
  "supporting_indicators": ["IND-DEMO-01"],
  "data_limitations": ["Sebagian indikator belum diamati"],
  "follow_up_guidance": "Tinjau observasi bersama Guru BK sesuai prosedur sekolah.",
  "disclaimer": "Ini bukan diagnosis medis atau psikologis."
}
```
Contoh ini adalah kontrak UI, bukan hasil siswa nyata atau basis pengetahuan tervalidasi.

## 4. Error
- `400` payload tidak valid.
- `401` belum login.
- `403` akses tidak diizinkan.
- `404` tidak ditemukan.
- `409` konflik versi/status.
- `422` validasi bisnis gagal.
- `429` terlalu banyak permintaan.
- `500` error server generik.

## 5. Keamanan
- Cegah IDOR dengan authorization berbasis resource.
- Terapkan session timeout, CSRF, secure cookies, rate limit, dan audit.
- Jangan mengekspos data siswa pada error.
- Ekspor laporan memerlukan izin dan pencatatan.
