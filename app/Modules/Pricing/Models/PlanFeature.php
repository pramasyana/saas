<?php

namespace App\Modules\Pricing\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class PlanFeature extends Model
{
    protected $table = 'plan_feature';

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'plan_id',
        'feature_definition_id',
        'value',
    ];

    protected static function booted(): void
    {
        static::creating(function (PlanFeature $planFeature) {
            if (empty($planFeature->id)) {
                $planFeature->id = (string) Str::uuid();
            }
        });
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    public function definition(): BelongsTo
    {
        return $this->belongsTo(FeatureDefinition::class, 'feature_definition_id');
    }
}
