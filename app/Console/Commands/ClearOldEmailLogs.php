<?php

namespace App\Console\Commands;

use App\Modules\Notification\Models\EmailLog;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

#[Signature('email-logs:clear-old')]
#[Description('Hapus email logs yang lebih dari 3 bulan')]
class ClearOldEmailLogs extends Command
{
    public function handle()
    {
        $cutoff = now()->subMonths(3);
        $count = EmailLog::where('created_at', '<', $cutoff)->count();

        if ($count === 0) {
            $this->info('Tidak ada email logs yang perlu dihapus.');

            return;
        }

        EmailLog::where('created_at', '<', $cutoff)->delete();

        $this->info("{$count} email logs berhasil dihapus (sebelum {$cutoff->toDateString()}).");

        Log::info('Old email logs cleared by scheduler', [
            'count' => $count,
            'cutoff' => $cutoff->toDateTimeString(),
        ]);
    }
}
