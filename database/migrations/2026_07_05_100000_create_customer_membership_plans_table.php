<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customer_membership_plans', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('tenant_id');
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 12, 2);
            $table->string('billing_interval', 50)->default('monthly'); // monthly, yearly
            $table->integer('duration_months')->default(1); // 1 = monthly, 12 = yearly
            $table->json('benefits')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->index('tenant_id');
        });

        Schema::create('customer_subscriptions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('tenant_id');
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->uuid('customer_id');
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');
            $table->uuid('plan_id')->nullable();
            $table->foreign('plan_id')->references('id')->on('customer_membership_plans')->onDelete('set null');
            $table->string('plan_name'); // snapshot
            $table->decimal('price_amount', 12, 2); // snapshot
            $table->string('billing_interval', 50); // snapshot
            $table->json('benefits_snapshot')->nullable(); // snapshot
            $table->string('status', 50)->default('active'); // active, expired, cancelled, pending
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamps();
            $table->index('tenant_id');
            $table->index('customer_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customer_subscriptions');
        Schema::dropIfExists('customer_membership_plans');
    }
};
