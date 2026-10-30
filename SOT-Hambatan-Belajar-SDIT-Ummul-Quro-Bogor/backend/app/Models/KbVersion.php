<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KbVersion extends Model
{
    use HasFactory;

    protected $table = 'kb_versions';

    protected $fillable = [
        'version_code',
        'status',
        'reviewer_name',
        'notes',
        'activated_at',
    ];

    protected function casts(): array
    {
        return [
            'activated_at' => 'datetime',
        ];
    }

    public function hypotheses(): HasMany
    {
        return $this->hasMany(Hypothesis::class);
    }

    public function indicators(): HasMany
    {
        return $this->hasMany(Indicator::class);
    }

    public function screenings(): HasMany
    {
        return $this->hasMany(Screening::class);
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }
}
