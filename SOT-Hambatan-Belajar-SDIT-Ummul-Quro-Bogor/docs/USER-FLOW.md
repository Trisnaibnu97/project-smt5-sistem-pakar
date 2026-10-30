# USER FLOW

## 1. Admin
1. Login internal.
2. Melihat dashboard administrasi.
3. Mengelola akun dan role sesuai kebijakan.
4. Mengelola kategori indikator, indikator observasi, aturan CF, sumber/reviewer, dan status publikasi.
5. Menjalankan validasi kelengkapan dan preview dampak aturan.
6. Mengajukan basis pengetahuan untuk review pakar.
7. Mengaktifkan hanya versi yang disetujui.
8. Melihat audit log dan ringkasan sistem sesuai kewenangan.

## 2. Wali Kelas
1. Login.
2. Melihat kelas yang ditugaskan.
3. Memilih siswa yang berada dalam cakupan kewenangannya.
4. Mengisi observasi berdasarkan indikator yang konkret, waktu/konteks observasi, dan frekuensi bila diperlukan.
5. Meninjau kembali input.
6. Menyimpan observasi atau mengajukan skrining sesuai kebijakan sekolah.
7. Melihat ringkasan indikatif yang diizinkan dan arahan untuk koordinasi dengan Guru BK.
8. Mencatat tindak lanjut yang menjadi kewenangannya.

## 3. Guru BK
1. Login.
2. Melihat daftar kasus yang ditugaskan atau diizinkan.
3. Meninjau observasi dari Wali Kelas dan menambahkan observasi profesional yang sesuai kewenangan.
4. Menjalankan/meninjau skrining CF.
5. Membaca faktor pendukung, faktor yang belum cukup, dan keterbatasan hasil.
6. Memutuskan tindak lanjut edukatif: observasi lanjutan, strategi pembelajaran, diskusi internal, atau komunikasi dengan orang tua/wali sesuai prosedur sekolah.
7. Mencatat hasil review dan status tindak lanjut.
8. Memantau progres tanpa memberi label permanen pada siswa.

## 4. Alur skrining
1. Pilih siswa yang berwenang diakses.
2. Pilih konteks observasi dan rentang waktu.
3. Jawab indikator menggunakan skala yang didefinisikan oleh pakar, dengan opsi “Belum diamati/Tidak cukup data”.
4. Tinjau input.
5. Hitung CF menggunakan versi basis pengetahuan aktif.
6. Tampilkan hasil indikatif, indikator pendukung, tingkat kecukupan data, batasan, dan rekomendasi tindak lanjut.
7. Guru BK/tenaga berwenang meninjau hasil sebelum tindak lanjut penting.
8. Catat keputusan dan jadwal peninjauan jika dibutuhkan.

## 5. Kondisi alternatif
- Data kurang: jangan menghasilkan kesimpulan paksa; minta observasi tambahan.
- Indikator bertentangan: tampilkan sebagai keterbatasan, bukan menyembunyikannya.
- Tidak ada aturan cocok: tampilkan “Belum cukup informasi untuk memberi indikasi”.
- Siswa tidak berada dalam cakupan akses: tolak akses.
- Hasil berpotensi sensitif: jangan tampilkan pada dashboard agregat yang dapat mengidentifikasi siswa.
- Kasus membutuhkan penilaian ahli: sarankan konsultasi sesuai prosedur sekolah, tanpa membuat diagnosis.

## 6. Status UI wajib
- Loading, empty, success, validation error, server error.
- Draft/review/approved/active pada basis pengetahuan.
- Data belum cukup, tidak ada kecocokan, perlu review manusia, tindak lanjut berjalan, dan selesai.
- Session expired dan unauthorized.
