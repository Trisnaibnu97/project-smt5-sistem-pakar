<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditLog extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'action',
        'entity_name',
        'entity_id',
        'details',
        'ip_address',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'details' => 'array',
            'created_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function record(?int $userId, string $action, string $entityName, ?int $entityId = null, ?array $details = null, ?string $ipAddress = null): self
    {
        return self::create([
            'user_id' => $userId,
            'action' => $action,
            'entity_name' => $entityName,
            'entity_id' => $entityId,
            'details' => $details,
            'ip_address' => $ipAddress,
            'created_at' => now(),
        ]);
    }
}
