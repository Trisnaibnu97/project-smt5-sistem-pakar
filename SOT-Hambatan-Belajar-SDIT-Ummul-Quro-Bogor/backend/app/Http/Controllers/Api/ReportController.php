<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Hypothesis;
use App\Models\SchoolClass;
use App\Models\Screening;
use App\Models\ScreeningResult;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    /**
     * Get aggregated distribution report without exposing student rankings.
     */
    public function aggregate(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = ScreeningResult::query()
            ->join('screenings', 'screening_results.screening_id', '=', 'screenings.id')
            ->join('students', 'screenings.student_id', '=', 'students.id')
            ->join('classes', 'students.class_id', '=', 'classes.id')
            ->join('hypotheses', 'screening_results.hypothesis_id', '=', 'hypotheses.id');

        // Scoping for Wali Kelas
        if ($user->isWaliKelas()) {
            $assignedClassIds = $user->classes()->pluck('classes.id')->toArray();
            $query->whereIn('classes.id', $assignedClassIds);
        }

        // Summary counts by indication level
        $byIndicationLevel = (clone $query)
            ->select('screening_results.indication_level', DB::raw('count(*) as total'))
            ->groupBy('screening_results.indication_level')
            ->get();

        // Breakdown by hypothesis and level
        $byHypothesis = (clone $query)
            ->select(
                'hypotheses.code as hypothesis_code',
                'hypotheses.name as hypothesis_name',
                'screening_results.indication_level',
                DB::raw('count(*) as count')
            )
            ->groupBy('hypotheses.code', 'hypotheses.name', 'screening_results.indication_level')
            ->get();

        // Total screenings count
        $totalScreenings = Screening::count();

        return response()->json([
            'report_title'         => 'Laporan Agregat Distribusi Hambatan Belajar SDIT Ummul Quro Bogor',
            'privacy_notice'       => 'Data disajikan dalam bentuk agregat statistik terproteksi tanpa identitas individual.',
            'total_screenings'     => $totalScreenings,
            'by_indication_level'  => $byIndicationLevel,
            'by_hypothesis'        => $byHypothesis,
        ]);
    }
}
