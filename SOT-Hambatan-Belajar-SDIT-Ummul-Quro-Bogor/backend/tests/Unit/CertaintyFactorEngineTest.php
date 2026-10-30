<?php

namespace Tests\Unit;

use App\Models\Indicator;
use App\Models\KbVersion;
use App\Models\SchoolClass;
use App\Models\Screening;
use App\Models\ScreeningAnswer;
use App\Models\Student;
use App\Models\User;
use App\Services\CertaintyFactorEngine;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CertaintyFactorEngineTest extends TestCase
{
    use RefreshDatabase;

    protected CertaintyFactorEngine $engine;
    protected KbVersion $kbVersion;
    protected Student $student;
    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);

        $this->engine = new CertaintyFactorEngine();
        $this->kbVersion = KbVersion::where('status', 'active')->firstOrFail();
        $this->student = Student::firstOrFail();
        $this->user = User::firstOrFail();
    }

    /**
     * Helper to create a screening with given answer map.
     *
     * @param array<string, string> $answers [ 'I01' => 'selalu', ... ]
     */
    private function createScreeningWithAnswers(array $answers): Screening
    {
        $screening = Screening::create([
            'student_id'           => $this->student->id,
            'conducted_by_user_id' => $this->user->id,
            'kb_version_id'        => $this->kbVersion->id,
            'observation_period'   => 'Oktober 2026',
            'status'               => 'draft',
        ]);

        $indicators = Indicator::where('kb_version_id', $this->kbVersion->id)->get()->keyBy('code');

        foreach ($answers as $code => $value) {
            if (isset($indicators[$code])) {
                ScreeningAnswer::create([
                    'screening_id' => $screening->id,
                    'indicator_id' => $indicators[$code]->id,
                    'answer_value' => $value,
                    'cf_user'      => CertaintyFactorEngine::mapAnswerToCfUser($value),
                ]);
            }
        }

        return $screening;
    }

    /**
     * TC-01: Dominant Literacy & Reading (H01 Strong CF ~0.95).
     */
    public function test_tc01_dominant_literacy_strong_cf(): void
    {
        $answers = [
            'I01' => 'selalu', // 1.0
            'I02' => 'sering', // 0.75
            'I03' => 'sering', // 0.75
            'I04' => 'sering', // 0.75
            // Other indicators jarang (0.25) or tidak pernah
            'I05' => 'jarang',
            'I06' => 'tidak-pernah',
            'I07' => 'tidak-pernah',
            'I08' => 'tidak-pernah',
            'I09' => 'tidak-pernah',
            'I10' => 'tidak-pernah',
            'I11' => 'tidak-pernah',
            'I12' => 'tidak-pernah',
            'I13' => 'tidak-pernah',
            'I14' => 'tidak-pernah',
            'I15' => 'tidak-pernah',
        ];

        $screening = $this->createScreeningWithAnswers($answers);
        $results = $this->engine->calculateScreening($screening)->keyBy('hypothesis.code');

        $h01 = $results->get('H01');
        $this->assertNotNull($h01);
        $this->assertEquals('kuat', $h01->indication_level);
        $this->assertGreaterThanOrEqual(0.90, $h01->final_cf);
        $this->assertLessThanOrEqual(1.00, $h01->final_cf);

        // Verify traces were created
        $this->assertCount(4, $h01->traces);
        $this->assertEquals(1, $h01->traces[0]->step_order);
        $this->assertEquals(4, $h01->traces[3]->step_order);

        // H02, H03, H04 should be rendah
        $this->assertEquals('rendah', $results->get('H02')->indication_level);
        $this->assertEquals('rendah', $results->get('H03')->indication_level);
        $this->assertEquals('rendah', $results->get('H04')->indication_level);
    }

    /**
     * TC-02: Dominant Numeracy & Math (H02 Strong CF ~0.93).
     */
    public function test_tc02_dominant_numeracy_strong_cf(): void
    {
        $answers = [
            'I01' => 'tidak-pernah',
            'I02' => 'tidak-pernah',
            'I03' => 'tidak-pernah',
            'I04' => 'tidak-pernah',
            'I05' => 'selalu', // 1.0 * 0.70 = 0.70
            'I06' => 'sering', // 0.75 * 0.60 = 0.45
            'I07' => 'sering', // 0.75 * 0.45 = 0.3375
            'I08' => 'sering', // 0.75 * 0.55 = 0.4125
            'I09' => 'tidak-pernah',
            'I10' => 'tidak-pernah',
            'I11' => 'tidak-pernah',
            'I12' => 'tidak-pernah',
            'I13' => 'tidak-pernah',
            'I14' => 'tidak-pernah',
            'I15' => 'tidak-pernah',
        ];

        $screening = $this->createScreeningWithAnswers($answers);
        $results = $this->engine->calculateScreening($screening)->keyBy('hypothesis.code');

        $h02 = $results->get('H02');
        $this->assertNotNull($h02);
        $this->assertEquals('kuat', $h02->indication_level);
        $this->assertGreaterThanOrEqual(0.90, $h02->final_cf);
        $this->assertEquals('rendah', $results->get('H01')->indication_level);
    }

    /**
     * TC-05: Typical learning progression (all "tidak pernah" = 0.00).
     */
    public function test_tc05_all_never_yields_zero_cf(): void
    {
        $answers = [];
        for ($i = 1; $i <= 15; $i++) {
            $code = sprintf('I%02d', $i);
            $answers[$code] = 'tidak-pernah';
        }

        $screening = $this->createScreeningWithAnswers($answers);
        $results = $this->engine->calculateScreening($screening);

        foreach ($results as $res) {
            $this->assertEquals(0.00, $res->final_cf);
            $this->assertEquals('rendah', $res->indication_level);
        }
    }

    /**
     * TC-06: All "belum diamati" yields "belum_cukup_data" (insufficient data).
     */
    public function test_tc06_all_unobserved_yields_insufficient_data(): void
    {
        $answers = [];
        for ($i = 1; $i <= 15; $i++) {
            $code = sprintf('I%02d', $i);
            $answers[$code] = 'belum';
        }

        $screening = $this->createScreeningWithAnswers($answers);
        $results = $this->engine->calculateScreening($screening);

        foreach ($results as $res) {
            $this->assertNull($res->final_cf);
            $this->assertEquals('belum_cukup_data', $res->indication_level);
            $this->assertEquals(0, $res->answered_count);
        }
    }

    /**
     * TC-07: Incomplete observations (< 50% answered) yields "belum_cukup_data".
     */
    public function test_tc07_under_50_percent_answered_yields_insufficient_data(): void
    {
        // For H01 (4 indicators: I01-I04), only 1 answered (25% < 50%)
        $answers = [
            'I01' => 'belum',
            'I02' => 'belum',
            'I03' => 'belum',
            'I04' => 'jarang', // 0.25
        ];

        $screening = $this->createScreeningWithAnswers($answers);
        $results = $this->engine->calculateScreening($screening)->keyBy('hypothesis.code');

        $h01 = $results->get('H01');
        $this->assertEquals('belum_cukup_data', $h01->indication_level);
        $this->assertEquals(1, $h01->answered_count);
        $this->assertEquals(4, $h01->total_indicators);
    }
}
