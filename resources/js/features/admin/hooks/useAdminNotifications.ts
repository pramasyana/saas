import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export interface AdminNotification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'danger';
    is_active: boolean;
    read_by: string[] | null;
    active_from: string | null;
    active_until: string | null;
    created_at: string;
    updated_at: string;
}

interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface NotificationsResponse {
    status: string;
    data: AdminNotification[];
    meta: PaginationMeta;
}

export interface NotificationFilters {
    page?: number;
    per_page?: number;
    search?: string;
    type?: string;
    is_active?: string;
}

interface NotificationFormData {
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'danger';
    is_active?: boolean;
    active_from?: string | null;
    active_until?: string | null;
}

function getNotifications(filters: NotificationFilters = {}): Promise<NotificationsResponse> {
    return api.get('/api/v1/admin/notifications', { params: filters }).then((res) => res.data);
}

function createNotification(data: NotificationFormData): Promise<{ status: string; message: string; data: AdminNotification }> {
    return api.post('/api/v1/admin/notifications', data).then((res) => res.data);
}

function updateNotification({ id, ...data }: NotificationFormData & { id: string }): Promise<{ status: string; message: string; data: AdminNotification }> {
    return api.put(`/api/v1/admin/notifications/${id}`, data).then((res) => res.data);
}

function deleteNotification(id: string): Promise<{ status: string; message: string }> {
    return api.delete(`/api/v1/admin/notifications/${id}`).then((res) => res.data);
}

function toggleNotification(id: string): Promise<{ status: string; message: string; data: AdminNotification }> {
    return api.put(`/api/v1/admin/notifications/${id}/toggle-active`).then((res) => res.data);
}

export function useAdminNotifications(filters: NotificationFilters = {}) {
    return useQuery({
        queryKey: ['admin-notifications', filters],
        queryFn: () => getNotifications(filters),
        retry: false,
    });
}

export function useCreateNotification() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: NotificationFormData) => createNotification(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
        },
    });
}

export function useUpdateNotification() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...data }: NotificationFormData & { id: string }) => updateNotification({ id, ...data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
        },
    });
}

export function useDeleteNotification() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteNotification(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
        },
    });
}

export function useToggleNotification() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => toggleNotification(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
        },
    });
}

export function useMarkNotificationRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => api.put(`/api/v1/admin/notifications/${id}/read`).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
        },
    });
}
