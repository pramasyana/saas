<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->uuid('recurring_template_id')->nullable()->after('max_participants');
            $table->foreign('recurring_template_id')->references('id')->on('booking_recurring_templates')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropForeign(['recurring_template_id']);
            $table->dropColumn('recurring_template_id');
        });
    }
};
