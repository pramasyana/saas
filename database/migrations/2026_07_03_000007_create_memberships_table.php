<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('memberships', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('tenant_id');
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->uuid('customer_id');
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');
            $table->uuid('membership_tier_id')->nullable();
            $table->foreign('membership_tier_id')->references('id')->on('membership_tiers')->onDelete('set null');
            $table->integer('points')->default(0);
            $table->decimal('total_spent', 12, 2)->default(0);
            $table->timestamp('joined_at')->nullable();
            $table->timestamp('expired_at')->nullable();
            $table->timestamps();
            $table->index('tenant_id');
            $table->index('customer_id');
            $table->unique('customer_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('memberships');
    }
};
