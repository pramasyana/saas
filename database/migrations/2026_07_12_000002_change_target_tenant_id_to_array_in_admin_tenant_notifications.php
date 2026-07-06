<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('admin_tenant_notifications', function (Blueprint $table) {
            $table->dropColumn('target_tenant_id');
        });

        Schema::table('admin_tenant_notifications', function (Blueprint $table) {
            $table->json('target_tenant_ids')->nullable()->after('target_type');
        });
    }

    public function down(): void
    {
        Schema::table('admin_tenant_notifications', function (Blueprint $table) {
            $table->dropColumn('target_tenant_ids');
        });

        Schema::table('admin_tenant_notifications', function (Blueprint $table) {
            $table->string('target_tenant_id')->nullable()->after('target_type');
        });
    }
};
