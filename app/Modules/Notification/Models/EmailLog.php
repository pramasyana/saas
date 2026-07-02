<?php

namespace App\Modules\Notification\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class EmailLog extends Model
{
    use BelongsToTenant;

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'id',
        'tenant_id',
        'user_id',
        'channel',
        'subject',
        'status',
        'error_message',
        'attempt',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'metadata' => 'array',
            'attempt' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (EmailLog $log) {
            if (empty($log->id)) {
                $log->id = (string) Str::uuid();
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
