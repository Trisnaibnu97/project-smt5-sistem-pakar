# Dokumentasi Diagram Lengkap Sistem Pakar EduCare (SDIT Ummul Quro Bogor)

Dokumen ini berisi kode representasi diagram permodelan sistem:
1. **Use Case Diagram (PlantUML & Mermaid)**
2. **Activity Diagram (PlantUML & Mermaid)**
3. **Class Diagram (Mermaid & PlantUML)**
4. **Entity Relationship Diagram / ERD (Mermaid & PlantUML)**

---

## 1. Use Case Diagram

Diagram ini merepresentasikan hak akses dan peran dari 3 aktor utama sistem: **Wali Kelas**, **Guru BK (Pakar)**, dan **Admin Sistem**.

### Format Mermaid
```mermaid
flowchart LR
    %% Actors
    Wali["Wali Kelas"]
    BK["Guru BK (Pakar)"]
    Admin["Admin Sistem"]

    %% System Boundary
    subgraph EduCare["Sistem Pakar EduCare - SDIT Ummul Quro Bogor"]
        UC1(["1. Login & Autentikasi"])
        UC2(["2. Reset Password Default"])
        UC3(["3. Melihat Dashboard Profil Siswa"])
        UC4(["4. Melakukan Observasi Skrining Siswa"])
        UC5(["5. Menghitung Certainty Factor (Engine)"])
        UC6(["6. Meninjau Hasil Skrining"])
        UC7(["7. Merumuskan Rekomendasi Tindak Lanjut"])
        UC8(["8. Mencetak / Ekspor Laporan Agregat"])
        UC9(["9. Mengelola Basis Pengetahuan (MB, MD, Rule)"])
        UC10(["10. Mengelola Data Pengguna (CRUD User)"])
        UC11(["11. Mengelola Konten Landing Page"])
    end

    %% Relations Wali Kelas
    Wali --> UC1
    Wali --> UC2
    Wali --> UC3
    Wali --> UC4
    Wali --> UC6

    %% Relations Guru BK
    BK --> UC1
    BK --> UC2
    BK --> UC3
    BK --> UC4
    BK --> UC6
    BK --> UC7
    BK --> UC8
    BK --> UC9

    %% Relations Admin
    Admin --> UC1
    Admin --> UC2
    Admin --> UC9
    Admin --> UC10
    Admin --> UC11
    Admin --> UC8

    %% Includes & Extends
    UC4 -.->|"<<include>>"| UC5
    UC6 -.->|"<<extend>>"| UC7
```

### Format PlantUML
```plantuml
@startuml
left to right direction
skinparam packageStyle rectangle

actor "Wali Kelas" as Wali
actor "Guru BK (Pakar)" as BK
actor "Administrator" as Admin

rectangle "Sistem Pakar EduCare (SDIT Ummul Quro Bogor)" {
  usecase "UC01: Login & Autentikasi" as UC01
  usecase "UC02: Reset Password ke Default" as UC02
  usecase "UC03: Melihat Dashboard Kelas & Siswa" as UC03
  usecase "UC04: Melakukan Observasi Gejala Siswa" as UC04
  usecase "UC05: Kalkulasi Certainty Factor Multi-Hipotesis" as UC05
  usecase "UC06: Meninjau Hasil Skrining & Trace Log" as UC06
  usecase "UC07: Menetapkan Tindak Lanjut & Intervensi" as UC07
  usecase "UC08: Mencetak / Ekspor Laporan Agregat" as UC08
  usecase "UC09: Mengelola Basis Pengetahuan (Hipotesis & CF Rule)" as UC09
  usecase "UC10: Mengelola Pengguna (CRUD User & Assign Kelas)" as UC10
  usecase "UC11: Mengelola Konten Landing Page (CMS)" as UC11
}

Wali --> UC01
Wali --> UC02
Wali --> UC03
Wali --> UC04
Wali --> UC06

BK --> UC01
BK --> UC02
BK --> UC03
BK --> UC04
BK --> UC06
BK --> UC07
BK --> UC08
BK --> UC09

Admin --> UC01
Admin --> UC02
Admin --> UC09
Admin --> UC10
Admin --> UC11
Admin --> UC08

UC04 ..> UC05 : <<include>>
UC07 ..> UC06 : <<extend>>
@enduml
```

