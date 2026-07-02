<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('booking_services', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('booking_id');
            $table->foreign('booking_id')->references('id')->on('bookings')->onDelete('cascade');
            $table->uuid('service_id')->nullable();
            $table->foreign('service_id')->references('id')->on('services')->onDelete('set null');
            $table->string('name');
            $table->decimal('price', 12, 2)->default(0);
            $table->unsignedSmallInteger('duration')->comment('Snapshot in minutes');
            $table->unsignedTinyInteger('quantity')->default(1);
            $table->unsignedTinyInteger('sort_order')->default(0);
            $table->timestamps();
            $table->index('booking_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('booking_services');
    }
};
