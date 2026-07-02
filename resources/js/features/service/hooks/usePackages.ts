import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { Package, PackageFormData, PaginatedResponse } from '../types';

interface Filters {
    branch_id?: string;
    search?: string;
    is_active?: boolean;
    page?: number;
    per_page?: number;
}

function getPackages(filters: Filters): Promise<PaginatedResponse<Package>> {
    return api.get('/api/v1/service/packages', { params: filters }).then((r) => r.data);
}

function getAllPackages(): Promise<{ data: Package[] }> {
    return api.get('/api/v1/service/packages/all').then((r) => r.data);
}

function createPackage(data: PackageFormData): Promise<Package> {
    return api.post('/api/v1/service/packages', data).then((r) => r.data);
}

function updatePackage(id: string, data: PackageFormData): Promise<Package> {
    return api.put(`/api/v1/service/packages/${id}`, data).then((r) => r.data);
}

function deletePackage(id: string): Promise<void> {
    return api.delete(`/api/v1/service/packages/${id}`).then((r) => r.data);
}

export function usePackages(filters: Filters) {
    return useQuery({
        queryKey: ['service-packages', filters],
        queryFn: () => getPackages(filters),
    });
}

export function useAllPackages() {
    return useQuery({
        queryKey: ['service-packages', 'all'],
        queryFn: getAllPackages,
    });
}

export function useCreatePackage() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createPackage,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['service-packages'] }),
    });
}

export function useUpdatePackage() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: PackageFormData }) => updatePackage(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['service-packages'] }),
    });
}

export function useDeletePackage() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: deletePackage,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['service-packages'] }),
    });
}
