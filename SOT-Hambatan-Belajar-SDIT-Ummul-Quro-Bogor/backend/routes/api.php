<?php

use App\Http\Controllers\Api\AuditLogController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClassController;
use App\Http\Controllers\Api\KnowledgeBaseController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\ScreeningController;
use App\Http\Controllers\Api\StudentController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — Sistem Pakar Hambatan Belajar SDIT Ummul Quro Bogor
|--------------------------------------------------------------------------
*/

// Public Authentication Routes & Class List for Registration
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::get('/public/classes', function () {
    return response()->json([
        'classes' => \App\Models\SchoolClass::orderBy('grade_level')->orderBy('name')->get(),
    ]);
});

// Authenticated Routes (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    // Auth & Profile
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Classes & Students (Scoped per role)
    Route::get('/classes/mine', [ClassController::class, 'mine']);
    Route::get('/classes/{classId}/students', [ClassController::class, 'students']);
    Route::get('/students/{id}', [StudentController::class, 'show']);

    // Screenings & CF Inference Engine
    Route::get('/screenings', [ScreeningController::class, 'index']);
    Route::post('/screenings', [ScreeningController::class, 'store']);
    Route::post('/screenings/{id}/answers', [ScreeningController::class, 'saveAnswers']);
    Route::post('/screenings/{id}/calculate', [ScreeningController::class, 'calculate']);
    Route::get('/screenings/{id}/result', [ScreeningController::class, 'showResult']);
    Route::post('/screenings/{id}/review', [ScreeningController::class, 'review']);
    Route::post('/screenings/{id}/follow-ups', [ScreeningController::class, 'addFollowUp']);

    // Active Knowledge Base (Read-only for all authenticated teachers)
    Route::get('/kb/active', [KnowledgeBaseController::class, 'getActive']);

    // Aggregate Reports (Privacy-first)
    Route::get('/reports/aggregate', [ReportController::class, 'aggregate']);

    // Admin & Guru BK - Knowledge Base Review & Management (CRUD)
    Route::middleware('role:admin,guru_bk')->group(function () {
        Route::get('/admin/kb-versions', [KnowledgeBaseController::class, 'indexVersions']);
        Route::post('/admin/kb-versions', [KnowledgeBaseController::class, 'storeVersion']);
        Route::post('/admin/kb-versions/{id}/activate', [KnowledgeBaseController::class, 'activateVersion']);
        Route::post('/admin/hypotheses', [KnowledgeBaseController::class, 'storeHypothesis']);
        Route::put('/admin/hypotheses/{id}', [KnowledgeBaseController::class, 'updateHypothesis']);
        Route::delete('/admin/hypotheses/{id}', [KnowledgeBaseController::class, 'deleteHypothesis']);
        Route::post('/admin/indicators', [KnowledgeBaseController::class, 'storeIndicator']);
        Route::put('/admin/indicators/{id}', [KnowledgeBaseController::class, 'updateIndicator']);
        Route::delete('/admin/indicators/{id}', [KnowledgeBaseController::class, 'deleteIndicator']);
        Route::post('/admin/cf-rules', [KnowledgeBaseController::class, 'storeRule']);
        Route::put('/admin/cf-rules/{id}', [KnowledgeBaseController::class, 'updateRule']);
        Route::delete('/admin/cf-rules/{id}', [KnowledgeBaseController::class, 'deleteRule']);
    });

    // Admin Only - Audit Logs
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/audit-logs', [AuditLogController::class, 'index']);
    });
});
