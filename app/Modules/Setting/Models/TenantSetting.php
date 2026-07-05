<?php

declare(strict_types=1);

namespace App\Modules\Setting\Models;

use Illuminate\Database\Eloquent\Model;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class TenantSetting extends Model
{
    use BelongsToTenant;

    protected $table = 'tenant_settings';

    public $incrementing = false;

    protected $primaryKey = 'key';

    protected $keyType = 'string';

    public $timestamps = true;

    protected $fillable = [
        'key',
        'value',
        'type',
        'group',
        'tenant_id',
    ];

    protected function casts(): array
    {
        return [
            'value' => 'string',
        ];
    }
}
