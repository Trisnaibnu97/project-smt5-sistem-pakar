# PREPARATION CHECKLIST — Sambil Fiksasi Frontend

Persiapan berikut dapat dilakukan paralel tanpa membangun backend. Jangan masukkan data siswa nyata ke repository atau file demo.

## A. Definisi masalah dan cakupan
- [ ] Definisikan secara operasional apa yang dimaksud hambatan belajar untuk aplikasi ini.
- [ ] Tentukan jenjang/kelas yang menjadi cakupan MVP.
- [ ] Tentukan kategori indikasi yang edukatif, tidak stigmatisasi, dan bukan diagnosis profesional.
- [ ] Tentukan situasi yang harus dirujuk ke Guru BK atau tenaga ahli.

## B. Validasi indikator
Untuk setiap indikator:
- [ ] Kode unik.
- [ ] Nama dan deskripsi netral.
- [ ] Definisi perilaku yang dapat diamati.
- [ ] Konteks dan periode observasi.
- [ ] Skala jawaban termasuk “Belum diamati”.
- [ ] Sumber dan reviewer pakar.
- [ ] Batasan interpretasi.
- [ ] Status draft/review/approved.

## C. Validasi Certainty Factor
- [ ] Tentukan varian formula CF yang dipakai dan sumber metodologinya.
- [ ] Tentukan nilai MB/MD atau bobot pakar untuk setiap indikator-hipotesis.
- [ ] Tentukan mapping skala jawaban ke evidence CF.
- [ ] Tentukan ambang interpretasi hanya setelah disetujui pakar.
- [ ] Buat kasus uji positif, negatif, campuran, data kurang, dan indikator bertentangan.
- [ ] Minta review pakar yang relevan dan dokumentasikan persetujuan.
- [ ] Jangan meminta AI mengisi bobot berdasarkan tebakan.

## D. Tata kelola dan privasi
- [ ] Tentukan role dan cakupan kelas/kasus.
- [ ] Tetapkan siapa yang boleh melihat identitas dan hasil individual.
- [ ] Tentukan kebutuhan pemberitahuan/persetujuan orang tua/wali sesuai kebijakan dan aturan yang berlaku.
- [ ] Tetapkan retensi, koreksi, penghapusan, backup, dan prosedur insiden.
- [ ] Tentukan aturan ekspor/cetak laporan.
- [ ] Siapkan data demo fiktif terpisah dari data produksi.
- [ ] Minta peninjauan pihak sekolah yang berwenang atas tata kelola data anak.

## E. Proses operasional sekolah
- [ ] Tentukan siapa yang mengisi observasi dan kapan.
- [ ] Tentukan siapa yang meninjau hasil.
- [ ] Tentukan pilihan tindak lanjut edukatif dan statusnya.
- [ ] Tentukan mekanisme komunikasi dengan orang tua/wali.
- [ ] Tentukan cara mengoreksi observasi yang keliru.
- [ ] Pastikan hasil sistem bukan satu-satunya dasar keputusan penting.

## F. Aset dan konten UI
- [ ] Logo resmi sekolah bila boleh digunakan.
- [ ] Nama/gelar/jabatan staf hanya jika diperlukan dan disetujui.
- [ ] Warna dan panduan brand resmi jika tersedia.
- [ ] Istilah yang dipakai sekolah untuk indikator dan tindak lanjut.
- [ ] Jangan mengarang alamat, kontak, atau klaim institusi.

## G. Keputusan teknis
- [ ] Tentukan apakah aplikasi monolitik Laravel + Blade atau frontend terpisah + Laravel API.
- [ ] Pastikan versi PHP dan MySQL pada hosting.
- [ ] Tentukan kebutuhan backup, logging, monitoring, dan environment.
- [ ] Siapkan repository Git.
- [ ] Review UI dan catat revisi sebelum backend dimulai.

## H. Keputusan yang perlu dijawab pemilik proyek
- [ ] Apakah Guru BK dapat melihat seluruh kelas atau hanya kasus tertentu?
- [ ] Apakah Wali Kelas dapat menjalankan skrining atau hanya mengirim observasi?
- [ ] Apakah hasil numerik CF terlihat oleh semua role?
- [ ] Apakah siswa/orang tua menjadi pengguna aplikasi di fase selanjutnya?
- [ ] Apakah laporan individual dapat diekspor?
