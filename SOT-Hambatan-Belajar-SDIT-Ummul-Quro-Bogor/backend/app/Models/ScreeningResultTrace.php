<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScreeningResultTrace extends Model
{
    use HasFactory;

    protected $fillable = [
        'screening_result_id',
        'cf_rule_id',
        'cf_user',
        'cf_expert',
        'cf_evidence',
        'step_order',
        'running_cf',
    ];

    protected function casts(): array
    {
        return [
            'cf_user' => 'float',
            'cf_expert' => 'float',
            'cf_evidence' => 'float',
            'step_order' => 'integer',
            'running_cf' => 'float',
        ];
    }

    public function screeningResult(): BelongsTo
    {
        return $this->belongsTo(ScreeningResult::class);
    }

    public function cfRule(): BelongsTo
    {
        return $this->belongsTo(CfRule::class);
    }
}
