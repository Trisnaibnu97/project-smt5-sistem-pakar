<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ScreeningResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'screening_id',
        'hypothesis_id',
        'final_cf',
        'indication_level',
        'answered_count',
        'total_indicators',
    ];

    protected function casts(): array
    {
        return [
            'final_cf' => 'float',
            'answered_count' => 'integer',
            'total_indicators' => 'integer',
        ];
    }

    public function screening(): BelongsTo
    {
        return $this->belongsTo(Screening::class);
    }

    public function hypothesis(): BelongsTo
    {
        return $this->belongsTo(Hypothesis::class);
    }

    public function traces(): HasMany
    {
        return $this->hasMany(ScreeningResultTrace::class)->orderBy('step_order');
    }
}
