<?php

namespace App\Modules\Admin\Services;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class SystemHealthService
{
    public function getOverview(): array
    {
        return [
            'queue' => $this->getQueueStatus(),
            'failed_jobs' => $this->getFailedJobs(),
            'job_batches' => $this->getJobBatches(),
            'cache' => $this->getCacheStatus(),
            'maintenance' => $this->getMaintenanceMode(),
        ];
    }

    public function toggleMaintenance(): array
    {
        $down = $this->isDown();

        if ($down) {
            Artisan::call('up');
        } else {
            Artisan::call('down', ['--render' => 'errors::503']);
        }

        return $this->getMaintenanceMode();
    }

    private function getQueueStatus(): array
    {
        $pending = DB::table('jobs')->count();
        $failed = DB::table('failed_jobs')->count();

        return [
            'pending_jobs' => $pending,
            'failed_jobs' => $failed,
            'healthy' => $failed < 10,
        ];
    }

    private function getFailedJobs(): array
    {
        $jobs = DB::table('failed_jobs')
            ->orderBy('failed_at', 'desc')
            ->limit(10)
            ->get()
            ->map(fn ($job) => [
                'id' => $job->id,
                'uuid' => $job->uuid,
                'connection' => $job->connection,
                'queue' => $job->queue,
                'failed_at' => $job->failed_at,
            ]);

        $total = DB::table('failed_jobs')->count();

        return [
            'total' => $total,
            'recent' => $jobs,
        ];
    }

    private function getJobBatches(): array
    {
        $recent = DB::table('job_batches')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(fn ($batch) => [
                'id' => $batch->id,
                'name' => $batch->name,
                'total_jobs' => $batch->total_jobs,
                'pending_jobs' => $batch->pending_jobs,
                'failed_jobs' => $batch->failed_jobs,
                'created_at' => date('c', $batch->created_at),
                'finished_at' => $batch->finished_at ? date('c', $batch->finished_at) : null,
            ]);

        return $recent->toArray();
    }

    private function getCacheStatus(): array
    {
        $testKey = 'health_check_'.now()->timestamp;
        $testValue = 'ok';

        try {
            Cache::put($testKey, $testValue, 1);
            $retrieved = Cache::get($testKey);
            Cache::forget($testKey);

            return [
                'reachable' => $retrieved === $testValue,
                'driver' => config('cache.default'),
            ];
        } catch (\Throwable) {
            return [
                'reachable' => false,
                'driver' => config('cache.default'),
            ];
        }
    }

    private function getMaintenanceMode(): array
    {
        return [
            'active' => $this->isDown(),
        ];
    }

    private function isDown(): bool
    {
        return file_exists(storage_path('framework/down'));
    }
}
