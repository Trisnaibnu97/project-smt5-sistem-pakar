<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SchoolClass extends Model
{
    use HasFactory;

    protected $table = 'classes';

    protected $fillable = [
        'grade_level',
        'name',
        'academic_year',
    ];

    protected function casts(): array
    {
        return [
            'grade_level' => 'integer',
        ];
    }

    public function teachers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_class_assignments', 'class_id', 'user_id')
            ->withTimestamps();
    }

    public function students(): HasMany
    {
        return $this->hasMany(Student::class, 'class_id');
    }
}
