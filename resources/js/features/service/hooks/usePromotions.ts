import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { Promotion, PromotionFormData, PaginatedResponse } from '../types';

interface Filters {
    search?: string;
    promotion_type?: string;
    is_active?: boolean;
    page?: number;
    per_page?: number;
}

function getPromotions(filters: Filters): Promise<PaginatedResponse<Promotion>> {
    return api.get('/api/v1/service/promotions', { params: filters }).then((r) => r.data);
}

function createPromotion(data: PromotionFormData): Promise<Promotion> {
    return api.post('/api/v1/service/promotions', data).then((r) => r.data);
}

function updatePromotion(id: string, data: PromotionFormData): Promise<Promotion> {
    return api.put(`/api/v1/service/promotions/${id}`, data).then((r) => r.data);
}

function deletePromotion(id: string): Promise<void> {
    return api.delete(`/api/v1/service/promotions/${id}`).then((r) => r.data);
}

export function usePromotions(filters: Filters) {
    return useQuery({
        queryKey: ['service-promotions', filters],
        queryFn: () => getPromotions(filters),
    });
}

export function useCreatePromotion() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createPromotion,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['service-promotions'] }),
    });
}

export function useUpdatePromotion() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: PromotionFormData }) => updatePromotion(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['service-promotions'] }),
    });
}

export function useDeletePromotion() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: deletePromotion,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['service-promotions'] }),
    });
}
