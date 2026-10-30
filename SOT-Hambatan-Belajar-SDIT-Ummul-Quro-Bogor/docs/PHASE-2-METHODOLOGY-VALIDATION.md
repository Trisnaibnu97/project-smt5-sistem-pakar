# DOKUMEN VALIDASI METODOLOGI & BASIS PENGETAHUAN (PHASE 2)
**Sistem Pakar Diagnosa Dini Hambatan Belajar Siswa Berbasis Web**  
*Studi Kasus: SDIT Ummul Quro Bogor*  
*Versi Basis Pengetahuan: v1.0-RC (Review Candidate)*  
*Tanggal: 27 Oktober 2026*  

---

## 1. Pendahuluan dan Landasan Prinsip

Dokumen ini disusun sebagai pelaksanaan **Phase 2 — Validasi Metodologi dan Data** sesuai dengan [docs/IMPLEMENTATION-PLAN.md](file:///d:/project-programming/SOT-Hambatan-Belajar-SDIT-Ummul-Quro-Bogor/SOT-Hambatan-Belajar-SDIT-Ummul-Quro-Bogor/docs/IMPLEMENTATION-PLAN.md).

### Prinsip Utama:
1. **Bukan Alat Diagnosis Klinis:** Sistem dirancang sebagai *early screening support tool* (skrining awal) berbasis observasi perilaku belajar di kelas, bukan penetapan gangguan psikologis/medis permanen.
2. **Bahasa Edukatif & Tidak Menghakimi:** Seluruh terminologi berorientasi pada *"hambatan dan kebutuhan dukungan belajar"*, menghindari label patologis (seperti anak cacat, idiot, bodoh, dsb).
3. **Auditability & Traceability:** Setiap output nilai Certainty Factor (CF) harus dapat ditelusuri kembali ke fakta bukti (*evidence*), bobot pakar (*MB & MD*), dan aturan yang aktif.
4. **Data Perlindungan Anak:** Dataset pengujian murni menggunakan data sintetis fiktif tanpa mengekspos identitas siswa nyata.

---

## 2. Definisi Operasional Hambatan Belajar & Kategori Indikasi

Dalam konteks SDIT Ummul Quro Bogor, **Hambatan Belajar** didefinisikan sebagai:
> *Kesenjangan yang konsisten dan signifikan antara potensi belajar siswa dengan capaian proses pembelajaran di kelas, yang teramati melalui perilaku belajar spesifik dalam kurun waktu minimal 2–4 minggu proses KBM reguler.*

### Kategori Hipotesis (H):
| Kode | Nama Kategori Hipotesis | Istilah Umum Terkait | Definisi Edukatif |
| :---: | :--- | :--- | :--- |
| **H01** | **Indikasi Hambatan Belajar Literasi & Membaca Dasar** | *Dyslexia-like tendencies* | Kesulitan mengenali bentuk huruf, dekoding fonemik kata, kelancaran membaca kalimat, atau ketepatan mengeja tanpa gangguan penglihatan primer. |
| **H02** | **Indikasi Hambatan Belajar Numerasi & Matematika Dasar** | *Dyscalculia-like tendencies* | Kesulitan memahami konsep kuantitas angka dasar, mengenali simbol operasi (+, −, ×, ÷), atau mengurutkan tahapan hitung sederhana. |
| **H03** | **Indikasi Hambatan Regulasi Perhatian & Konsentrasi Belajar** | *Inattention / Executive Function tendencies* | Kesulitan mempertahankan fokus tugas belajar secara berkelanjutan (> 10-15 menit), mudah terdistraksi stimulus lingkungan, atau sering lupa instruksi bertahap. |
| **H04** | **Indikasi Hambatan Regulasi Emosi & Interaksi Belajar** | *Social-emotional learning regulation* | Reaksi kecemasan berlebih saat menghadapi tugas belajar baru, resistensi frustrasi rendah saat salah, atau menarik diri saat kerja kelompok. |

---

## 3. Skala Jawaban Observasi & Mapping Evidence

Untuk menghindari distorsi data, observasi dilakukan oleh guru/wali kelas yang berinteraksi langsung dalam proses KBM:

| Pilihan Jawaban | Definisi Frekuensi Observasi (Periode 2–4 Minggu) | Nilai $CF_{User} (E)$ | Interpretasi Metodologis |
| :--- | :--- | :---: | :--- |
| **Tidak Pernah** | Perilaku sama sekali tidak pernah teramati pada KBM | `0.00` | Fakta tidak muncul (netral) |
| **Jarang** | Muncul sesekali (1–2 kali per minggu), terisolasi | `0.25` | Derajat keyakinan rendah |
| **Kadang-kadang** | Muncul periodik (3–4 kali per minggu) dalam KBM tertentu | `0.50` | Derajat keyakinan sedang |
| **Sering** | Muncul hampir setiap hari dalam aktivitas pembelajaran terkait | `0.75` | Derajat keyakinan tinggi |
| **Selalu** | Konsisten muncul di setiap situasi pembelajaran yang relevan | `1.00` | Derajat keyakinan mutlak |
| **Belum Diamati** | Guru belum memiliki kesempatan mengamati / data belum cukup | `null` | **Dikeluarkan dari kalkulasi** (tidak dianggap nol) |

---

## 4. Matriks Indikator Operasional & Bobot Pakar (Knowledge Base v1.0)

Kombinasi bobot pakar ditentukan dengan prinsip:
- **$MB(H, E)$**: *Measure of Belief* (Tingkat kepercayaan pakar bahwa bukti $E$ mengindikasikan $H$).
- **$MD(H, E)$**: *Measure of Disbelief* (Tingkat ketidakpercayaan pakar bahwa bukti $E$ mengindikasikan $H$).
- **$CF_{Pakar}(H, E) = MB - MD$**.

### A. Kategori H01: Literasi & Membaca Dasar
| Kode | Indikator Observasi Terukur | Instruksi Pengamatan Guru | $MB$ | $MD$ | $CF_{Pakar}$ |
| :---: | :--- | :--- | :---: | :---: | :---: |
| **I01** | Sering tertukar/terbalik membaca huruf serupa (contoh: b/d, p/q, m/w, u/n) | Amati saat membaca nyaring atau menyalin teks di papan tulis | 0.80 | 0.05 | **0.75** |
| **I02** | Membaca terbata-bata dengan kecepatan jauh di bawah rata-rata jenjang kelasnya | Amati kelancaran membaca 1 paragraf buku tema/mata pelajaran | 0.70 | 0.10 | **0.60** |
| **I03** | Sering melewati kata, baris kalimat, atau mengulang baris yang sama saat membaca | Amati apakah jari telunjuk sering dibutuhkan untuk memandu mata membaca | 0.60 | 0.10 | **0.50** |
| **I04** | Kesulitan mengeja kata sederhana secara tertulis kendati berulang kali diajarkan | Periksa hasil dikte kata atau tulisan latihan di buku tulis | 0.65 | 0.10 | **0.55** |

### B. Kategori H02: Numerasi & Matematika Dasar
| Kode | Indikator Observasi Terukur | Instruksi Pengamatan Guru | $MB$ | $MD$ | $CF_{Pakar}$ |
| :---: | :--- | :--- | :---: | :---: | :---: |
| **I05** | Kesulitan mengenali atau tertukar simbol matematika dasar (+, −, ×, ÷, =, >) | Amati respons siswa saat diberikan instruksi latihan operasi campuran | 0.75 | 0.05 | **0.70** |
| **I06** | Kesulitan memahami konsep nilai tempat (contoh: membedakan puluhan dan ratusan) | Amati saat menuliskan bilangan ratusan/ribuan (misal: 105 ditulis 150) | 0.70 | 0.10 | **0.60** |
| **I07** | Ketergantungan ekstrem pada hitungan jari fisik untuk penjumlahan angka sederhana (<10) | Amati apakah siswa tetap menghitung jari satu-per-satu untuk fakta dasar | 0.60 | 0.15 | **0.45** |
| **I08** | Sering salah memahami soal cerita matematika meski kata-katanya sederhana | Amati apakah siswa tidak tahu operasi apa yang harus dijalankan | 0.65 | 0.10 | **0.55** |

### C. Kategori H03: Regulasi Perhatian & Konsentrasi Belajar
| Kode | Indikator Observasi Terukur | Instruksi Pengamatan Guru | $MB$ | $MD$ | $CF_{Pakar}$ |
| :---: | :--- | :--- | :---: | :---: | :---: |
| **I09** | Sulit mempertahankan fokus pada tugas mandiri lebih dari 10–15 menit | Amati saat tugas mandiri di lembar kerja siswa (LKS) | 0.70 | 0.10 | **0.60** |
| **I10** | Sangat mudah terdistraksi oleh suara/gerakan kecil di kelas (menengok keluar/teman) | Amati frekuensi teralihnya pandangan saat guru sedang menjelaskan materi | 0.65 | 0.10 | **0.55** |
| **I11** | Sering tidak menuntaskan tugas kelas karena melamun atau sibuk dengan benda lain | Amati lembar tugas yang sering tertinggal kosong sebagian tanpa sebab jelas | 0.60 | 0.10 | **0.50** |
| **I12** | Kerap lupa instruksi yang terdiri atas 2–3 langkah berurutan | Amati saat diberi arahan: "Buka halaman X, kerjakan nomor Y, kumpulkan di meja Z" | 0.55 | 0.15 | **0.40** |

### D. Kategori H04: Regulasi Emosi & Interaksi Belajar
| Kode | Indikator Observasi Terukur | Instruksi Pengamatan Guru | $MB$ | $MD$ | $CF_{Pakar}$ |
| :---: | :--- | :--- | :---: | :---: | :---: |
| **I13** | Menunjukkan kecemasan ekstrem (menangis, mengeluh sakit perut/kepala) saat tes/tugas | Amati perilaku menjelang evaluasi atau presentasi di depan kelas | 0.60 | 0.15 | **0.45** |
| **I14** | Sangat mudah menyerah, merobek kertas, atau marah saat membuat kesalahan kecil | Amati reaksi emosional saat diarahkan memperbaiki tulisan yang keliru | 0.65 | 0.10 | **0.55** |
| **I15** | Enggan terlibat atau menarik diri saat aktivitas belajar kelompok | Amati dinamika kerja sama dan interaksi dengan teman sebaya | 0.50 | 0.20 | **0.30** |

---

## 5. Rumus & Prosedur Inferensi Certainty Factor

### Langkah 1: Perhitungan CF Evidence Tunggal
Untuk setiap indikator $i$ yang memiliki jawaban valid ($CF_{User} \neq null$):
$$CF(E_i) = CF_{User}(E_i) \times CF_{Pakar}(H, E_i)$$

Jika $CF_{User}$ bernilai `null` (*Belum Diamati*), maka $CF(E_i)$ **tidak dihitung dan tidak dimasukkan dalam kombinasi**.

### Langkah 2: Kombinasi Sekuensial CF untuk Hipotesis yang Sama
Jika terdapat dua evidence $CF_1$ dan $CF_2$ yang bernilai positif ($CF_1 \ge 0, CF_2 \ge 0$):
$$CF_{combine}(CF_1, CF_2) = CF_1 + CF_2 \times (1 - CF_1)$$

Jika ada evidence ketiga $CF_3$:
$$CF_{combine\_final} = CF_{combine}(CF_1, CF_2) + CF_3 \times (1 - CF_{combine}(CF_1, CF_2))$$

*(Formula ini memastikan nilai akhir selalu berada dalam interval $[0.0, 1.0]$ secara asimtotik).*

### Langkah 3: Penanganan Data Kurang (Completeness Check)
Untuk menjaga validitas etis:
- Jika jumlah indikator yang dijawab valid pada suatu kategori **kurang dari 50%**, status kategori ditetapkan menjadi: **"Belum Cukup Data"** (*Insufficient Data*).
- Sistem tidak boleh menghasilkan skor konklusif jika mayoritas indikator berstatus *Belum Diamati*.

---

## 6. Ambang Batas Interpretasi & Rekomendasi Tindak Lanjut

| Rentang Nilai $CF_{Akhir}$ | Klasifikasi Indikasi | Rekomendasi Edukatif Awal | Kewenangan Aksi |
| :---: | :--- | :--- | :--- |
| **Data < 50%** | **Belum Cukup Informasi** | Lengkapi observasi kelas minimal 1–2 minggu ke depan. | Wali Kelas |
| **0.00 – 0.24** | **Indikasi Rendah** | Perkembangan belajar relatif normal/tipikal. Terus berikan stimulasi KBM reguler. | Wali Kelas |
| **0.25 – 0.54** | **Indikasi Sedang** | Terindikasi adanya hambatan spesifik. Wali kelas menerapkan diferensiasi instruksi dan konsultasi ke Guru BK. | Wali Kelas & Guru BK |
| **0.55 – 1.00** | **Indikasi Kuat** | Indikasi hambatan signifikan. Guru BK menjadwalkan observasi khusus dan menyusun rencana observasi lanjutan/rujukan tenaga ahli. | Guru BK & Tim Sekolah |

---

## 7. Dataset Uji Validasi Metodologi (Sintetis)

Dataset berikut digunakan untuk memverifikasi ketepatan engine CF sebelum implementasi backend:

| ID Kasus | Nama Fiktif Siswa | Kelas | Input Observasi Terkunci | Output Harapan ($CF_{Akhir}$) | Status yang Diharapkan |
| :---: | :--- | :---: | :--- | :--- | :--- |
| **TC-01** | *Faris Maulana [DEMO]* | 3A | I01: Selalu (1.0)<br>I02: Sering (0.75)<br>I03: Sering (0.75)<br>I04: Sering (0.75)<br>I05–I15: Jarang/Tidak pernah | H01: **0.95 (Indikasi Kuat)**<br>H02: 0.15 (Rendah)<br>H03: 0.12 (Rendah)<br>H04: 0.05 (Rendah) | Terdeteksi dominan Literasi/Membaca. Rekomendasi observasi lanjutan BK. |
| **TC-02** | *Nadira Safitri [DEMO]* | 4B | I05: Selalu (1.0)<br>I06: Sering (0.75)<br>I07: Sering (0.75)<br>I08: Sering (0.75)<br>I01–I04: Jarang/Tidak pernah | H01: 0.10 (Rendah)<br>H02: **0.93 (Indikasi Kuat)**<br>H03: 0.10 (Rendah)<br>H04: 0.00 (Rendah) | Terdeteksi dominan Numerasi/Matematika. Rekomendasi media manipulatif. |
| **TC-03** | *Zaidan Al-Farizi [DEMO]* | 4A | I09: Selalu (1.0)<br>I10: Selalu (1.0)<br>I11: Sering (0.75)<br>I12: Sering (0.75)<br>I01–I08: Tidak pernah | H01: 0.00 (Rendah)<br>H02: 0.00 (Rendah)<br>H03: **0.94 (Indikasi Kuat)**<br>H04: 0.20 (Rendah) | Terdeteksi dominan Regulasi Perhatian. Rekomendasi penataan tempat duduk & tugas bertahap. |
| **TC-04** | *Aisyah Humaira [DEMO]* | 3B | I01: Sering (0.75)<br>I02: Sering (0.75)<br>I09: Sering (0.75)<br>I10: Sering (0.75)<br>Lainnya: Tidak pernah | H01: **0.75 (Indikasi Kuat)**<br>H02: 0.00 (Rendah)<br>H03: **0.72 (Indikasi Kuat)**<br>H04: 0.10 (Rendah) | Kasus Campuran (*Co-occurrence* Membaca & Perhatian). Disarankan observasi BK bersama wali kelas. |
| **TC-05** | *Bilal Ramadhan [DEMO]* | 5A | Seluruh I01 s/d I15 dijawab "Tidak Pernah" (0.0) | Seluruh H01–H04 = **0.00** | Perkembangan belajar tipikal (Tanpa Hambatan). |
| **TC-06** | *Danendra Putra [DEMO]* | 4A | Seluruh I01 s/d I15 dijawab "Belum Diamati" (*null*) | Seluruh H01–H04 = **null** | **"Belum Cukup Informasi"** (Sistem menolak memberikan kesimpulan). |
| **TC-07** | *Hilya Khairunnisa [DEMO]* | 3A | I01 s/d I03: "Belum Diamati"<br>I04: Jarang (0.25) (hanya 1 dari 4 indikator) | H01 = 0.14 | **"Belum Cukup Data"** (< 50% indikator terpenuhi). |

---

## 8. Lembar Persetujuan Validasi Pakar (Sign-off Gate Phase 2)

Format berikut dipersiapkan untuk ditandatangani oleh pakar yang ditunjuk SDIT Ummul Quro Bogor:

```markdown
LEMBAR PERNYATAAN KELAYAKAN BASIS PENGETAHUAN & METODOLOGI
SISTEM PAKAR DIAGNOSA DINI HAMBATAN BELAJAR SISWA
SDIT UMMUL QURO BOGOR

Menyatakan bahwa spesifikasi indikator, definisi operasional, bobot MB/MD, formula Certainty Factor, 
serta ambang batas interpretasi pada Dokumen Phase 2 ini telah ditinjau dan dinyatakan:

[ ] DISETUJUI TANPA CATATAN
[ ] DISETUJUI DENGAN CATATAN REVISI
[ ] BELUM DISETUJUI (PERLU PERBAIKAN)

Catatan Pakar / Reviewer:
__________________________________________________________________________________________
__________________________________________________________________________________________

Bogor, ________________________ 2026

Pakar Psikologi Pendidikan / Koordinator BK SDIT Ummul Quro Bogor:



(____________________________________)
NIP/NIK:
```
