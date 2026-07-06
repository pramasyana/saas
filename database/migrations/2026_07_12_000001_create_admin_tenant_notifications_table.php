<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admin_tenant_notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->text('message');
            $table->string('type')->default('info');
            $table->boolean('is_active')->default(true);
            $table->string('target_type')->default('all');
            $table->string('target_tenant_id')->nullable();
            $table->json('read_by')->nullable();
            $table->timestamps();

            $table->index('is_active');
            $table->index('target_type');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admin_tenant_notifications');
    }
};
