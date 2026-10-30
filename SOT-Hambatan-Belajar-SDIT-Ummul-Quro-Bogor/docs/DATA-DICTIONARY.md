# DATA DICTIONARY — Data Minimization First

Rancangan ini membantu menentukan data minimum. Field final harus disetujui sekolah sebelum database dibuat.

## 1. Pengguna internal
- `id`: ID internal.
- `display_name`: nama tampilan staf sesuai kebutuhan.
- `email_or_username`: identitas login.
- `role`: admin / guru_bk / wali_kelas.
- `status`: active / inactive.
- `assigned_classes`: cakupan kelas untuk Wali Kelas.
- Jangan menyimpan kredensial plaintext.

## 2. Siswa (minimal)
- `student_id`: ID internal sekolah atau ID pseudonim.
- `display_name`: hanya bila benar-benar diperlukan untuk workflow.
- `class_id`: kelas saat ini.
- `status`: aktif/nonaktif.
- Field seperti NISN, alamat, tanggal lahir lengkap, nomor orang tua, atau data kesehatan tidak otomatis diperlukan; tambahkan hanya setelah penilaian kebutuhan dan kewenangan.

## 3. Indikator
- `indicator_code`: kode unik.
- `name`: nama singkat dan netral.
- `operational_definition`: apa yang dapat diamati.
- `observation_context`: konteks yang relevan.
- `category_id`: kategori.
- `source_reference`: referensi pakar/dokumen.
- `reviewer_id`, `reviewed_at`, `status`.
- `is_active`.

## 4. Hipotesis/kategori indikasi
- `hypothesis_code`: kode unik.
- `name`: label edukatif dan non-stigmatisasi.
- `description`: penjelasan batasan.
- `recommended_follow_up`: tindak lanjut edukatif.
- `source_reference`, `reviewer_id`, `status`.
- Hindari label diagnosis medis/psikologis kecuali proyek dan kewenangan profesional secara eksplisit mencakupnya.

## 5. Aturan CF
- `rule_code`, `hypothesis_id`, `indicator_id`.
- `expert_mb`, `expert_md` atau field bobot sesuai varian metode yang disetujui.
- `user_answer_mapping`: referensi mapping jawaban ke evidence.
- `version`, `status`, `reviewer_id`, `reviewed_at`.
- Simpan alasan dan sumber setiap bobot.

## 6. Sesi skrining
- `screening_id`: ID internal.
- `student_id`: referensi terbatas.
- `created_by`, `reviewed_by`.
- `screening_date`, `context_period`.
- `knowledge_base_version`, `method_version`.
- `status`: draft / submitted / reviewed / follow_up.
- `retention_until` bila kebijakan retensi ditetapkan.

## 7. Jawaban dan hasil
- Jawaban per indikator, status belum diamati, timestamp, dan aktor.
- Nilai perhitungan dan trace aturan yang dipakai.
- Hasil indikatif dan keterbatasan data.
- Tindak lanjut, penanggung jawab, status, dan tanggal review.
- Akses dibatasi; tidak ditampilkan di laporan agregat tanpa alasan yang sah.

## 8. Audit log
- Aktor, waktu, aksi, entitas, perubahan ringkas, alasan bila diperlukan.
- Jangan menyimpan password, token, atau salinan lengkap catatan sensitif yang tidak diperlukan.

## 9. Kebijakan yang harus diputuskan
- Retensi setiap kategori data.
- Mekanisme koreksi/penghapusan.
- Akses laporan individual dan ekspor.
- Penggunaan alias/pseudonim.
- Prosedur pemberitahuan dan persetujuan orang tua/wali bila diperlukan.