---

## 2. Activity Diagram

Diagram aktivitas mencakup 2 alur inti bisnis:
- **Alur Skrining & Inferensi Certainty Factor (Wali Kelas & Sistem)**
- **Alur Tindak Lanjut Intervensi (Guru BK)**

### Format Mermaid: Alur Observasi & Kalkulasi CF
```mermaid
flowchart TD
    startNode([Mulai]) --> login[Wali Kelas / BK Login ke Sistem]
    login --> pilihSiswa[Pilih Siswa & Buka Halaman Skrining]
    pilihSiswa --> isiGejala[Mengisi 15 Indikator Gejala Observasi]
    isiGejala --> pilihSkala[Memilih Skala Nilai CF User 0.0 s/d 1.0]
    pilihSkala --> submitForm[Klik Tombol 'Selesaikan Skrining']
    
    subgraph Sistem ["Certainty Factor Engine"]
        submitForm --> simpanObs[Simpan Jawaban Skrining ke Database]
        simpanObs --> ambilRule[Ambil Aturan MB & MD Pakar per Hipotesis]
        ambilRule --> hitungCFE[Hitung CF Gejala = CF User × CF Pakar]
        hitungCFE --> kombinasiCF[Kombinasikan CF Combine untuk Semua Gejala]
        kombinasiCF --> simpanHasil[Simpan Skor CF & Tingkat Indikasi]
    end

    simpanHasil --> tampilkanHasil[Tampilkan Hasil Diagnosis & Trace CF ke Layar]
    tampilkanHasil --> endNode([Selesai])
```

### Format Mermaid: Alur Peninjauan & Intervensi Guru BK
```mermaid
flowchart TD
    startBK([Mulai]) --> loginBK[Guru BK Login ke Sistem]
    loginBK --> bukaKasus[Pilih Kasus Siswa 'Perlu Review' dari Dashboard]
    bukaKasus --> telaahTrace[Telaah Detail Riwayat Skor CF & Gejala Dominan]
    telaahTrace --> bukaTindakLanjut[Buka Halaman Form Tindak Lanjut]
    bukaTindakLanjut --> pilihSesi[Pilih Sesi Skrining Siswa yang Bersangkutan]
    pilihSesi --> isiRekomendasi[Pilih Jenis Tindakan & Tulis Catatan Intervensi]
    isiRekomendasi --> simpanTL[Klik Simpan Tindak Lanjut]
    simpanTL --> updateStatus[Sistem Memperbarui Status Kasus Siswa]
    updateStatus --> tampilRiwayat[Tindak Lanjut Tercatat di Riwayat Siswa]
    tampilRiwayat --> selesaiBK([Selesai])
```

### Format PlantUML: Activity Diagram Lengkap
```plantuml
@startuml
title Activity Diagram: Alur Skrining Observasi & Tindak Lanjut Pakar

|Wali Kelas / Pengamat|
start
:Login ke Akun Sistem;
:Pilih Siswa di Dashboard;
:Buka Menu Skrining Observasi;
:Isi Bobot Frekuensi pada 15 Indikator Gejala;
:Klik 'Selesaikan Skrining';

|Certainty Factor Engine (Backend)|
:Validasi Kelengkapan Jawaban;
:Simpan data ke tabel `screenings` & `screening_answers`;
fork
  :Ambil Rule Hipotesis H01 (Literasi & Membaca);
  :Hitung CF Evidence = CF User * CF Expert;
  :Lakukan CF Combine;
fork again
  :Ambil Rule Hipotesis H02 (Numerasi & Matematika);
  :Hitung CF Evidence = CF User * CF Expert;
  :Lakukan CF Combine;
fork again
  :Ambil Rule Hipotesis H03 (Regulasi Perhatian);
  :Hitung CF Evidence = CF User * CF Expert;
  :Lakukan CF Combine;
fork again
  :Ambil Rule Hipotesis H04 (Regulasi Emosi & Interaksi);
  :Hitung CF Evidence = CF User * CF Expert;
  :Lakukan CF Combine;
end fork
:Simpan Skor Final ke `screening_results` & `screening_result_traces`;
:Kirim Response JSON Hasil Diagnosis;

|Wali Kelas / Pengamat|
:Melihat Hasil Diagnosis & Tingkat Indikasi;

|Guru BK (Pakar)|
:Melihat Notifikasi Kasus Baru di Dashboard BK;
:Buka Detail Kasus & Review Hasil Skrining;
:Input Jenis Tindakan & Catatan Rencana Intervensi;
:Simpan Rekomendasi ke Database;

|Certainty Factor Engine (Backend)|
:Simpan ke tabel `follow_ups`;
:Catat ke `audit_logs`;

|Guru BK (Pakar)|
:Riwayat Tindak Lanjut Tersimpan & Siap Dievaluasi;
stop
@enduml
```

