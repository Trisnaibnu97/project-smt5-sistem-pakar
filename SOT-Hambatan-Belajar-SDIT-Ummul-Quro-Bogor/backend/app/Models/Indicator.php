<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Indicator extends Model
{
    use HasFactory;

    protected $fillable = [
        'kb_version_id',
        'code',
        'operational_text',
        'observation_guide',
    ];

    public function kbVersion(): BelongsTo
    {
        return $this->belongsTo(KbVersion::class);
    }

    public function cfRules(): HasMany
    {
        return $this->hasMany(CfRule::class);
    }

    public function screeningAnswers(): HasMany
    {
        return $this->hasMany(ScreeningAnswer::class);
    }
}
