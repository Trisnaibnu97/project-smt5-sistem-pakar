<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    public function classes(): BelongsToMany
    {
        return $this->belongsToMany(SchoolClass::class, 'user_class_assignments', 'user_id', 'class_id')
            ->withTimestamps();
    }

    public function classAssignments(): HasMany
    {
        return $this->hasMany(UserClassAssignment::class);
    }

    public function screenings(): HasMany
    {
        return $this->hasMany(Screening::class, 'conducted_by_user_id');
    }

    public function followUps(): HasMany
    {
        return $this->hasMany(FollowUp::class, 'created_by_user_id');
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class);
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isGuruBk(): bool
    {
        return $this->role === 'guru_bk';
    }

    public function isWaliKelas(): bool
    {
        return $this->role === 'wali_kelas';
    }

    public function hasAccessToClass(int $classId): bool
    {
        if ($this->isAdmin() || $this->isGuruBk()) {
            return true;
        }

        return $this->classes()->where('classes.id', $classId)->exists();
    }

    public function hasAccessToStudent(Student $student): bool
    {
        return $this->hasAccessToClass($student->class_id);
    }
}
