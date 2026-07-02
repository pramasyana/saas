import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { Tag, TagFormData, PaginatedResponse } from '../types';

interface Filters {
    search?: string;
    is_active?: boolean;
    page?: number;
    per_page?: number;
}

function getTags(filters: Filters): Promise<PaginatedResponse<Tag>> {
    return api.get('/api/v1/crm/tags', { params: filters }).then((r) => r.data);
}

function createTag(data: TagFormData): Promise<Tag> {
    return api.post('/api/v1/crm/tags', data).then((r) => r.data);
}

function updateTag(id: string, data: TagFormData): Promise<Tag> {
    return api.put(`/api/v1/crm/tags/${id}`, data).then((r) => r.data);
}

function deleteTag(id: string): Promise<void> {
    return api.delete(`/api/v1/crm/tags/${id}`).then((r) => r.data);
}

export function useTags(filters: Filters) {
    return useQuery({
        queryKey: ['crm', 'tags', filters],
        queryFn: () => getTags(filters),
    });
}

export function useCreateTag() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: createTag,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['crm', 'tags'] }),
    });
}

export function useUpdateTag() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: TagFormData }) => updateTag(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['crm', 'tags'] }),
    });
}

export function useDeleteTag() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: deleteTag,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['crm', 'tags'] }),
    });
}
