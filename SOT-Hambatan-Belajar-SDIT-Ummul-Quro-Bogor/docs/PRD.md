# PRD — Product Requirements Document

## 1. Ringkasan
Sistem Pakar Diagnosa Dini Hambatan Belajar Siswa Berbasis Web menggunakan metode Certainty Factor (CF), studi kasus SDIT Ummul Quro Bogor, dirancang sebagai alat bantu untuk menata observasi pembelajaran dan membantu tenaga sekolah menentukan tindak lanjut awal yang sesuai.

Aplikasi digunakan oleh Admin, Guru BK, dan Wali Kelas. Sistem tidak menggantikan evaluasi profesional, keputusan sekolah, komunikasi dengan orang tua/wali, atau pemeriksaan oleh tenaga ahli.

## 2. Tujuan
- Membantu pencatatan observasi terkait kesulitan belajar secara terstruktur.
- Menyediakan indikasi awal berdasarkan basis pengetahuan dan bobot CF yang telah ditinjau pakar.
- Menampilkan alasan yang mendasari hasil agar tidak menjadi “black box”.
- Membantu Guru BK dan Wali Kelas merencanakan observasi/tindak lanjut edukatif.
- Membantu Admin mengelola pengguna, kategori, indikator, basis pengetahuan, dan audit sesuai kewenangan.

## 3. Pengguna dan peran
- **Admin:** mengelola akun/role, kategori, indikator, basis pengetahuan, konfigurasi dan audit. Tidak otomatis berwenang melihat seluruh catatan sensitif jika tidak diperlukan.
- **Guru BK:** meninjau kasus yang ditugaskan/diizinkan, menjalankan atau memvalidasi skrining, menulis catatan tindak lanjut, dan memantau progres.
- **Wali Kelas:** mencatat observasi belajar yang relevan untuk siswa di kelas yang menjadi tanggung jawabnya, melihat tindak lanjut yang diizinkan, dan berkolaborasi dengan Guru BK.
- **Siswa/orang tua:** bukan pengguna langsung pada MVP kecuali diputuskan secara eksplisit setelah penilaian privasi dan kebutuhan.

## 4. Scope MVP
### Termasuk
- Landing/login internal.
- Dashboard sesuai peran.
- Daftar siswa dengan akses terbatas dan data demo pada prototipe.
- Form observasi indikator hambatan belajar.
- Ringkasan hasil indikatif CF dengan penjelasan faktor pendukung, batasan, dan rekomendasi tindak lanjut edukatif.
- Riwayat skrining dan status tindak lanjut sesuai hak akses.
- Pengelolaan indikator, kategori, aturan, dan bobot CF.
- Laporan agregat yang tidak mengungkap data siswa yang tidak perlu.
- Audit log untuk perubahan basis pengetahuan dan akses/tindakan penting.
- Responsive desktop/tablet/mobile.

### Tidak termasuk kecuali disetujui
- Diagnosis medis/psikologis atau penetapan gangguan belajar.
- Penilaian otomatis untuk memberi label permanen, menentukan kelulusan, hukuman, atau penempatan siswa.
- Prediksi akademik berisiko tinggi, ranking siswa, atau perbandingan publik antar-siswa.
- Pengumpulan data kesehatan/keluarga yang tidak diperlukan.
- Integrasi dengan sistem akademik eksternal, WhatsApp, atau aplikasi orang tua.
- AI generatif yang membuat kesimpulan bebas di luar basis pengetahuan terverifikasi.

## 5. Kebutuhan fungsional
- FR-01: Pengguna internal dapat login melalui mekanisme yang aman pada fase backend.
- FR-02: Dashboard dan tindakan disesuaikan dengan role.
- FR-03: Wali Kelas dapat melihat hanya siswa/kelas yang menjadi kewenangannya.
- FR-04: Guru BK dapat melihat kasus sesuai penugasan dan kebijakan sekolah.
- FR-05: Pengguna berwenang dapat mengisi observasi dengan indikator yang jelas, terukur, dan tidak menghakimi.
- FR-06: Sistem menghitung CF berdasarkan formula dan bobot yang disetujui.
- FR-07: Hasil memuat faktor pendukung, keterbatasan data, tanggal, versi basis pengetahuan, dan saran tindak lanjut.
- FR-08: Jika data tidak cukup atau indikator bertentangan, sistem menyatakan hasil belum cukup untuk menyimpulkan.
- FR-09: Pengguna berwenang dapat mencatat tindak lanjut dan status review.
- FR-10: Admin dapat mengelola indikator dan aturan dengan status draft/review/approved/active.
- FR-11: Perubahan basis pengetahuan tercatat dalam audit trail dan versi.
- FR-12: Laporan agregat meminimalkan risiko identifikasi siswa.
- FR-13: Semua formulir menyediakan validasi, loading, empty, success, dan error states.

## 6. Kebutuhan nonfungsional
- Privasi dan perlindungan data anak menjadi persyaratan utama.
- Terapkan least privilege, autentikasi aman, session security, CSRF protection, validasi server, dan audit.
- Jangan menyimpan data berlebih; tetapkan retensi/penghapusan sebelum produksi.
- Gunakan bahasa netral, non-stigmatisasi, dan berorientasi dukungan.
- UI dapat digunakan dengan keyboard, responsif, serta memiliki kontras dan fokus yang jelas.
- Hasil harus dapat dijelaskan dan ditinjau manusia.
- Data DEMO wajib fiktif.
- Kepatuhan hukum dan kebijakan sekolah harus ditinjau pihak yang berwenang sebelum peluncuran.

## 7. Indikator keberhasilan
- Guru dapat mengisi observasi tanpa kebingungan.
- Hasil CF dapat ditelusuri ke indikator, nilai MB/MD atau bobot yang dipakai, dan versi aturan.
- Akses lintas kelas/peran ditolak secara benar.
- Tindak lanjut dicatat dan ditinjau oleh personel berwenang.
- Tidak ada label permanen atau klaim diagnosis profesional otomatis.
- Uji validasi dilakukan dengan dataset yang disetujui pakar pendidikan/psikologi yang relevan.

## 8. Keputusan terbuka
- Definisi operasional “hambatan belajar” dan kategori yang masuk cakupan.
- Siapa pakar yang mengesahkan indikator, MB/MD, dan aturan CF.
- Apakah semua Wali Kelas boleh membuat skrining atau hanya observasi.
- Apakah orang tua/wali akan menerima laporan dan melalui mekanisme apa.
- Kebijakan penyimpanan, retensi, ekspor, dan penghapusan data siswa.
- Apakah ada batasan per kelas/jenjang atau dukungan untuk seluruh sekolah.
