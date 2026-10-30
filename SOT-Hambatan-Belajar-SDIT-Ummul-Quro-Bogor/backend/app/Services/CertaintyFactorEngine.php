<?php

namespace App\Services;

use App\Models\CfRule;
use App\Models\Hypothesis;
use App\Models\Screening;
use App\Models\ScreeningAnswer;
use App\Models\ScreeningResult;
use App\Models\ScreeningResultTrace;
use Illuminate\Support\Collection;

class CertaintyFactorEngine
{
    /**
     * Answer value to CF User mapping according to Phase 2 SOT.
     */
    public const ANSWER_WEIGHTS = [
        'tidak-pernah' => 0.00,
        'jarang'       => 0.25,
        'kadang'       => 0.50,
        'sering'       => 0.75,
        'selalu'       => 1.00,
        'belum'        => null,
    ];

    /**
     * Map string answer to numeric CF user value.
     */
    public static function mapAnswerToCfUser(?string $answer): ?float
    {
        if ($answer === null || !array_key_exists($answer, self::ANSWER_WEIGHTS)) {
            return null;
        }

        return self::ANSWER_WEIGHTS[$answer];
    }

    /**
     * Calculate CF for a screening session and persist results & traces.
     */
    public function calculateScreening(Screening $screening): Collection
    {
        // Load KB version hypotheses with rules and indicators
        $kbVersion = $screening->kbVersion()->with(['hypotheses.cfRules.indicator'])->firstOrFail();

        // Get all answers mapped by indicator_id
        $answers = $screening->answers()->get()->keyBy('indicator_id');

        // Delete any existing results and traces for idempotency
        $screening->results()->delete();

        $results = collect();

        foreach ($kbVersion->hypotheses as $hypothesis) {
            $rules = $hypothesis->cfRules()->orderBy('id')->get();
            $totalIndicators = $rules->count();
            $answeredCount = 0;
            $validEvidences = [];

            foreach ($rules as $rule) {
                /** @var ScreeningAnswer|null $answer */
                $answer = $answers->get($rule->indicator_id);
                $cfUser = $answer ? $answer->cf_user : null;

                // Only evaluate if answered and not 'belum' (cf_user is not null)
                if ($cfUser !== null) {
                    $answeredCount++;
                    $cfExpert = (float) $rule->expert_cf;
                    $cfEvidence = (float) ($cfUser * $cfExpert);

                    $validEvidences[] = [
                        'rule'        => $rule,
                        'cf_user'     => (float) $cfUser,
                        'cf_expert'   => $cfExpert,
                        'cf_evidence' => $cfEvidence,
                    ];
                }
            }

            // Completeness check (< 50% answered is insufficient data)
            $isDataSufficient = ($totalIndicators > 0) && (($answeredCount / $totalIndicators) >= 0.50);

            $finalCf = null;
            $indicationLevel = 'belum_cukup_data';
            $stepTraces = [];

            if ($answeredCount > 0) {
                $runningCf = 0.0;
                $stepOrder = 1;

                foreach ($validEvidences as $index => $item) {
                    $cfEvidence = $item['cf_evidence'];

                    if ($index === 0) {
                        $runningCf = $cfEvidence;
                    } else {
                        // Formula: CFcombine = CF1 + CF2 * (1 - CF1)
                        $runningCf = $runningCf + ($cfEvidence * (1.0 - $runningCf));
                    }

                    // Constrain within [0.0, 1.0]
                    $runningCf = max(0.0, min(1.0, $runningCf));

                    $stepTraces[] = [
                        'cf_rule_id'  => $item['rule']->id,
                        'cf_user'     => round($item['cf_user'], 3),
                        'cf_expert'   => round($item['cf_expert'], 3),
                        'cf_evidence' => round($item['cf_evidence'], 3),
                        'step_order'  => $stepOrder++,
                        'running_cf'  => round($runningCf, 3),
                    ];
                }

                $finalCf = round($runningCf, 3);
            }

            // Determine Indication Level based on Thresholds & Completeness
            if (!$isDataSufficient || $finalCf === null) {
                $indicationLevel = 'belum_cukup_data';
            } elseif ($finalCf < 0.25) {
                $indicationLevel = 'rendah';
            } elseif ($finalCf <= 0.54) {
                $indicationLevel = 'sedang';
            } else {
                $indicationLevel = 'kuat';
            }

            // Create screening result record
            $screeningResult = ScreeningResult::create([
                'screening_id'     => $screening->id,
                'hypothesis_id'    => $hypothesis->id,
                'final_cf'         => $finalCf,
                'indication_level' => $indicationLevel,
                'answered_count'   => $answeredCount,
                'total_indicators' => $totalIndicators,
            ]);

            // Save trace logs
            foreach ($stepTraces as $trace) {
                ScreeningResultTrace::create([
                    'screening_result_id' => $screeningResult->id,
                    'cf_rule_id'          => $trace['cf_rule_id'],
                    'cf_user'             => $trace['cf_user'],
                    'cf_expert'           => $trace['cf_expert'],
                    'cf_evidence'         => $trace['cf_evidence'],
                    'step_order'          => $trace['step_order'],
                    'running_cf'          => $trace['running_cf'],
                ]);
            }

            $results->push($screeningResult->load(['hypothesis', 'traces.cfRule.indicator']));
        }

        return $results;
    }
}
