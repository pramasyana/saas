import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { ServiceItem, ServiceFormData, PaginatedResponse } from '../types';

interface Filters {
    branch_id?: string;
    search?: string;
    category_id?: string;
    is_active?: boolean;
    page?: number;
    per_page?: number;
}

function getServices(filters: Filters): Promise<PaginatedResponse<ServiceItem>> {
    return api.get('/api/v1/service/services', { params: filters }).then((r) => r.data);
}

function getAllServices(): Promise<{ data: ServiceItem[] }> {
    return api.get('/api/v1/service/services/all').then((r) => r.data);
}

function createService(data: ServiceFormData): Promise<ServiceItem> {
    return api.post('/api/v1/service/services', data).then((r) => r.data);
}

function updateService(id: string, data: ServiceFormData): Promise<ServiceItem> {
    return api.put(`/api/v1/service/services/${id}`, data).then((r) => r.data);
}

function deleteService(id: string): Promise<void> {
    return api.delete(`/api/v1/service/services/${id}`).then((r) => r.data);
}

export function useServices(filters: Filters) {
    return useQuery({
        queryKey: ['service-services', filters],
        queryFn: () => getServices(filters),
    });
}

export function useAllServices() {
    return useQuery({
        queryKey: ['service-services', 'all'],
        queryFn: getAllServices,
    });
}

export function useCreateService() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: createService,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['service-services'] }),
    });
}

export function useUpdateService() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: ServiceFormData }) => updateService(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['service-services'] }),
    });
}

export function useDeleteService() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: deleteService,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['service-services'] }),
    });
}
