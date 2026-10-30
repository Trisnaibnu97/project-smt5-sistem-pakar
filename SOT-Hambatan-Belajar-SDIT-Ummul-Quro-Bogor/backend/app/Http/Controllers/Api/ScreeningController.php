<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\FollowUp;
use App\Models\KbVersion;
use App\Models\Screening;
use App\Models\ScreeningAnswer;
use App\Models\Student;
use App\Services\CertaintyFactorEngine;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ScreeningController extends Controller
{
    protected CertaintyFactorEngine $cfEngine;

    public function __construct(CertaintyFactorEngine $cfEngine)
    {
        $this->cfEngine = $cfEngine;
    }

    /**
     * List screenings based on user's access scope.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = Screening::with([
            'student.schoolClass',
            'conductedByUser:id,name,role',
            'results.hypothesis',
        ]);

        if ($user->isWaliKelas()) {
            $assignedClassIds = $user->classes()->pluck('classes.id');
            $query->whereHas('student', function ($q) use ($assignedClassIds) {
                $q->whereIn('class_id', $assignedClassIds);
            });
        }

        $screenings = $query->latest()->paginate(15);

        return response()->json($screenings);
    }

    /**
     * Start a new screening session.
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'student_id'         => 'required|exists:students,id',
            'observation_period' => 'required|string|max:50',
        ]);

        $student = Student::findOrFail($validated['student_id']);

        if (!$user->hasAccessToStudent($student)) {
            return response()->json([
                'message' => 'Akses ditolak: Anda tidak memiliki akses untuk membuat skrining siswa ini.',
            ], 403);
        }

        // Get currently active KB version
        $activeKb = KbVersion::where('status', 'active')->first();
        if (!$activeKb) {
            return response()->json([
                'message' => 'Belum ada versi basis pengetahuan yang aktif disetujui.',
            ], 422);
        }

        $screening = Screening::create([
            'student_id'           => $student->id,
            'conducted_by_user_id' => $user->id,
            'kb_version_id'        => $activeKb->id,
            'observation_period'   => $validated['observation_period'],
            'status'               => 'draft',
        ]);

        AuditLog::record($user->id, 'CREATE_SCREENING', 'screenings', $screening->id, [
            'student_id'         => $student->id,
            'kb_version_id'      => $activeKb->id,
            'observation_period' => $validated['observation_period'],
        ], $request->ip());

        return response()->json([
            'message'   => 'Sesi skrining berhasil dibuat.',
            'screening' => $screening->load(['student.schoolClass', 'kbVersion']),
        ], 201);
    }

    /**
     * Save/update answers for indicators in this screening.
     */
    public function saveAnswers(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $screening = Screening::with('student')->findOrFail($id);

        if (!$user->hasAccessToStudent($screening->student)) {
            return response()->json([
                'message' => 'Akses ditolak: Anda tidak memiliki wewenang untuk mengisi observasi ini.',
            ], 403);
        }

        $validated = $request->validate([
            'answers'                 => 'required|array|min:1',
            'answers.*.indicator_id'  => 'required|exists:indicators,id',
            'answers.*.answer_value'  => 'required|in:tidak-pernah,jarang,kadang,sering,selalu,belum',
        ]);

        foreach ($validated['answers'] as $item) {
            $cfUser = CertaintyFactorEngine::mapAnswerToCfUser($item['answer_value']);

            ScreeningAnswer::updateOrCreate(
                [
                    'screening_id' => $screening->id,
                    'indicator_id' => $item['indicator_id'],
                ],
                [
                    'answer_value' => $item['answer_value'],
                    'cf_user'      => $cfUser,
                ]
            );
        }

        return response()->json([
            'message' => 'Jawaban observasi berhasil disimpan.',
            'count'   => count($validated['answers']),
        ]);
    }

    /**
     * Execute Certainty Factor inference engine calculation.
     */
    public function calculate(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $screening = Screening::with(['student', 'kbVersion'])->findOrFail($id);

        if (!$user->hasAccessToStudent($screening->student)) {
            return response()->json([
                'message' => 'Akses ditolak: Anda tidak memiliki akses untuk menghitung hasil skrining ini.',
            ], 403);
        }

        $results = $this->cfEngine->calculateScreening($screening);

        $screening->update(['status' => 'submitted']);

        AuditLog::record($user->id, 'CALCULATE_CF', 'screenings', $screening->id, [
            'results_count' => $results->count(),
        ], $request->ip());

        return response()->json([
            'message'    => 'Kalkulasi Certainty Factor berhasil diselesaikan.',
            'screening'  => $screening->load('student.schoolClass'),
            'results'    => $results,
            'disclaimer' => 'Hasil ini adalah indikasi awal pendukung keputusan observasi edukatif, BUKAN diagnosis medis atau psikologis klinis.',
        ]);
    }

    /**
     * Get detailed result of screening with audit traces.
     */
    public function showResult(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $screening = Screening::with([
            'student.schoolClass',
            'conductedByUser:id,name,role',
            'kbVersion',
            'results.hypothesis',
            'results.traces.cfRule.indicator',
            'followUps.createdByUser:id,name,role',
            'answers.indicator',
        ])->findOrFail($id);

        if (!$user->hasAccessToStudent($screening->student)) {
            return response()->json([
                'message' => 'Akses ditolak: Anda tidak berwenang melihat hasil skrining siswa ini.',
            ], 403);
        }

        return response()->json([
            'screening'  => $screening,
            'disclaimer' => 'Hasil ini adalah indikasi awal pendukung keputusan observasi edukatif, BUKAN diagnosis medis atau psikologis klinis.',
        ]);
    }

    /**
     * Review screening status (by BK or authorized teacher).
     */
    public function review(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $screening = Screening::with('student')->findOrFail($id);

        if (!$user->hasAccessToStudent($screening->student)) {
            return response()->json([
                'message' => 'Akses ditolak: Anda tidak berwenang meninjau hasil skrining siswa ini.',
            ], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:reviewed,completed',
            'notes'  => 'nullable|string',
        ]);

        $screening->update(['status' => $validated['status']]);

        AuditLog::record($user->id, 'REVIEW_SCREENING', 'screenings', $screening->id, [
            'status' => $validated['status'],
            'notes'  => $validated['notes'] ?? null,
        ], $request->ip());

        return response()->json([
            'message'   => 'Status skrining berhasil diperbarui.',
            'screening' => $screening,
        ]);
    }

    /**
     * Add educational follow up note.
     */
    public function addFollowUp(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $screening = Screening::with('student')->findOrFail($id);

        if (!$user->hasAccessToStudent($screening->student)) {
            return response()->json([
                'message' => 'Akses ditolak: Anda tidak berwenang menambahkan tindak lanjut.',
            ], 403);
        }

        $validated = $request->validate([
            'action_type' => 'required|in:observasi_lanjutan,diferensiasi_pembelajaran,diskusi_internal,rujukan_ahli',
            'status'      => 'nullable|in:menunggu,berjalan,selesai',
            'review_date' => 'nullable|date',
            'notes'       => 'required|string',
        ]);

        $followUp = FollowUp::create([
            'screening_id'       => $screening->id,
            'created_by_user_id' => $user->id,
            'action_type'        => $validated['action_type'],
            'status'             => $validated['status'] ?? 'menunggu',
            'review_date'        => $validated['review_date'] ?? null,
            'notes'              => $validated['notes'],
        ]);

        AuditLog::record($user->id, 'ADD_FOLLOW_UP', 'follow_ups', $followUp->id, [
            'screening_id' => $screening->id,
            'action_type'  => $followUp->action_type,
        ], $request->ip());

        return response()->json([
            'message'   => 'Rencana tindak lanjut berhasil ditambahkan.',
            'follow_up' => $followUp->load('createdByUser:id,name,role'),
        ], 201);
    }
}
