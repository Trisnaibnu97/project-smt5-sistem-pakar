<?php

namespace Tests\Feature;

use App\Models\Indicator;
use App\Models\KbVersion;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ScreeningWorkflowApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_complete_screening_workflow_via_api(): void
    {
        $wali3a = User::where('email', 'wali3a@sdit-uq.sch.id')->firstOrFail();
        $guruBk = User::where('email', 'bk@sdit-uq.sch.id')->firstOrFail();

        // Faris Maulana (Class 3A)
        $student = Student::where('student_code', 'DEMO-3A-01')->firstOrFail();
        $kbVersion = KbVersion::where('status', 'active')->firstOrFail();
        $indicators = Indicator::where('kb_version_id', $kbVersion->id)->get();

        // 1. Wali 3A starts screening session
        $startRes = $this->actingAs($wali3a)->postJson('/api/screenings', [
            'student_id'         => $student->id,
            'observation_period' => 'Oktober 2026',
        ]);

        $startRes->assertStatus(201)
            ->assertJsonStructure(['message', 'screening' => ['id', 'student_id', 'status']]);

        $screeningId = $startRes->json('screening.id');

        // 2. Wali 3A saves observation answers (Literacy symptoms)
        $answersPayload = [];
        foreach ($indicators as $ind) {
            $value = 'tidak-pernah';
            if (in_array($ind->code, ['I01', 'I02', 'I03', 'I04'])) {
                $value = ($ind->code === 'I01') ? 'selalu' : 'sering';
            }
            $answersPayload[] = [
                'indicator_id' => $ind->id,
                'answer_value' => $value,
            ];
        }

        $answersRes = $this->actingAs($wali3a)->postJson("/api/screenings/{$screeningId}/answers", [
            'answers' => $answersPayload,
        ]);

        $answersRes->assertStatus(200)
            ->assertJson(['count' => 15]);

        // 3. Wali 3A triggers CF calculation
        $calcRes = $this->actingAs($wali3a)->postJson("/api/screenings/{$screeningId}/calculate");

        $calcRes->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'screening',
                'results',
                'disclaimer',
            ]);

        $results = collect($calcRes->json('results'));
        $h01Result = $results->firstWhere('hypothesis.code', 'H01');
        $this->assertNotNull($h01Result);
        $this->assertEquals('kuat', $h01Result['indication_level']);
        $this->assertGreaterThanOrEqual(0.90, $h01Result['final_cf']);

        // 4. Show result with traces and disclaimers
        $resultRes = $this->actingAs($wali3a)->getJson("/api/screenings/{$screeningId}/result");
        $resultRes->assertStatus(200)
            ->assertJsonStructure([
                'screening' => [
                    'id',
                    'student',
                    'results' => [
                        '*' => ['hypothesis', 'traces']
                    ]
                ],
                'disclaimer'
            ]);

        // 5. Guru BK adds follow-up recommendation
        $followUpRes = $this->actingAs($guruBk)->postJson("/api/screenings/{$screeningId}/follow-ups", [
            'action_type' => 'diferensiasi_pembelajaran',
            'status'      => 'berjalan',
            'review_date' => '2026-11-15',
            'notes'       => 'Diberikan pendampingan membaca fonemik terbimbing 15 menit setiap pagi sebelum KBM dimulai.',
        ]);

        $followUpRes->assertStatus(201)
            ->assertJsonStructure(['message', 'follow_up' => ['id', 'action_type', 'notes']]);

        // 6. Guru BK marks screening as reviewed
        $reviewRes = $this->actingAs($guruBk)->postJson("/api/screenings/{$screeningId}/review", [
            'status' => 'reviewed',
            'notes'  => 'Hasil skrining telah diverifikasi bersama wali kelas.',
        ]);

        $reviewRes->assertStatus(200)
            ->assertJson(['screening' => ['status' => 'reviewed']]);

        // 7. View aggregate report
        $reportRes = $this->actingAs($guruBk)->getJson('/api/reports/aggregate');
        $reportRes->assertStatus(200)
            ->assertJsonStructure([
                'report_title',
                'privacy_notice',
                'total_screenings',
                'by_indication_level',
                'by_hypothesis',
            ]);
    }
}
