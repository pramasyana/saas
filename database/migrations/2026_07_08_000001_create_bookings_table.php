<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('tenant_id');
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->uuid('branch_id')->nullable();
            $table->foreign('branch_id')->references('id')->on('branches')->onDelete('set null');
            $table->uuid('customer_id');
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');
            $table->uuid('staff_id')->nullable();
            $table->foreign('staff_id')->references('id')->on('staff')->onDelete('set null');
            $table->dateTime('start_time');
            $table->dateTime('end_time');
            $table->unsignedSmallInteger('duration_minutes');
            $table->string('status')->default('pending');
            $table->string('source')->default('online');
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index('tenant_id');
            $table->index('status');
            $table->index('start_time');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
