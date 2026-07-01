<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('feature_definitions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('key')->unique();
            $table->string('label');
            $table->text('description')->nullable();
            $table->string('type'); // boolean, numeric
            $table->string('default_value')->nullable();
            $table->string('category')->default('features'); // features, limits, support, customization
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('feature_definitions');
    }
};
