<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('referrals', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('tenant_id');
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->uuid('referrer_customer_id');
            $table->foreign('referrer_customer_id')->references('id')->on('customers')->onDelete('cascade');
            $table->string('referred_name')->nullable();
            $table->string('referred_email')->nullable();
            $table->string('code')->unique();
            $table->string('status')->default('pending'); // pending / converted / expired
            $table->boolean('reward_given')->default(false);
            $table->timestamps();
            $table->softDeletes();
            $table->index('tenant_id');
            $table->index('referrer_customer_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('referrals');
    }
};
