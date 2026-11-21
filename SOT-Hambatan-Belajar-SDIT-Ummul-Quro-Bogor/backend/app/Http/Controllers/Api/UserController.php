<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use App\Models\UserClassAssignment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Get list of all users with their assigned classes.
     */
    public function index(): JsonResponse
    {
        $users = User::with(['classes:classes.id,classes.name,classes.grade_level'])
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'users' => $users,
        ]);
    }

    /**
     * Store new user.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'      => 'required|string|max:150',
            'email'     => 'required|email|max:191|unique:users,email',
            'password'  => 'required|string|min:6',
            'role'      => ['required', Rule::in(['admin', 'guru_bk', 'wali_kelas'])],
            'is_active' => 'boolean',
            'class_id'  => 'nullable|exists:classes,id',
        ]);

        $user = User::create([
            'name'      => $validated['name'],
            'email'     => $validated['email'],
            'password'  => Hash::make($validated['password']),
            'role'      => $validated['role'],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        if ($user->role === 'wali_kelas' && !empty($validated['class_id'])) {
            UserClassAssignment::create([
                'user_id'  => $user->id,
                'class_id' => $validated['class_id'],
            ]);
        }

        AuditLog::record(
            $request->user()->id,
            'CREATE_USER',
            'users',
            $user->id,
            ['name' => $user->name, 'email' => $user->email, 'role' => $user->role],
            $request->ip()
        );

        return response()->json([
            'message' => 'Pengguna berhasil ditambahkan.',
            'user'    => $user->load('classes:classes.id,classes.name,classes.grade_level'),
        ], 201);
    }

    /**
     * Update existing user.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name'      => 'required|string|max:150',
            'email'     => ['required', 'email', 'max:191', Rule::unique('users', 'email')->ignore($user->id)],
            'password'  => 'nullable|string|min:6',
            'role'      => ['required', Rule::in(['admin', 'guru_bk', 'wali_kelas'])],
            'is_active' => 'boolean',
            'class_id'  => 'nullable|exists:classes,id',
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->role = $validated['role'];
        if (isset($validated['is_active'])) {
            $user->is_active = $validated['is_active'];
        }
        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }
        $user->save();

        // Update class assignment jika role wali kelas
        if ($user->role === 'wali_kelas') {
            UserClassAssignment::where('user_id', $user->id)->delete();
            if (!empty($validated['class_id'])) {
                UserClassAssignment::create([
                    'user_id'  => $user->id,
                    'class_id' => $validated['class_id'],
                ]);
            }
        } elseif ($user->role !== 'wali_kelas') {
            UserClassAssignment::where('user_id', $user->id)->delete();
        }

        AuditLog::record(
            $request->user()->id,
            'UPDATE_USER',
            'users',
            $user->id,
            ['name' => $user->name, 'role' => $user->role, 'is_active' => $user->is_active],
            $request->ip()
        );

        return response()->json([
            'message' => 'Data pengguna berhasil diperbarui.',
            'user'    => $user->load('classes:classes.id,classes.name,classes.grade_level'),
        ]);
    }

    /**
     * Delete user.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        // Jangan izinkan admin menghapus akunnya sendiri yang sedang aktif
        if ($request->user()->id === $user->id) {
            return response()->json([
                'message' => 'Anda tidak dapat menghapus akun Anda sendiri saat sedang login.',
            ], 422);
        }

        $userName = $user->name;
        $userRole = $user->role;

        $user->delete();

        AuditLog::record(
            $request->user()->id,
            'DELETE_USER',
            'users',
            $id,
            ['name' => $userName, 'role' => $userRole],
            $request->ip()
        );

        return response()->json([
            'message' => "Pengguna {$userName} berhasil dihapus dari sistem.",
        ]);
    }
}

