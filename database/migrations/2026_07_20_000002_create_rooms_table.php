<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('tenant_id');
            $table->uuid('branch_id')->nullable();
            $table->string('name');
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('capacity')->nullable();
            $table->string('color', 7)->default('#7C3AED');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('branch_id')->references('id')->on('branches')->onDelete('set null');
            $table->index('tenant_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
