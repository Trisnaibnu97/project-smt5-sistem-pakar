<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\Indicator;
use App\Models\KbVersion;
use App\Models\SchoolClass;
use App\Models\Screening;
use App\Models\Student;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Phase 5 Integration and QA Test Suite:
 * - Uji isolasi akses lintas kelas (Anti-IDOR)
 * - Uji otorisasi lintas role (Wali Kelas, Guru BK, Admin)
 * - Uji validasi input invalid & completeness check (< 50% data terjawab)
 * - Uji trace transparansi perhitungan Certainty Factor
 * - Uji pencatatan audit trail otomatis
 * - Uji privacy-first laporan agregat
 */
class Phase5IntegrationAndSecurityQaTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    /**
     * Test 1: Wali Kelas dilarang mengakses/membuat skrining untuk siswa di kelas lain (Anti-IDOR).
     */
    public function test_wali_kelas_cannot_access_or_screen_student_from_another_class(): void
    {
        $wali3a = User::where('email', 'wali3a@sdit-uq.sch.id')->firstOrFail();
        
        // Siswa kelas 4A
        $student4a = Student::where('student_code', 'DEMO-4A-01')->firstOrFail();

        // 1. Wali 3A mencoba membuka data siswa 4A
        $getStudentRes = $this->actingAs($wali3a)->getJson("/api/students/{$student4a->id}");
        $getStudentRes->assertStatus(403);

        // 2. Wali 3A mencoba membuat skrining untuk siswa 4A
        $postScreeningRes = $this->actingAs($wali3a)->postJson('/api/screenings', [
            'student_id'         => $student4a->id,
            'observation_period' => 'Oktober 2026',
        ]);
        $postScreeningRes->assertStatus(403);
    }

    /**
     * Test 2: Guru BK memiliki hak akses menyeluruh (School-Wide Scope) ke seluruh kelas dan siswa.
     */
    public function test_guru_bk_can_access_any_student_and_perform_review(): void
    {
        $guruBk = User::where('email', 'bk@sdit-uq.sch.id')->firstOrFail();
        $student3a = Student::where('student_code', 'DEMO-3A-01')->firstOrFail();
        $student4a = Student::where('student_code', 'DEMO-4A-01')->firstOrFail();

        // Akses siswa kelas 3A
        $res3a = $this->actingAs($guruBk)->getJson("/api/students/{$student3a->id}");
        $res3a->assertStatus(200);

        // Akses siswa kelas 4A
        $res4a = $this->actingAs($guruBk)->getJson("/api/students/{$student4a->id}");
        $res4a->assertStatus(200);
    }

    /**
     * Test 3: Uji input invalid & boundary validation.
     */
    public function test_screening_creation_and_answers_reject_invalid_inputs(): void
    {
        $wali3a = User::where('email', 'wali3a@sdit-uq.sch.id')->firstOrFail();
        $student3a = Student::where('student_code', 'DEMO-3A-01')->firstOrFail();

        // 1. Skrining tanpa student_id
        $resNoStudent = $this->actingAs($wali3a)->postJson('/api/screenings', [
            'observation_period' => 'Oktober 2026',
        ]);
        $resNoStudent->assertStatus(422)
            ->assertJsonValidationErrors(['student_id']);

        // 2. Skrining dengan student_id fiktif tidak ada di DB
        $resInvalidStudent = $this->actingAs($wali3a)->postJson('/api/screenings', [
            'student_id'         => 999999,
            'observation_period' => 'Oktober 2026',
        ]);
        $resInvalidStudent->assertStatus(422)
            ->assertJsonValidationErrors(['student_id']);

        // 3. Buat skrining valid
        $screeningRes = $this->actingAs($wali3a)->postJson('/api/screenings', [
            'student_id'         => $student3a->id,
            'observation_period' => 'Oktober 2026',
        ]);
        $screeningId = $screeningRes->json('screening.id');

        // 4. Kirim jawaban dengan skala yang tidak valid
        $invalidAnswerRes = $this->actingAs($wali3a)->postJson("/api/screenings/{$screeningId}/answers", [
            'answers' => [
                [
                    'indicator_id' => 1,
                    'answer_value' => 'sangat-yakin-banget', // Tidak ada di enum
                ],
            ],
        ]);
        $invalidAnswerRes->assertStatus(422)
            ->assertJsonValidationErrors(['answers.0.answer_value']);
    }

    /**
     * Test 4: Uji rule data kurang (< 50% indikator dijawab menghasilkan status 'belum_cukup_data').
     */
    public function test_insufficient_data_returns_belum_cukup_data(): void
    {
        $wali3a = User::where('email', 'wali3a@sdit-uq.sch.id')->firstOrFail();
        $student3a = Student::where('student_code', 'DEMO-3A-01')->firstOrFail();

        $startRes = $this->actingAs($wali3a)->postJson('/api/screenings', [
            'student_id'         => $student3a->id,
            'observation_period' => 'Oktober 2026',
        ]);
        $screeningId = $startRes->json('screening.id');

        // Hanya jawab 1 indikator dari total 15
        $firstIndicator = Indicator::firstOrFail();
        $this->actingAs($wali3a)->postJson("/api/screenings/{$screeningId}/answers", [
            'answers' => [
                [
                    'indicator_id' => $firstIndicator->id,
                    'answer_value' => 'selalu',
                ],
            ],
        ]);

        // Kalkulasi CF
        $calcRes = $this->actingAs($wali3a)->postJson("/api/screenings/{$screeningId}/calculate");
        $calcRes->assertStatus(200);

        // Verifikasi hasil tiap hipotesis berstatus belum_cukup_data karena answered_count / total < 50%
        $results = $calcRes->json('results');
        $this->assertNotEmpty($results);
        foreach ($results as $res) {
            $this->assertEquals('belum_cukup_data', $res['indication_level']);
        }
    }

    /**
     * Test 5: Uji verifikasi jejak audit otomatis pada aksi skrining, review, dan tindak lanjut.
     */
    public function test_actions_record_tamper_evident_audit_logs(): void
    {
        $wali3a = User::where('email', 'wali3a@sdit-uq.sch.id')->firstOrFail();
        $guruBk = User::where('email', 'bk@sdit-uq.sch.id')->firstOrFail();
        $student3a = Student::where('student_code', 'DEMO-3A-01')->firstOrFail();

        // 1. Sesi skrining dimulai oleh Wali
        $screeningRes = $this->actingAs($wali3a)->postJson('/api/screenings', [
            'student_id'         => $student3a->id,
            'observation_period' => 'Oktober 2026',
        ]);
        $screeningId = $screeningRes->json('screening.id');

        $this->assertDatabaseHas('audit_logs', [
            'user_id'     => $wali3a->id,
            'action'      => 'CREATE_SCREENING',
            'entity_name' => 'screenings',
            'entity_id'   => $screeningId,
        ]);

        // 2. Guru BK menambahkan tindak lanjut
        $followUpRes = $this->actingAs($guruBk)->postJson("/api/screenings/{$screeningId}/follow-ups", [
            'action_type' => 'diferensiasi_pembelajaran',
            'status'      => 'berjalan',
            'notes'       => 'Pendampingan membaca kartu suku kata di jam istirahat pertama.',
        ]);
        $followUpRes->assertStatus(201);

        $this->assertDatabaseHas('audit_logs', [
            'user_id'     => $guruBk->id,
            'action'      => 'ADD_FOLLOW_UP',
            'entity_name' => 'follow_ups',
        ]);
    }

    /**
     * Test 6: Uji laporan agregat privacy-first (tidak membocorkan PII / identitas individu siswa).
     */
    public function test_aggregate_report_does_not_leak_student_personal_data(): void
    {
        $guruBk = User::where('email', 'bk@sdit-uq.sch.id')->firstOrFail();

        $reportRes = $this->actingAs($guruBk)->getJson('/api/reports/aggregate');
        $reportRes->assertStatus(200)
            ->assertJsonStructure([
                'report_title',
                'privacy_notice',
                'total_screenings',
                'by_indication_level',
                'by_hypothesis',
            ]);

        $content = $reportRes->getContent();
        // Pastikan tidak ada student_code atau nama siswa dalam payload agregat
        $this->assertStringNotContainsString('DEMO-3A-01', $content);
        $this->assertStringNotContainsString('Faris Maulana', $content);
        $this->assertStringNotContainsString('Aisyah Humaira', $content);
    }
}
