<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('staff_service', function (Blueprint $table) {
            $table->uuid('staff_id');
            $table->uuid('service_id');
            $table->boolean('is_primary')->default(false);

            $table->foreign('staff_id')->references('id')->on('staff')->onDelete('cascade');
            $table->foreign('service_id')->references('id')->on('services')->onDelete('cascade');
            $table->primary(['staff_id', 'service_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('staff_service');
    }
};
