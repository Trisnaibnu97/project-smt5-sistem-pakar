<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Hypothesis extends Model
{
    use HasFactory;

    protected $fillable = [
        'kb_version_id',
        'code',
        'name',
        'description',
    ];

    public function kbVersion(): BelongsTo
    {
        return $this->belongsTo(KbVersion::class);
    }

    public function cfRules(): HasMany
    {
        return $this->hasMany(CfRule::class);
    }

    public function screeningResults(): HasMany
    {
        return $this->hasMany(ScreeningResult::class);
    }
}
