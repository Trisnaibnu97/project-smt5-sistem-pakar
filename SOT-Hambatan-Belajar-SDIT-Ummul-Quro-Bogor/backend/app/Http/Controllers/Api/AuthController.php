<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register new user account.
     * Aturan kuota: Role Admin & Guru BK maksimal 2 akun.
     * Jika pendaftar memilih Admin/Guru BK dan kuota >= 2, dialihkan menjadi wali_kelas.
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:100',
            'email'    => 'required|email|max:150|unique:users,email',
            'password' => 'required|string|min:6',
            'role'     => 'required|in:admin,guru_bk,wali_kelas',
            'class_id' => 'nullable|exists:classes,id',
        ]);

        $requestedRole = $validated['role'];
        $assignedRole = $requestedRole;
        $note = null;

        // Cek kuota: Admin & Guru BK maksimal 2 akun
        if (in_array($requestedRole, ['admin', 'guru_bk'])) {
            $existingCount = User::where('role', $requestedRole)->count();
            if ($existingCount >= 2) {
                // Kuota penuh, tolak role tersebut dan alihkan ke wali_kelas
                $assignedRole = 'wali_kelas';
                $roleLabel = ($requestedRole === 'admin') ? 'Admin' : 'Guru BK';
                $note = "Kuota akun {$roleLabel} sudah mencapai batas maksimal (2 akun). Pendaftaran Anda dialihkan sebagai Wali Kelas.";
            }
        }

        $user = User::create([
            'name'      => $validated['name'],
            'email'     => $validated['email'],
            'password'  => Hash::make($validated['password']),
            'role'      => $assignedRole,
            'is_active' => true,
        ]);

        // Jika wali kelas dan memilih kelas, assign kelasnya
        if ($assignedRole === 'wali_kelas' && !empty($validated['class_id'])) {
            \App\Models\UserClassAssignment::firstOrCreate([
                'user_id'  => $user->id,
                'class_id' => $validated['class_id'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        AuditLog::record($user->id, 'AUTH_REGISTER', 'users', $user->id, [
            'name'           => $user->name,
            'email'          => $user->email,
            'requested_role' => $requestedRole,
            'assigned_role'  => $assignedRole,
            'note'           => $note,
        ], $request->ip());

        return response()->json([
            'message' => $note ? $note : 'Registrasi akun berhasil.',
            'token'   => $token,
            'user'    => [
                'id'      => $user->id,
                'name'    => $user->name,
                'email'   => $user->email,
                'role'    => $user->role,
                'classes' => $user->classes()->select('classes.id', 'classes.name', 'classes.grade_level')->get(),
            ],
            'redirected_to_wali' => $assignedRole !== $requestedRole,
        ], 201);
    }

    /**
     * Authenticate user and issue token.
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Kredensial yang diberikan tidak cocok dengan data kami.'],
            ]);
        }

        if (!$user->is_active) {
            return response()->json([
                'message' => 'Akun pengguna sedang dinonaktifkan.',
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        AuditLog::record($user->id, 'AUTH_LOGIN', 'users', $user->id, [
            'email' => $user->email,
            'role'  => $user->role,
        ], $request->ip());

        return response()->json([
            'message' => 'Login berhasil.',
            'token'   => $token,
            'user'    => [
                'id'      => $user->id,
                'name'    => $user->name,
                'email'   => $user->email,
                'role'    => $user->role,
                'classes' => $user->classes()->select('classes.id', 'classes.name', 'classes.grade_level')->get(),
            ],
        ]);
    }

    /**
     * Revoke current token.
     */
    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user) {
            AuditLog::record($user->id, 'AUTH_LOGOUT', 'users', $user->id, null, $request->ip());
            $user->currentAccessToken()->delete();
        }

        return response()->json([
            'message' => 'Logout berhasil.',
        ]);
    }

    /**
     * Get profile of authenticated user.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'user' => [
                'id'      => $user->id,
                'name'    => $user->name,
                'email'   => $user->email,
                'role'    => $user->role,
                'classes' => $user->classes()->select('classes.id', 'classes.name', 'classes.grade_level')->get(),
            ],
        ]);
    }
}
