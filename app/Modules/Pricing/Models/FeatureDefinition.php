<?php

namespace App\Modules\Pricing\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class FeatureDefinition extends Model
{
    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'key',
        'label',
        'description',
        'type',
        'default_value',
        'category',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (FeatureDefinition $feature) {
            if (empty($feature->id)) {
                $feature->id = (string) Str::uuid();
            }
        });
    }
}
