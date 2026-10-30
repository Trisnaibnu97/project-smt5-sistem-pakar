<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        if (!$user->is_active) {
            return response()->json(['message' => 'Akun Anda dinonaktifkan.'], 403);
        }

        if (!empty($roles) && !in_array($user->role, $roles, true)) {
            return response()->json(['message' => 'Akses ditolak: role tidak memiliki izin.'], 403);
        }

        return $next($request);
    }
}
