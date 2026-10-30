<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CfRule extends Model
{
    use HasFactory;

    protected $fillable = [
        'hypothesis_id',
        'indicator_id',
        'expert_mb',
        'expert_md',
        'expert_cf',
    ];

    protected function casts(): array
    {
        return [
            'expert_mb' => 'float',
            'expert_md' => 'float',
            'expert_cf' => 'float',
        ];
    }

    public function hypothesis(): BelongsTo
    {
        return $this->belongsTo(Hypothesis::class);
    }

    public function indicator(): BelongsTo
    {
        return $this->belongsTo(Indicator::class);
    }

    public function traces(): HasMany
    {
        return $this->hasMany(ScreeningResultTrace::class);
    }
}
