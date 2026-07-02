<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('booking_addons', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('booking_service_id');
            $table->foreign('booking_service_id')->references('id')->on('booking_services')->onDelete('cascade');
            $table->uuid('addon_id')->nullable();
            $table->foreign('addon_id')->references('id')->on('addons')->onDelete('set null');
            $table->string('name');
            $table->decimal('price', 12, 2)->default(0);
            $table->unsignedTinyInteger('quantity')->default(1);
            $table->timestamps();
            $table->index('booking_service_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('booking_addons');
    }
};
