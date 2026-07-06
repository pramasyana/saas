<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('admin_tenant_notifications', function (Blueprint $table) {
            $table->timestamp('active_from')->nullable()->after('target_tenant_ids');
            $table->timestamp('active_until')->nullable()->after('active_from');
        });
    }

    public function down(): void
    {
        Schema::table('admin_tenant_notifications', function (Blueprint $table) {
            $table->dropColumn(['active_from', 'active_until']);
        });
    }
};
