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
            'nip'      => 'nullable|string|max:50|unique:users,nip',
            'email'    => 'required|email|max:150|unique:users,email',
            'password' => 'required|string|min:6',
            'role'     => 'required|in:admin,guru_bk,wali_kelas',
            'class_id' => 'nullable|exists:classes,id',
        ], [
            'nip.unique' => 'NIP / Nomor Pegawai ini sudah terdaftar pada akun lain.',
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
            'nip'       => !empty($validated['nip']) ? trim($validated['nip']) : null,
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
            'nip'            => $user->nip,
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
                'nip'     => $user->nip,
                'email'   => $user->email,
                'role'    => $user->role,
                'classes' => $user->classes()->select('classes.id', 'classes.name', 'classes.grade_level')->get(),
            ],
            'redirected_to_wali' => $assignedRole !== $requestedRole,
        ], 201);
    }

    /**
     * Authenticate user and issue token.
     * Mendukung login dengan Email ATAU NIP / Nomor Pegawai.
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'login'    => 'required|string',
            'password' => 'required|string',
        ]);

        $loginInput = trim($validated['login']);

        // Cari user berdasarkan email ATAU NIP
        $user = User::where('email', $loginInput)
            ->orWhere('nip', $loginInput)
            ->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'login' => ['Kredensial (Email/NIP atau kata sandi) tidak cocok dengan data kami.'],
            ]);
        }

        if (!$user->is_active) {
            return response()->json([
                'message' => 'Akun pengguna sedang dinonaktifkan.',
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        AuditLog::record($user->id, 'AUTH_LOGIN', 'users', $user->id, [
            'nip'   => $user->nip,
            'email' => $user->email,
            'role'  => $user->role,
        ], $request->ip());

        return response()->json([
            'message' => 'Login berhasil.',
            'token'   => $token,
            'user'    => [
                'id'      => $user->id,
                'name'    => $user->name,
                'nip'     => $user->nip,
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

    /**
     * Perbarui kata sandi baru secara mandiri.
     * Pengguna memverifikasi identitas menggunakan kombinasi Email & NIP (Nomor Pegawai).
     * Jika cocok, sistem langsung mengupdate password ke kata sandi baru.
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email'    => 'required|email|exists:users,email',
            'nip'      => 'nullable|string',
            'password' => 'required|string|min:6|confirmed',
        ], [
            'email.required'     => 'Email terdaftar wajib diisi.',
            'email.email'        => 'Format email tidak valid.',
            'email.exists'       => 'Alamat email tidak terdaftar dalam sistem.',
            'password.required'  => 'Kata sandi baru wajib diisi.',
            'password.min'       => 'Kata sandi baru minimal 6 karakter.',
            'password.confirmed' => 'Konfirmasi kata sandi baru tidak cocok.',
        ]);

        $user = User::where('email', $validated['email'])->firstOrFail();

        // Jika akun memiliki NIP terdaftar, wajib verifikasi NIP
        if (!empty($user->nip)) {
            $inputNip = trim($validated['nip'] ?? '');
            if (empty($inputNip) || strcasecmp($user->nip, $inputNip) !== 0) {
                throw ValidationException::withMessages([
                    'nip' => ['Nomor Induk Pegawai (NIP) tidak cocok dengan akun ini.'],
                ]);
            }
        }

        $user->password = Hash::make($validated['password']);
        $user->save();

        AuditLog::record(
            $user->id,
            'RESET_PASSWORD_CUSTOM',
            'users',
            $user->id,
            [
                'email' => $user->email,
                'nip'   => $user->nip,
            ],
            $request->ip()
        );

        return response()->json([
            'message' => 'Kata sandi Anda berhasil diperbarui! Silakan masuk menggunakan kata sandi baru Anda.',
        ]);
    }
}
