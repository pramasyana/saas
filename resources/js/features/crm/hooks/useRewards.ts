import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { Reward, RewardFormData, RewardRedemption, PaginatedResponse } from '../types';

interface Filters {
    search?: string;
    is_active?: boolean;
    page?: number;
    per_page?: number;
}

function getRewards(filters: Filters): Promise<PaginatedResponse<Reward>> {
    return api.get('/api/v1/crm/rewards', { params: filters }).then((r) => r.data);
}

function createReward(data: RewardFormData): Promise<Reward> {
    return api.post('/api/v1/crm/rewards', data).then((r) => r.data);
}

function updateReward(id: string, data: RewardFormData): Promise<Reward> {
    return api.put(`/api/v1/crm/rewards/${id}`, data).then((r) => r.data);
}

function deleteReward(id: string): Promise<void> {
    return api.delete(`/api/v1/crm/rewards/${id}`).then((r) => r.data);
}

function redeemReward(customerId: string, data: { reward_id: string; notes?: string }): Promise<RewardRedemption> {
    return api.post(`/api/v1/crm/customers/${customerId}/rewards/redeem`, data).then((r) => r.data);
}

export function useRewards(filters: Filters) {
    return useQuery({
        queryKey: ['crm', 'rewards', filters],
        queryFn: () => getRewards(filters),
    });
}

export function useCreateReward() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: createReward,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['crm', 'rewards'] }),
    });
}

export function useUpdateReward() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: RewardFormData }) => updateReward(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['crm', 'rewards'] }),
    });
}

export function useDeleteReward() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: deleteReward,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['crm', 'rewards'] }),
    });
}

export function useRedeemReward() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ customerId, data }: { customerId: string; data: { reward_id: string; notes?: string } }) => redeemReward(customerId, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['crm', 'rewards'] }),
    });
}
