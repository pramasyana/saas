<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('booking_recurring_templates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('tenant_id');
            $table->uuid('source_booking_id'); // the original booking to clone
            $table->string('frequency'); // daily, weekly, monthly
            $table->unsignedSmallInteger('interval')->default(1); // every N days/weeks/months
            $table->json('days_of_week')->nullable(); // [0,1,2,3,4,5,6] for weekly
            $table->string('end_type'); // after_count, until_date, never
            $table->unsignedSmallInteger('count')->nullable(); // total occurrences
            $table->unsignedSmallInteger('occurrences_generated')->default(0);
            $table->date('until_date')->nullable();
            $table->date('next_generation_date');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('source_booking_id')->references('id')->on('bookings')->onDelete('cascade');
            $table->index('tenant_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('booking_recurring_templates');
    }
};
