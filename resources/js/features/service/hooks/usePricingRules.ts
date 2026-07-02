import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { PricingRule, PricingRuleFormData, PaginatedResponse } from '../types';

interface Filters {
    branch_id?: string;
    search?: string;
    action_type?: string;
    is_active?: boolean;
    page?: number;
    per_page?: number;
}

function getPricingRules(filters: Filters): Promise<PaginatedResponse<PricingRule>> {
    return api.get('/api/v1/service/pricing-rules', { params: filters }).then((r) => r.data);
}

function createPricingRule(data: PricingRuleFormData): Promise<PricingRule> {
    return api.post('/api/v1/service/pricing-rules', data).then((r) => r.data);
}

function updatePricingRule(id: string, data: PricingRuleFormData): Promise<PricingRule> {
    return api.put(`/api/v1/service/pricing-rules/${id}`, data).then((r) => r.data);
}

function deletePricingRule(id: string): Promise<void> {
    return api.delete(`/api/v1/service/pricing-rules/${id}`).then((r) => r.data);
}

export function usePricingRules(filters: Filters) {
    return useQuery({
        queryKey: ['service-pricing-rules', filters],
        queryFn: () => getPricingRules(filters),
    });
}

export function useCreatePricingRule() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: createPricingRule,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['service-pricing-rules'] }),
    });
}

export function useUpdatePricingRule() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: PricingRuleFormData }) => updatePricingRule(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['service-pricing-rules'] }),
    });
}

export function useDeletePricingRule() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: deletePricingRule,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['service-pricing-rules'] }),
    });
}
