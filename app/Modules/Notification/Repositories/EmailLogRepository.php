<?php

namespace App\Modules\Notification\Repositories;

use App\Modules\Notification\Contracts\EmailLogRepositoryInterface;
use App\Modules\Notification\Models\EmailLog;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EmailLogRepository implements EmailLogRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = EmailLog::with('user:id,name,email')->latest();

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('subject', 'like', "%{$search}%")
                    ->orWhere('error_message', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['channel'])) {
            $query->where('channel', $filters['channel']);
        }

        if (! empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        return $query->paginate($perPage);
    }

    public function deleteOlderThan(string $date): int
    {
        return EmailLog::where('created_at', '<', $date)->delete();
    }

    public function countOlderThan(string $date): int
    {
        return EmailLog::where('created_at', '<', $date)->count();
    }
}
