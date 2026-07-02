import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Tenant, TenantFilters, TenantFormData, PaginationMeta } from '@/features/tenants/types';
import api from '@/lib/axios';

interface TenantsResponse {
    status: string;
    data: Tenant[];
    meta: PaginationMeta;
}

interface TenantResponse {
    status: string;
    data: Tenant;
}

function getTenants(params: TenantFilters): Promise<TenantsResponse> {
    return api.get('/api/v1/admin/tenants', { params }).then((res) => res.data);
}

function getTenant(id: string): Promise<TenantResponse> {
    return api.get(`/api/v1/admin/tenants/${id}`).then((res) => res.data);
}

function createTenant(data: TenantFormData): Promise<TenantResponse> {
    return api.post('/api/v1/admin/tenants', data).then((res) => res.data);
}

function updateTenant(id: string, data: TenantFormData): Promise<TenantResponse> {
    return api.put(`/api/v1/admin/tenants/${id}`, data).then((res) => res.data);
}

function deleteTenant(id: string): Promise<void> {
    return api.delete(`/api/v1/admin/tenants/${id}`).then((res) => res.data);
}

export function useTenants(filters: TenantFilters) {
    return useQuery({
        queryKey: ['tenants', filters],
        queryFn: () => getTenants(filters),
        retry: false,
    });
}

export function useTenant(id: string | null) {
    return useQuery({
        queryKey: ['tenants', id],
        queryFn: () => getTenant(id!),
        enabled: id !== null,
    });
}

export function useCreateTenant() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: TenantFormData) => createTenant(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tenants'] });
        },
    });
}

export function useUpdateTenant() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: TenantFormData }) => updateTenant(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tenants'] });
        },
    });
}

export function useDeleteTenant() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteTenant(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tenants'] });
        },
    });
}
