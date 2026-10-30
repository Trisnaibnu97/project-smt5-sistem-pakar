<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Screening extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'conducted_by_user_id',
        'kb_version_id',
        'observation_period',
        'status',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function conductedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'conducted_by_user_id');
    }

    public function kbVersion(): BelongsTo
    {
        return $this->belongsTo(KbVersion::class);
    }

    public function answers(): HasMany
    {
        return $this->hasMany(ScreeningAnswer::class);
    }

    public function results(): HasMany
    {
        return $this->hasMany(ScreeningResult::class);
    }

    public function followUps(): HasMany
    {
        return $this->hasMany(FollowUp::class);
    }
}
