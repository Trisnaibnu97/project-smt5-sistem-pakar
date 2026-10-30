<?php

namespace Database\Seeders;

use App\Models\CfRule;
use App\Models\Hypothesis;
use App\Models\Indicator;
use App\Models\KbVersion;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\User;
use App\Models\UserClassAssignment;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Users
        $admin = User::firstOrCreate(
            ['email' => 'admin@sdit-uq.sch.id'],
            [
                'name'      => 'Administrator Sistem [DEMO]',
                'password'  => Hash::make('password123'),
                'role'      => 'admin',
                'is_active' => true,
            ]
        );

        $guruBk = User::firstOrCreate(
            ['email' => 'bk@sdit-uq.sch.id'],
            [
                'name'      => 'Ustadzah Rahma, S.Psi (Guru BK) [DEMO]',
                'password'  => Hash::make('password123'),
                'role'      => 'guru_bk',
                'is_active' => true,
            ]
        );

        $wali3a = User::firstOrCreate(
            ['email' => 'wali3a@sdit-uq.sch.id'],
            [
                'name'      => 'Ustadz Ahmad, S.Pd (Wali Kelas 3A) [DEMO]',
                'password'  => Hash::make('password123'),
                'role'      => 'wali_kelas',
                'is_active' => true,
            ]
        );

        $wali4b = User::firstOrCreate(
            ['email' => 'wali4b@sdit-uq.sch.id'],
            [
                'name'      => 'Ustadzah Siti, S.Pd (Wali Kelas 4B) [DEMO]',
                'password'  => Hash::make('password123'),
                'role'      => 'wali_kelas',
                'is_active' => true,
            ]
        );

        // 2. Seed All Classes: Jenjang 1 - 6, masing-masing Rombel A - F (Total: 36 Kelas)
        $classes = [];
        $letters = ['A', 'B', 'C', 'D', 'E', 'F'];
        for ($grade = 1; $grade <= 6; $grade++) {
            foreach ($letters as $letter) {
                $className = "{$grade}{$letter}";
                $classes[$className] = SchoolClass::firstOrCreate(
                    ['name' => $className],
                    [
                        'grade_level'   => $grade,
                        'name'          => $className,
                        'academic_year' => '2026/2027',
                    ]
                );
            }
        }

        // 3. Seed Class Assignments untuk Akun Demo Wali Kelas
        UserClassAssignment::firstOrCreate([
            'user_id'  => $wali3a->id,
            'class_id' => $classes['3A']->id,
        ]);

        UserClassAssignment::firstOrCreate([
            'user_id'  => $wali4b->id,
            'class_id' => $classes['4B']->id,
        ]);

        // 4. Seed Synthetic Students (DEMO - No Real PII) untuk setiap rombel 1A - 6F
        $sampleNames = [
            'Faris Maulana', 'Hilya Khairunnisa', 'Aisyah Humaira', 'Zaidan Al-Farizi',
            'Danendra Putra', 'Nadira Safitri', 'Bilal Ramadhan', 'Maryam Qonita',
            'Ibrahim Rasyid', 'Salma Salsabila', 'Hamzah Prasetyo', 'Khadijah Nurul',
            'Raffi Athar', 'Alya Azkadina', 'Muhammad Azzam', 'Nayra Syakira'
        ];

        foreach ($classes as $className => $classModel) {
            // Berikan 3-4 siswa demo untuk setiap kelas agar siap diobservasi
            $grade = $classModel->grade_level;
            $subLetter = substr($className, 1);
            $seedCount = 3;

            for ($i = 1; $i <= $seedCount; $i++) {
                $numStr = str_pad($i, 2, '0', STR_PAD_LEFT);
                $code = "DEMO-{$className}-{$numStr}";
                $nameIndex = (ord($subLetter) + $grade + $i) % count($sampleNames);
                $studentName = "{$sampleNames[$nameIndex]} ({$className}) [DEMO]";

                Student::firstOrCreate(
                    ['student_code' => $code],
                    [
                        'student_code' => $code,
                        'name'         => $studentName,
                        'class_id'     => $classModel->id,
                        'is_active'    => true,
                    ]
                );
            }
        }

        // 5. Seed Knowledge Base Version v1.0-RC
        $kbVersion = KbVersion::firstOrCreate(
            ['version_code' => 'v1.0-RC'],
            [
                'status'        => 'active',
                'reviewer_name' => 'Koordinator BK & Pakar Psikologi Pendidikan SDIT Ummul Quro Bogor',
                'notes'         => 'Basis Pengetahuan tervalidasi Phase 2 (15 Indikator, 4 Kategori Hipotesis)',
                'activated_at'  => now(),
            ]
        );

        // 6. Seed Hypotheses
        $hypothesesData = [
            [
                'code'        => 'H01',
                'name'        => 'Indikasi Hambatan Belajar Literasi & Membaca Dasar',
                'description' => 'Kesulitan mengenali bentuk huruf, dekoding fonemik kata, kelancaran membaca kalimat, atau ketepatan mengeja tanpa gangguan penglihatan primer.',
            ],
            [
                'code'        => 'H02',
                'name'        => 'Indikasi Hambatan Belajar Numerasi & Matematika Dasar',
                'description' => 'Kesulitan memahami konsep kuantitas angka dasar, mengenali simbol operasi (+, -, x, /), atau mengurutkan tahapan hitung sederhana.',
            ],
            [
                'code'        => 'H03',
                'name'        => 'Indikasi Hambatan Regulasi Perhatian & Konsentrasi Belajar',
                'description' => 'Kesulitan mempertahankan fokus tugas belajar secara berkelanjutan (> 10-15 menit), mudah terdistraksi stimulus lingkungan, atau sering lupa instruksi bertahap.',
            ],
            [
                'code'        => 'H04',
                'name'        => 'Indikasi Hambatan Regulasi Emosi & Interaksi Belajar',
                'description' => 'Reaksi kecemasan berlebih saat menghadapi tugas belajar baru, resistensi frustrasi rendah saat salah, atau menarik diri saat kerja kelompok.',
            ],
        ];

        $hypotheses = [];
        foreach ($hypothesesData as $h) {
            $hypotheses[$h['code']] = Hypothesis::firstOrCreate(
                ['kb_version_id' => $kbVersion->id, 'code' => $h['code']],
                array_merge($h, ['kb_version_id' => $kbVersion->id])
            );
        }

        // 7. Seed Indicators
        $indicatorsData = [
            // H01 Indicators
            [
                'code'              => 'I01',
                'hypo'              => 'H01',
                'operational_text'  => 'Sering tertukar/terbalik membaca huruf serupa (contoh: b/d, p/q, m/w, u/n)',
                'observation_guide' => 'Amati saat membaca nyaring atau menyalin teks di papan tulis',
                'mb'                => 0.80,
                'md'                => 0.05,
                'cf'                => 0.75,
            ],
            [
                'code'              => 'I02',
                'hypo'              => 'H01',
                'operational_text'  => 'Membaca terbata-bata dengan kecepatan jauh di bawah rata-rata jenjang kelasnya',
                'observation_guide' => 'Amati kelancaran membaca 1 paragraf buku tema/mata pelajaran',
                'mb'                => 0.70,
                'md'                => 0.10,
                'cf'                => 0.60,
            ],
            [
                'code'              => 'I03',
                'hypo'              => 'H01',
                'operational_text'  => 'Sering melewati kata, baris kalimat, atau mengulang baris yang sama saat membaca',
                'observation_guide' => 'Amati apakah jari telunjuk sering dibutuhkan untuk memandu mata membaca',
                'mb'                => 0.60,
                'md'                => 0.10,
                'cf'                => 0.50,
            ],
            [
                'code'              => 'I04',
                'hypo'              => 'H01',
                'operational_text'  => 'Kesulitan mengeja kata sederhana secara tertulis kendati berulang kali diajarkan',
                'observation_guide' => 'Periksa hasil dikte kata atau tulisan latihan di buku tulis',
                'mb'                => 0.65,
                'md'                => 0.10,
                'cf'                => 0.55,
            ],
            // H02 Indicators
            [
                'code'              => 'I05',
                'hypo'              => 'H02',
                'operational_text'  => 'Kesulitan mengenali atau tertukar simbol matematika dasar (+, -, x, /, =, >)',
                'observation_guide' => 'Amati respons siswa saat diberikan instruksi latihan operasi campuran',
                'mb'                => 0.75,
                'md'                => 0.05,
                'cf'                => 0.70,
            ],
            [
                'code'              => 'I06',
                'hypo'              => 'H02',
                'operational_text'  => 'Kesulitan memahami konsep nilai tempat (contoh: membedakan puluhan dan ratusan)',
                'observation_guide' => 'Amati saat menuliskan bilangan ratusan/ribuan (misal: 105 ditulis 150)',
                'mb'                => 0.70,
                'md'                => 0.10,
                'cf'                => 0.60,
            ],
            [
                'code'              => 'I07',
                'hypo'              => 'H02',
                'operational_text'  => 'Ketergantungan ekstrem pada hitungan jari fisik untuk penjumlahan angka sederhana (<10)',
                'observation_guide' => 'Amati apakah siswa tetap menghitung jari satu-per-satu untuk fakta dasar',
                'mb'                => 0.60,
                'md'                => 0.15,
                'cf'                => 0.45,
            ],
            [
                'code'              => 'I08',
                'hypo'              => 'H02',
                'operational_text'  => 'Sering salah memahami soal cerita matematika meski kata-katanya sederhana',
                'observation_guide' => 'Amati apakah siswa tidak tahu operasi apa yang harus dijalankan',
                'mb'                => 0.65,
                'md'                => 0.10,
                'cf'                => 0.55,
            ],
            // H03 Indicators
            [
                'code'              => 'I09',
                'hypo'              => 'H03',
                'operational_text'  => 'Sulit mempertahankan fokus pada tugas mandiri lebih dari 10-15 menit',
                'observation_guide' => 'Amati saat tugas mandiri di lembar kerja siswa (LKS)',
                'mb'                => 0.70,
                'md'                => 0.10,
                'cf'                => 0.60,
            ],
            [
                'code'              => 'I10',
                'hypo'              => 'H03',
                'operational_text'  => 'Sangat mudah terdistraksi oleh suara/gerakan kecil di kelas (menengok keluar/teman)',
                'observation_guide' => 'Amati frekuensi teralihnya pandangan saat guru sedang menjelaskan materi',
                'mb'                => 0.65,
                'md'                => 0.10,
                'cf'                => 0.55,
            ],
            [
                'code'              => 'I11',
                'hypo'              => 'H03',
                'operational_text'  => 'Sering tidak menuntaskan tugas kelas karena melamun atau sibuk dengan benda lain',
                'observation_guide' => 'Amati lembar tugas yang sering tertinggal kosong sebagian tanpa sebab jelas',
                'mb'                => 0.60,
                'md'                => 0.10,
                'cf'                => 0.50,
            ],
            [
                'code'              => 'I12',
                'hypo'              => 'H03',
                'operational_text'  => 'Kerap lupa instruksi yang terdiri atas 2-3 langkah berurutan',
                'observation_guide' => 'Amati saat diberi arahan: "Buka halaman X, kerjakan nomor Y, kumpulkan di meja Z"',
                'mb'                => 0.55,
                'md'                => 0.15,
                'cf'                => 0.40,
            ],
            // H04 Indicators
            [
                'code'              => 'I13',
                'hypo'              => 'H04',
                'operational_text'  => 'Menunjukkan kecemasan ekstrem (menangis, mengeluh sakit perut/kepala) saat tes/tugas',
                'observation_guide' => 'Amati perilaku menjelang evaluasi atau presentasi di depan kelas',
                'mb'                => 0.60,
                'md'                => 0.15,
                'cf'                => 0.45,
            ],
            [
                'code'              => 'I14',
                'hypo'              => 'H04',
                'operational_text'  => 'Sangat mudah menyerah, merobek kertas, atau marah saat membuat kesalahan kecil',
                'observation_guide' => 'Amati reaksi emosional saat diarahkan memperbaiki tulisan yang keliru',
                'mb'                => 0.65,
                'md'                => 0.10,
                'cf'                => 0.55,
            ],
            [
                'code'              => 'I15',
                'hypo'              => 'H04',
                'operational_text'  => 'Enggan terlibat atau menarik diri saat aktivitas belajar kelompok',
                'observation_guide' => 'Amati dinamika kerja sama dan interaksi dengan teman sebaya',
                'mb'                => 0.50,
                'md'                => 0.20,
                'cf'                => 0.30,
            ],
        ];

        foreach ($indicatorsData as $ind) {
            $indicator = Indicator::firstOrCreate(
                ['kb_version_id' => $kbVersion->id, 'code' => $ind['code']],
                [
                    'kb_version_id'     => $kbVersion->id,
                    'code'              => $ind['code'],
                    'operational_text'  => $ind['operational_text'],
                    'observation_guide' => $ind['observation_guide'],
                ]
            );

            // Create CF Rule
            CfRule::firstOrCreate(
                [
                    'hypothesis_id' => $hypotheses[$ind['hypo']]->id,
                    'indicator_id'  => $indicator->id,
                ],
                [
                    'expert_mb' => $ind['mb'],
                    'expert_md' => $ind['md'],
                    'expert_cf' => $ind['cf'],
                ]
            );
        }
    }
}
