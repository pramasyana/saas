import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { Addon, AddonFormData, PaginatedResponse } from '../types';

interface Filters {
    branch_id?: string;
    search?: string;
    is_active?: boolean;
    page?: number;
    per_page?: number;
}

function getAddons(filters: Filters): Promise<PaginatedResponse<Addon>> {
    return api.get('/api/v1/service/addons', { params: filters }).then((r) => r.data);
}

function getAllAddons(): Promise<{ data: Addon[] }> {
    return api.get('/api/v1/service/addons/all').then((r) => r.data);
}

function createAddon(data: AddonFormData): Promise<Addon> {
    return api.post('/api/v1/service/addons', data).then((r) => r.data);
}

function updateAddon(id: string, data: AddonFormData): Promise<Addon> {
    return api.put(`/api/v1/service/addons/${id}`, data).then((r) => r.data);
}

function deleteAddon(id: string): Promise<void> {
    return api.delete(`/api/v1/service/addons/${id}`).then((r) => r.data);
}

export function useAddons(filters: Filters) {
    return useQuery({
        queryKey: ['service-addons', filters],
        queryFn: () => getAddons(filters),
    });
}

export function useAllAddons() {
    return useQuery({
        queryKey: ['service-addons', 'all'],
        queryFn: getAllAddons,
    });
}

export function useCreateAddon() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createAddon,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['service-addons'] }),
    });
}

export function useUpdateAddon() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: AddonFormData }) => updateAddon(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['service-addons'] }),
    });
}

export function useDeleteAddon() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: deleteAddon,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['service-addons'] }),
    });
}
