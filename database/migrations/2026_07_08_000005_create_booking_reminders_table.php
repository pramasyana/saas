<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('booking_reminders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('booking_id');
            $table->foreign('booking_id')->references('id')->on('bookings')->onDelete('cascade');
            $table->string('type')->default('whatsapp');
            $table->string('status')->default('pending');
            $table->dateTime('sent_at')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamps();
            $table->index('booking_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('booking_reminders');
    }
};
