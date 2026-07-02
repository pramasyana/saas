<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reward_redemptions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('tenant_id');
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->uuid('customer_id');
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');
            $table->uuid('reward_id');
            $table->foreign('reward_id')->references('id')->on('rewards')->onDelete('cascade');
            $table->integer('points_spent');
            $table->string('status')->default('pending'); // pending / fulfilled / cancelled
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->index('tenant_id');
            $table->index('customer_id');
            $table->index('reward_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reward_redemptions');
    }
};
