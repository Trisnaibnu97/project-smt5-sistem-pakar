<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    /**
     * List audit logs (Admin only).
     */
    public function index(Request $request): JsonResponse
    {
        $logs = AuditLog::with('user:id,name,role,email')
            ->orderByDesc('id')
            ->paginate(25);

        return response()->json($logs);
    }
}
