<?php

declare(strict_types=1);

namespace App\Modules\Company\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class CompanyBranding extends Model
{
    use BelongsToTenant;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $table = 'company_branding';

    protected $fillable = [
        'tenant_id',
        'primary_color',
        'secondary_color',
        'favicon_path',
        'custom_css',
    ];

    protected static function booted(): void
    {
        static::creating(function (CompanyBranding $model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'id' => 'string',
        ];
    }
}
