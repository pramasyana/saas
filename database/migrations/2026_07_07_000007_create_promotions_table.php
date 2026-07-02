<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('promotions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('tenant_id');
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('code')->nullable();
            $table->string('promotion_type');
            $table->decimal('value', 12, 2)->default(0);
            $table->json('conditions')->nullable();
            $table->unsignedInteger('usage_limit')->nullable();
            $table->unsignedInteger('usage_count')->default(0);
            $table->decimal('min_purchase', 12, 2)->nullable();
            $table->decimal('max_discount', 12, 2)->nullable();
            $table->boolean('is_active')->default(true);
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index('tenant_id');
            $table->index('code');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promotions');
    }
};
