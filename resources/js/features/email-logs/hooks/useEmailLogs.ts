import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { EmailLog, EmailLogFilters } from '@/features/email-logs/types';
import type { PaginationMeta } from '@/features/users/types';

interface EmailLogsResponse {
    status: string;
    data: EmailLog[];
    meta: PaginationMeta;
}

function getEmailLogs(params: EmailLogFilters): Promise<EmailLogsResponse> {
    return api.get('/api/v1/admin/email-logs', { params }).then((res) => res.data);
}

export function useEmailLogs(filters: EmailLogFilters) {
    return useQuery({
        queryKey: ['email-logs', filters],
        queryFn: () => getEmailLogs(filters),
        retry: false,
    });
}

export function useClearOldEmailLogs() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => api.delete('/api/v1/admin/email-logs/old').then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['email-logs'] });
        },
    });
}
