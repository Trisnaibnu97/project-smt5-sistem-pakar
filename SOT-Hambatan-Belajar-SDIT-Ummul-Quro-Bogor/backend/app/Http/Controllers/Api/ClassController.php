<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SchoolClass;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClassController extends Controller
{
    /**
     * Get list of accessible classes for the current user.
     */
    public function mine(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->isAdmin() || $user->isGuruBk()) {
            $classes = SchoolClass::withCount('students')->orderBy('grade_level')->orderBy('name')->get();
        } else {
            $classes = $user->classes()->withCount('students')->orderBy('grade_level')->orderBy('name')->get();
        }

        return response()->json([
            'classes' => $classes,
        ]);
    }

    /**
     * Get students in a specific class.
     */
    public function students(Request $request, int $classId): JsonResponse
    {
        $user = $request->user();

        if (!$user->hasAccessToClass($classId)) {
            return response()->json([
                'message' => 'Akses ditolak: Anda tidak ditugaskan pada kelas ini.',
            ], 403);
        }

        $class = SchoolClass::findOrFail($classId);
        $students = $class->students()->where('is_active', true)->orderBy('name')->get();

        return response()->json([
            'class'    => $class,
            'students' => $students,
        ]);
    }
}
