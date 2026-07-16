<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('booking_service_adjustments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('tenant_id');
            $table->uuid('booking_id');
            $table->uuid('booking_service_id')->nullable();
            $table->string('action');
            $table->json('old_data')->nullable();
            $table->json('new_data');
            $table->decimal('old_total', 15, 2);
            $table->decimal('new_total', 15, 2);
            $table->uuid('adjusted_by');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('tenant_id');
            $table->index('booking_id');
            $table->index('booking_service_id');
            $table->foreign('booking_id')->references('id')->on('bookings')->onDelete('cascade');
            $table->foreign('adjusted_by')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('booking_service_adjustments');
    }
};