---

## 3. Class Diagram

Diagram kelas menunjukkan struktur arsitektur OOP backend Laravel, model Eloquent, relasi data, serta service engine inferensi.

### Format Mermaid
```mermaid
classDiagram
    direction TB

    class User {
        +int id
        +string name
        +string email
        +string password
        +string role
        +string nip
        +assignments() HasMany
        +screenings() HasMany
        +createdFollowUps() HasMany
    }

    class SchoolClass {
        +int id
        +string name
        +int grade_level
        +string academic_year
        +students() HasMany
        +userAssignments() HasMany
    }

    class UserClassAssignment {
        +int id
        +int user_id
        +int school_class_id
        +string academic_year
        +user() BelongsTo
        +schoolClass() BelongsTo
    }

    class Student {
        +int id
        +string student_code
        +string name
        +string gender
        +int school_class_id
        +schoolClass() BelongsTo
        +screenings() HasMany
    }

    class KbVersion {
        +int id
        +string version_name
        +string status
        +hypotheses() HasMany
        +indicators() HasMany
    }

    class Hypothesis {
        +int id
        +int kb_version_id
        +string code
        +string name
        +string description
        +cfRules() HasMany
    }

    class Indicator {
        +int id
        +int kb_version_id
        +string code
        +string operational_text
        +string observation_guide
        +cfRules() HasMany
    }

    class CfRule {
        +int id
        +int hypothesis_id
        +int indicator_id
        +float expert_mb
        +float expert_md
        +float expert_cf
        +hypothesis() BelongsTo
        +indicator() BelongsTo
    }

    class Screening {
        +int id
        +int student_id
        +int created_by_user_id
        +string status
        +string summary_notes
        +student() BelongsTo
        +createdByUser() BelongsTo
        +answers() HasMany
        +results() HasMany
        +followUps() HasMany
    }

    class ScreeningAnswer {
        +int id
        +int screening_id
        +int indicator_id
        +string answer_scale
        +float user_cf
        +screening() BelongsTo
        +indicator() BelongsTo
    }

    class ScreeningResult {
        +int id
        +int screening_id
        +int hypothesis_id
        +float final_cf
        +string indication_level
        +int answered_count
        +int total_indicators
        +traces() HasMany
    }

    class ScreeningResultTrace {
        +int id
        +int screening_result_id
        +int cf_rule_id
        +int step_order
        +float cf_user
        +float cf_expert
        +float cf_evidence
        +float running_cf
    }

    class FollowUp {
        +int id
        +int screening_id
        +int created_by_user_id
        +string action_type
        +string notes
        +date target_date
        +string status
        +screening() BelongsTo
        +createdByUser() BelongsTo
    }

    class CertaintyFactorEngine {
        +calculateScreening(Screening $screening) array
        -combineSerial(float $cf1, float $cf2) float
        -determineLevel(float $finalCf, int $answered, int $total) string
    }

    User "1" --> "0..*" UserClassAssignment
    SchoolClass "1" --> "0..*" UserClassAssignment
    SchoolClass "1" --> "0..*" Student
    User "1" --> "0..*" Screening : created_by
    User "1" --> "0..*" FollowUp : created_by

    KbVersion "1" --> "1..*" Hypothesis
    KbVersion "1" --> "1..*" Indicator
    Hypothesis "1" --> "1..*" CfRule
    Indicator "1" --> "1..*" CfRule

    Student "1" --> "0..*" Screening
    Screening "1" --> "1..*" ScreeningAnswer
    Indicator "1" --> "0..*" ScreeningAnswer
    Screening "1" --> "1..*" ScreeningResult
    Hypothesis "1" --> "0..*" ScreeningResult
    ScreeningResult "1" --> "1..*" ScreeningResultTrace
    CfRule "1" --> "0..*" ScreeningResultTrace
    Screening "1" --> "0..*" FollowUp

    CertaintyFactorEngine ..> Screening : processes
    CertaintyFactorEngine ..> ScreeningResult : generates
```

