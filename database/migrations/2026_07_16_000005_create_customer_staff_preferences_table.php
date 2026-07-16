<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customer_staff_preferences', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('tenant_id');
            $table->uuid('customer_id');
            $table->string('preference_type');
            $table->uuid('staff_id')->nullable();
            $table->string('gender')->nullable();
            $table->json('blocked_staff_ids')->nullable();
            $table->timestamps();

            $table->index('tenant_id');
            $table->index('customer_id');
            $table->index('preference_type');
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customer_staff_preferences');
    }
};
