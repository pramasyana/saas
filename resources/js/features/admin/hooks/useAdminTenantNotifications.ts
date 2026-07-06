import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export interface AdminTenantNotification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'danger';
    is_active: boolean;
    target_type: 'all' | 'specific';
    target_tenant_ids: string[] | null;
    read_by: string[] | null;
    active_from: string | null;
    active_until: string | null;
    created_at: string;
    updated_at: string;
}

interface PaginatedResponse {
    status: string;
    data: AdminTenantNotification[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

interface NotificationFormData {
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'danger';
    is_active?: boolean;
    target_type: 'all' | 'specific';
    target_tenant_ids?: string[];
    active_from?: string | null;
    active_until?: string | null;
}

interface PaginationParams {
    page?: number;
    per_page?: number;
    search?: string;
    type?: string;
    is_active?: string;
}

function getNotifications(params: PaginationParams): Promise<PaginatedResponse> {
    return api.get('/api/v1/admin/tenant-notifications', { params }).then((res) => res.data);
}

function createNotification(data: NotificationFormData): Promise<{ status: string; message: string; data: AdminTenantNotification }> {
    return api.post('/api/v1/admin/tenant-notifications', data).then((res) => res.data);
}

function updateNotification({ id, ...data }: NotificationFormData & { id: string }): Promise<{ status: string; message: string; data: AdminTenantNotification }> {
    return api.put(`/api/v1/admin/tenant-notifications/${id}`, data).then((res) => res.data);
}

function deleteNotification(id: string): Promise<{ status: string; message: string }> {
    return api.delete(`/api/v1/admin/tenant-notifications/${id}`).then((res) => res.data);
}

function toggleNotification(id: string): Promise<{ status: string; message: string; data: AdminTenantNotification }> {
    return api.put(`/api/v1/admin/tenant-notifications/${id}/toggle-active`).then((res) => res.data);
}

export function useAdminTenantNotifications(params: PaginationParams) {
    return useQuery({
        queryKey: ['admin-tenant-notifications', params],
        queryFn: () => getNotifications(params),
        retry: false,
        placeholderData: (prev) => prev,
    });
}

export function useCreateTenantNotification() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: NotificationFormData) => createNotification(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-tenant-notifications'] });
        },
    });
}

export function useUpdateTenantNotification() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...data }: NotificationFormData & { id: string }) => updateNotification({ id, ...data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-tenant-notifications'] });
        },
    });
}

export function useDeleteTenantNotification() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteNotification(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-tenant-notifications'] });
        },
    });
}

export function useToggleTenantNotification() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => toggleNotification(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-tenant-notifications'] });
        },
    });
}
