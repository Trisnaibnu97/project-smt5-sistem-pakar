<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScreeningAnswer extends Model
{
    use HasFactory;

    protected $fillable = [
        'screening_id',
        'indicator_id',
        'answer_value',
        'cf_user',
    ];

    protected function casts(): array
    {
        return [
            'cf_user' => 'float',
        ];
    }

    public function screening(): BelongsTo
    {
        return $this->belongsTo(Screening::class);
    }

    public function indicator(): BelongsTo
    {
        return $this->belongsTo(Indicator::class);
    }
}
