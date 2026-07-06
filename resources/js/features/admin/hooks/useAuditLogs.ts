import { useQuery } from '@tanstack/react-query';
import type { PaginationMeta } from '@/features/users/types';
import api from '@/lib/axios';

export interface AuditLogEntry {
    id: string;
    user: { id: string; name: string; email: string } | null;
    action: string;
    subject_type: string | null;
    subject_id: string | null;
    description: string;
    metadata: Record<string, unknown> | null;
    ip_address: string | null;
    created_at: string;
}

interface AuditLogsResponse {
    status: string;
    data: AuditLogEntry[];
    meta: PaginationMeta;
    actions: string[];
}

export interface AuditLogFilters {
    user_id?: string;
    action?: string;
    from?: string;
    to?: string;
    page?: number;
    per_page?: number;
}

function getAuditLogs(params: AuditLogFilters): Promise<AuditLogsResponse> {
    return api.get('/api/v1/admin/audit-logs', { params }).then((res) => res.data);
}

export function useAuditLogs(filters: AuditLogFilters) {
    return useQuery({
        queryKey: ['audit-logs', filters],
        queryFn: () => getAuditLogs(filters),
        retry: false,
    });
}
