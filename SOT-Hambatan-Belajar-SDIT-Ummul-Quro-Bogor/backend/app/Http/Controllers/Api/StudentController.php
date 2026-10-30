<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    /**
     * Show student profile and screening history.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $student = Student::with('schoolClass')->findOrFail($id);

        if (!$user->hasAccessToStudent($student)) {
            return response()->json([
                'message' => 'Akses ditolak: Anda tidak memiliki akses ke siswa di kelas ini.',
            ], 403);
        }

        $screenings = $student->screenings()
            ->with(['conductedByUser:id,name,role', 'results.hypothesis'])
            ->latest()
            ->get();

        return response()->json([
            'student'    => $student,
            'screenings' => $screenings,
        ]);
    }
}
