import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export interface TenantNotification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'danger';
    target_type: 'all' | 'specific';
    target_tenant_ids: string[] | null;
    read_by: string[] | null;
    active_from: string | null;
    active_until: string | null;
    created_at: string;
    updated_at: string;
}

interface NotificationsResponse {
    status: string;
    data: TenantNotification[];
}

function getNotifications(): Promise<NotificationsResponse> {
    return api.get('/api/v1/tenant-notifications').then((res) => res.data);
}

function markAsRead(id: string): Promise<void> {
    return api.put(`/api/v1/tenant-notifications/${id}/read`).then((res) => res.data);
}

export function useTenantNotifications() {
    return useQuery({
        queryKey: ['tenant-notifications'],
        queryFn: getNotifications,
        refetchInterval: 60_000,
        retry: false,
    });
}

export function useMarkNotificationRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => markAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tenant-notifications'] });
        },
    });
}