---

## 4. Entity Relationship Diagram (ERD)

Diagram ERD relasional fisik database (MySQL / SQLite) yang digunakan oleh sistem.

### Format Mermaid
```mermaid
erDiagram
    users ||--o{ user_class_assignments : assigned
    school_classes ||--o{ user_class_assignments : includes
    school_classes ||--o{ students : enrolls
    users ||--o{ screenings : creates
    users ||--o{ follow_ups : records
    
    kb_versions ||--|{ hypotheses : defines
    kb_versions ||--|{ indicators : defines
    hypotheses ||--|{ cf_rules : weights
    indicators ||--|{ cf_rules : referenced_by

    students ||--o{ screenings : has
    screenings ||--|{ screening_answers : contains
    indicators ||--o{ screening_answers : answers
    screenings ||--|{ screening_results : yields
    hypotheses ||--o{ screening_results : classifies
    screening_results ||--|{ screening_result_traces : logs
    cf_rules ||--o{ screening_result_traces : tracks
    screenings ||--o{ follow_ups : receives

    users {
        bigint id PK
        string name
        string email UK
        string password
        string role "admin | bk | wali"
        string nip
        timestamp created_at
    }

    school_classes {
        bigint id PK
        string name
        int grade_level "1 s/d 6"
        string academic_year
    }

    user_class_assignments {
        bigint id PK
        bigint user_id FK
        bigint school_class_id FK
        string academic_year
    }

    students {
        bigint id PK
        bigint school_class_id FK
        string student_code UK
        string name
        string gender "L | P"
        date birth_date
    }

    kb_versions {
        bigint id PK
        string version_name
        string status "active | archived"
    }

    hypotheses {
        bigint id PK
        bigint kb_version_id FK
        string code "H01 s/d H04"
        string name
        text description
    }

    indicators {
        bigint id PK
        bigint kb_version_id FK
        string code "I01 s/d I15"
        text operational_text
        text observation_guide
    }

    cf_rules {
        bigint id PK
        bigint hypothesis_id FK
        bigint indicator_id FK
        decimal expert_mb
        decimal expert_md
        decimal expert_cf
    }

    screenings {
        bigint id PK
        bigint student_id FK
        bigint created_by_user_id FK
        string status "in_progress | completed"
        timestamp completed_at
    }

    screening_answers {
        bigint id PK
        bigint screening_id FK
        bigint indicator_id FK
        string answer_scale
        decimal user_cf
    }

    screening_results {
        bigint id PK
        bigint screening_id FK
        bigint hypothesis_id FK
        decimal final_cf
        string indication_level
        int answered_count
        int total_indicators
    }

    screening_result_traces {
        bigint id PK
        bigint screening_result_id FK
        bigint cf_rule_id FK
        int step_order
        decimal cf_user
        decimal cf_expert
        decimal cf_evidence
        decimal running_cf
    }

    follow_ups {
        bigint id PK
        bigint screening_id FK
        bigint created_by_user_id FK
        string action_type
        text notes
        date target_date
        string status "pending | in_progress | resolved"
    }
```

---

### Cara Menggunakan Kode Diagram di Atas:
1. **GitHub Markdown / VS Code**: Blok dengan kode ```mermaid otomatis dirender menjadi grafik interaktif di GitHub maupun preview editor markdown.
2. **PlantUML**: Salin kode PlantUML ke [PlantText UML Editor](https://www.planttext.com/) atau plugin PlantUML di VS Code/IntelliJ untuk mengekspornya menjadi format gambar PNG/SVG/PDF.
3. **Draw.io**: Diagram Mermaid juga bisa langsung di-import di menu *Arrange > Insert > Advanced > Mermaid*.
