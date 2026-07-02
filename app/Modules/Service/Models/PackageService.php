<?php

declare(strict_types=1);

namespace App\Modules\Service\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PackageService extends Model
{
    protected $table = 'package_service';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'package_id',
        'service_id',
        'quantity',
        'sort_order',
    ];

    protected static function booted(): void
    {
        static::creating(function (PackageService $model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    protected function casts(): array
    {
        return [
            'id' => 'string',
            'quantity' => 'integer',
            'sort_order' => 'integer',
        ];
    }
}
