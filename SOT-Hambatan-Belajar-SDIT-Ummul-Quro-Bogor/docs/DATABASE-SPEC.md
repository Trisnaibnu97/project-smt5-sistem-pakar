# DATABASE SPEC — Konseptual

Dokumen ini bukan SQL final. Database hanya dibuat setelah frontend disetujui dan kebijakan data sekolah dikonfirmasi.

## 1. Konvensi
- MySQL 8.0+, InnoDB, `utf8mb4`.
- Foreign key dan unique constraint eksplisit.
- Timestamps dan status pada entitas yang perlu audit.
- Gunakan soft archive untuk indikator/aturan yang telah dipakai.
- Hindari menyimpan PII yang tidak diperlukan.
- Data produksi harus dipisahkan dari data demo.

## 2. Entitas kandidat
- `users`: akun staf, role, status.
- `classes`: kelas/rombel.
- `user_class_assignments`: cakupan kelas untuk Wali Kelas.
- `students`: ID internal/pseudonim, nama bila perlu, kelas, status.
- `indicator_categories`: kategori indikator.
- `indicators`: definisi operasional indikator dan status.
- `hypotheses`: kategori indikasi edukatif dan tindak lanjut.
- `cf_rules`: hubungan hipotesis dengan evidence/indikator, nilai pakar, versi, status, reviewer.
- `answer_scales`: skala jawaban yang disetujui.
- `answer_mappings`: mapping jawaban ke evidence CF.
- `screenings`: sesi skrining, pembuat, reviewer, versi metode/basis pengetahuan, status.
- `screening_answers`: jawaban dan status “belum diamati”.
- `screening_results`: nilai/hasil indikatif, penjelasan, keterbatasan.
- `screening_result_traces`: aturan dan evidence yang berkontribusi.
- `follow_ups`: tindak lanjut, penanggung jawab, status, tanggal review.
- `audit_logs`: aksi penting dan perubahan basis pengetahuan/akses.

## 3. Relasi utama
- `classes` 1:N `students`.
- `users` N:M `classes` melalui `user_class_assignments`.
- `indicator_categories` 1:N `indicators`.
- `hypotheses` 1:N `cf_rules`.
- `screenings` 1:N `screening_answers`.
- `screenings` 1:N `screening_results`.
- `screening_results` 1:N `screening_result_traces`.
- `screenings` 1:N `follow_ups`.

Relasi final mengikuti pilihan metodologi CF dan kebutuhan audit.

## 4. Integritas dan akses
- ID siswa dan data skrining tidak boleh dapat diakses hanya dengan menebak ID.
- Terapkan policy/authorization pada setiap akses ke siswa dan skrining.
- Riwayat harus mempertahankan versi metode dan aturan yang digunakan.
- Jangan menghapus hard-delete entitas yang diperlukan untuk audit tanpa kebijakan eksplisit.
- Indeks untuk kelas, status, waktu, foreign key, dan kode unik.
- Kebijakan ekspor dan retensi wajib ditentukan sebelum produksi.

## 5. Pertanyaan sebelum finalisasi
- Apakah data siswa akan diimpor atau dimasukkan manual?
- Apa ID minimum yang diperlukan?
- Apakah Guru BK melihat seluruh siswa atau hanya kasus yang ditugaskan?
- Berapa lama data skrining disimpan?
- Apakah orang tua/wali dapat meminta koreksi atau penghapusan?
- Apakah nilai CF dan trace lengkap perlu terlihat untuk semua role?
