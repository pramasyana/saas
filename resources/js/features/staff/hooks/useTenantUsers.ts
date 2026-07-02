import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { TenantUser, TenantUserFormData, PaginatedResponse } from '../types';

interface Filters {
    search?: string;
    page?: number;
    per_page?: number;
}

function getUsers(filters: Filters): Promise<PaginatedResponse<TenantUser>> {
    return api.get('/api/v1/staff/users', { params: filters }).then((r) => r.data);
}

function createUser(data: TenantUserFormData): Promise<TenantUser> {
    return api.post('/api/v1/staff/users', data).then((r) => r.data);
}

function updateUser(id: number, data: Partial<TenantUserFormData>): Promise<TenantUser> {
    return api.put(`/api/v1/staff/users/${id}`, data).then((r) => r.data);
}

function deleteUser(id: number): Promise<void> {
    return api.delete(`/api/v1/staff/users/${id}`).then((r) => r.data);
}

export function useTenantUsers(filters: Filters) {
    return useQuery({
        queryKey: ['staff', 'users', filters],
        queryFn: () => getUsers(filters),
    });
}

export function useCreateTenantUser() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createUser,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['staff', 'users'] }),
    });
}

export function useUpdateTenantUser() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<TenantUserFormData> }) => updateUser(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['staff', 'users'] }),
    });
}

export function useDeleteTenantUser() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: deleteUser,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['staff', 'users'] }),
    });
}
