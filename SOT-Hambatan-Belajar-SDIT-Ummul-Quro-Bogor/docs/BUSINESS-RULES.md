# BUSINESS RULES

## 1. Otorisasi
- Role MVP: `admin`, `guru_bk`, `wali_kelas`.
- Akses ditentukan oleh role dan cakupan penugasan (misalnya kelas atau kasus).
- Wali Kelas hanya dapat mengakses siswa dan catatan dalam kelas yang ditugaskan.
- Guru BK hanya mengakses kasus sesuai tanggung jawab dan kebijakan sekolah.
- Admin tidak otomatis membutuhkan akses penuh ke semua catatan sensitif; hak akses administratif dan akses konten harus dipisahkan bila memungkinkan.
- Otorisasi wajib di server, bukan hanya menyembunyikan menu.
- Akun internal tidak dapat dibuat melalui pendaftaran publik.

## 2. Penggunaan hasil
- CF adalah indikator dukungan keputusan, bukan diagnosis medis/psikologis.
- Hasil harus ditinjau manusia sebelum tindakan penting.
- Dilarang menggunakan hasil otomatis sebagai satu-satunya dasar untuk hukuman, kelulusan, penempatan, atau pelabelan permanen.
- Hasil ditulis dengan bahasa “indikasi awal”, “perlu observasi lebih lanjut”, atau “perlu ditinjau”.
- Jika data kurang, sistem harus menyatakan ketidakcukupan data.
- Tidak menampilkan peringkat siswa berdasarkan nilai CF.

## 3. Basis pengetahuan
- Setiap indikator dan aturan memiliki kode stabil, definisi operasional, sumber, reviewer, dan status.
- Status: draft → review → approved → active; perubahan aturan aktif menghasilkan versi baru.
- Aturan dan bobot hanya boleh diaktifkan setelah disetujui pakar yang ditunjuk sekolah.
- Data demo tidak boleh dianggap sebagai basis pengetahuan tervalidasi.
- Catat versi basis pengetahuan yang digunakan pada setiap skrining.

## 4. Privasi dan perlindungan anak
- Kumpulkan hanya data yang diperlukan untuk tujuan edukatif yang jelas.
- Jangan menaruh nama lengkap, NISN, alamat, nomor telepon, atau data sensitif siswa dalam mock data atau repository.
- Gunakan ID internal/alias pada prototype.
- Tentukan dasar pemrosesan, persetujuan/pemberitahuan orang tua/wali bila diwajibkan, retensi, koreksi, penghapusan, dan prosedur insiden bersama pihak sekolah yang berwenang.
- Batasi ekspor dan cetak laporan individual.
- Hindari menampilkan detail sensitif di notifikasi, URL, log, atau laporan agregat.
- Audit akses dan perubahan yang relevan.
- Kebijakan final harus ditinjau sesuai peraturan perlindungan data dan kebijakan sekolah yang berlaku.

## 5. Observasi
- Gunakan indikator yang dapat diamati, spesifik, kontekstual, dan tidak menghakimi.
- Bedakan “tidak muncul” dengan “belum diamati”.
- Catat konteks/waktu jika relevan; hindari inferensi dari satu kejadian.
- Jangan mengumpulkan informasi keluarga atau kesehatan kecuali diperlukan, berwenang, dan disetujui sesuai prosedur.
- Catatan subjektif harus dibedakan dari observasi faktual.

## 6. Audit dan pelaporan
- Catat aktor, waktu, aksi, objek, dan perubahan penting.
- Jangan log password, token, atau data sensitif.
- Laporan agregat menerapkan minimisasi data dan perlindungan terhadap identifikasi ulang.
- Jangan menyatakan keberhasilan/akurasi tanpa evaluasi terdokumentasi.
