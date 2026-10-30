# CERTAINTY FACTOR (CF) — METHOD SPEC

## 1. Tujuan dan batasan
Certainty Factor digunakan untuk merepresentasikan tingkat keyakinan pakar terhadap hipotesis berdasarkan indikator/fakta. Dalam aplikasi ini CF hanya memberi indikasi awal yang mendukung proses review manusia. Nilai CF bukan probabilitas statistik atau diagnosis profesional.

## 2. Definisi dasar
Dalam model klasik:
- `MB(H,E)` = ukuran kepercayaan terhadap hipotesis H berdasarkan evidence E.
- `MD(H,E)` = ukuran ketidakpercayaan terhadap hipotesis H berdasarkan evidence E.
- `CF(H,E) = MB(H,E) - MD(H,E)`, biasanya dalam rentang -1 sampai 1.

Jika implementasi memakai skala keyakinan pengguna, transformasi jawaban pengguna menjadi CF evidence harus didefinisikan dan disetujui pakar. Jangan mencampur formula dari beberapa varian metode tanpa dokumentasi.

## 3. Kombinasi CF
Untuk dua evidence yang mendukung hipotesis sama dan keduanya CF positif:
`CFcombine = CF1 + CF2 * (1 - CF1)`

Untuk dua CF negatif:
`CFcombine = CF1 + CF2 * (1 + CF1)`

Untuk tanda berbeda:
`CFcombine = (CF1 + CF2) / (1 - min(|CF1|, |CF2|))`

Formula kombinasi harus dipastikan sesuai referensi metodologi yang dipilih, urutan/kelompok evidence ditangani konsisten, dan kasus penyebut nol ditangani. Jangan menerapkan formula ini secara membabi buta bila proyek memilih varian lain.

## 4. Input pengguna
- Indikator harus memiliki definisi operasional dan instruksi observasi.
- Skala jawaban harus ditetapkan bersama pakar (misalnya tidak pernah/jarang/kadang/sering), beserta mapping ke nilai evidence yang disepakati.
- Sediakan “Belum diamati/Tidak cukup data”; ini bukan sama dengan “Tidak”.
- Jangan mengasumsikan bobot jawaban hanya karena tampak masuk akal.
- Hindari mengubah frekuensi observasi menjadi ukuran kondisi siswa tanpa validasi.

## 5. Alur perhitungan
1. Muat indikator yang disetujui dan versi aturan aktif.
2. Validasi jawaban dan tandai data yang belum tersedia.
3. Petakan jawaban ke nilai evidence sesuai mapping tervalidasi.
4. Evaluasi aturan yang relevan.
5. Hitung CF setiap hipotesis menggunakan formula yang disetujui.
6. Simpan input, bobot, aturan, versi metode, dan jejak perhitungan untuk audit.
7. Tentukan status hasil berdasarkan ambang yang disetujui pakar; jangan mengarang ambang.
8. Tampilkan faktor pendukung, data yang kurang/bertentangan, keterbatasan, dan arahan review manusia.

## 6. Tampilan hasil
- Gunakan label yang hati-hati, misalnya “Indikasi yang perlu ditinjau”.
- Jika nilai numerik ditampilkan, jelaskan arti dan batasannya.
- Jangan menampilkan angka seolah-olah persentase probabilitas gangguan.
- Jangan menggunakan hasil untuk memberi label permanen.
- Hasil dengan data kurang atau di luar cakupan aturan harus diberi status “Belum cukup informasi”.
- Tampilkan versi basis pengetahuan dan waktu skrining kepada pengguna berwenang.

## 7. Validasi pakar dan pengujian
Sebelum produksi:
- Definisikan hipotesis/kategori dengan bahasa edukatif dan non-diagnostik.
- Validasi setiap indikator, bobot pakar, mapping jawaban, kombinasi CF, dan ambang interpretasi.
- Uji contoh positif, negatif, campuran, data kosong, dan data bertentangan.
- Bandingkan hasil dengan review pakar menggunakan protokol yang disepakati.
- Dokumentasikan false positive/false negative dan keterbatasan.
- Jangan mengklaim akurasi sebelum evaluasi empiris yang memadai.

## 8. Larangan implementasi
- Jangan mengisi MB/MD atau ambang berdasarkan tebakan AI.
- Jangan menyebut CF sebagai persentase kemungkinan diagnosis.
- Jangan mengaktifkan aturan tanpa sumber/reviewer.
- Jangan mengotomatisasi keputusan berisiko tinggi tentang siswa.
