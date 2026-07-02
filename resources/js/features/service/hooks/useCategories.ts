import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { Category, CategoryFormData, PaginatedResponse } from '../types';

interface Filters {
    branch_id?: string;
    search?: string;
    is_active?: boolean;
    page?: number;
    per_page?: number;
}

function getCategories(filters: Filters): Promise<PaginatedResponse<Category>> {
    return api.get('/api/v1/service/categories', { params: filters }).then((r) => r.data);
}

function getAllCategories(): Promise<{ data: Category[] }> {
    return api.get('/api/v1/service/categories/all').then((r) => r.data);
}

function createCategory(data: CategoryFormData): Promise<Category> {
    return api.post('/api/v1/service/categories', data).then((r) => r.data);
}

function updateCategory(id: string, data: CategoryFormData): Promise<Category> {
    return api.put(`/api/v1/service/categories/${id}`, data).then((r) => r.data);
}

function deleteCategory(id: string): Promise<void> {
    return api.delete(`/api/v1/service/categories/${id}`).then((r) => r.data);
}

export function useCategories(filters: Filters) {
    return useQuery({
        queryKey: ['service-categories', filters],
        queryFn: () => getCategories(filters),
    });
}

export function useAllCategories() {
    return useQuery({
        queryKey: ['service-categories', 'all'],
        queryFn: getAllCategories,
    });
}

export function useCreateCategory() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: createCategory,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['service-categories'] }),
    });
}

export function useUpdateCategory() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: CategoryFormData }) => updateCategory(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['service-categories'] }),
    });
}

export function useDeleteCategory() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['service-categories'] }),
    });
}
