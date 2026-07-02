<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('booking_reminders', function (Blueprint $table) {
            $table->dateTime('scheduled_at')->nullable()->after('type');
            $table->index('scheduled_at');
        });
    }

    public function down(): void
    {
        Schema::table('booking_reminders', function (Blueprint $table) {
            $table->dropIndex(['scheduled_at']);
            $table->dropColumn('scheduled_at');
        });
    }
};
