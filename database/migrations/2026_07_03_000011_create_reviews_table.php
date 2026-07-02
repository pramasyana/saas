<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('tenant_id');
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->uuid('customer_id');
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');
            $table->string('reviewable_type');
            $table->string('reviewable_id');
            $table->uuid('staff_id')->nullable();
            $table->foreign('staff_id')->references('id')->on('staff')->onDelete('set null');
            $table->tinyInteger('rating');
            $table->string('title')->nullable();
            $table->text('content')->nullable();
            $table->boolean('is_approved')->default(false);
            $table->timestamps();
            $table->index('tenant_id');
            $table->index('customer_id');
            $table->index(['reviewable_type', 'reviewable_id']);
            $table->index('staff_id');
            $table->index('is_approved');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
