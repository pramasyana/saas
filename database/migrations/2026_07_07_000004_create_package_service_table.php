<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('package_service', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('package_id');
            $table->foreign('package_id')->references('id')->on('packages')->onDelete('cascade');
            $table->uuid('service_id');
            $table->foreign('service_id')->references('id')->on('services')->onDelete('cascade');
            $table->unsignedSmallInteger('quantity')->default(1);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('package_service');
    }
};
