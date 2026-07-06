<?php

namespace App\Modules\Admin\Services;

use App\Models\AdminActivityLog;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class ActivityLogService
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = AdminActivityLog::with('user')->latest();

        if (! empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        if (! empty($filters['action'])) {
            $query->where('action', $filters['action']);
        }

        if (! empty($filters['from'])) {
            $query->where('created_at', '>=', $filters['from']);
        }

        if (! empty($filters['to'])) {
            $query->where('created_at', '<=', $filters['to']);
        }

        return $query->paginate($perPage);
    }

    public function log(
        string $userId,
        string $action,
        string $description,
        ?string $subjectType = null,
        ?string $subjectId = null,
        ?array $metadata = null,
        ?string $ipAddress = null,
        ?string $userAgent = null,
    ): AdminActivityLog {
        return AdminActivityLog::create([
            'user_id' => $userId,
            'action' => $action,
            'subject_type' => $subjectType,
            'subject_id' => $subjectId,
            'description' => $description,
            'metadata' => $metadata,
            'ip_address' => $ipAddress ?? request()->ip(),
            'user_agent' => $userAgent ?? request()->userAgent(),
        ]);
    }

    public function logFromRequest(
        Request $request,
        string $action,
        string $description,
        ?string $subjectType = null,
        ?string $subjectId = null,
        ?array $metadata = null,
    ): AdminActivityLog {
        return $this->log(
            userId: $request->user()->id,
            action: $action,
            description: $description,
            subjectType: $subjectType,
            subjectId: $subjectId,
            metadata: $metadata,
            ipAddress: $request->ip(),
            userAgent: $request->userAgent(),
        );
    }
}
