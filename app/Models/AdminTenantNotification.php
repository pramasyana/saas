<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class AdminTenantNotification extends Model
{
    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'title',
        'message',
        'type',
        'is_active',
        'target_type',
        'target_tenant_ids',
        'read_by',
        'active_from',
        'active_until',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'target_tenant_ids' => 'array',
            'read_by' => 'array',
            'active_from' => 'datetime',
            'active_until' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (self $model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('active_from')
                  ->orWhere('active_from', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('active_until')
                  ->orWhere('active_until', '>=', now());
            });
    }

    public function scopeForTenant($query, string $tenantId)
    {
        return $query->where(function ($q) use ($tenantId) {
            $q->where('target_type', 'all')
              ->orWhere(function ($sub) use ($tenantId) {
                  $sub->where('target_type', 'specific')
                      ->whereJsonContains('target_tenant_ids', $tenantId);
              });
        });
    }
}
