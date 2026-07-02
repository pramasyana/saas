import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { LoyaltyBalance, LoyaltyTransaction, PaginatedResponse } from '../types';

interface Filters {
    page?: number;
    per_page?: number;
}

function getLoyaltyBalance(customerId: string): Promise<{ data: LoyaltyBalance }> {
    return api.get(`/api/v1/crm/customers/${customerId}/loyalty/balance`).then((r) => r.data);
}

function getLoyaltyTransactions(customerId: string, filters: Filters): Promise<PaginatedResponse<LoyaltyTransaction>> {
    return api.get(`/api/v1/crm/customers/${customerId}/loyalty/transactions`, { params: filters }).then((r) => r.data);
}

function earnPoints(customerId: string, data: { points: number; description?: string }): Promise<LoyaltyTransaction> {
    return api.post(`/api/v1/crm/customers/${customerId}/loyalty/earn`, data).then((r) => r.data);
}

function spendPoints(customerId: string, data: { points: number; description?: string }): Promise<LoyaltyTransaction> {
    return api.post(`/api/v1/crm/customers/${customerId}/loyalty/spend`, data).then((r) => r.data);
}

export function useLoyaltyBalance(customerId: string) {
    return useQuery({
        queryKey: ['crm', 'loyalty', 'balance', customerId],
        queryFn: () => getLoyaltyBalance(customerId),
        enabled: !!customerId,
    });
}

export function useLoyaltyTransactions(customerId: string, filters: Filters) {
    return useQuery({
        queryKey: ['crm', 'loyalty', 'transactions', customerId, filters],
        queryFn: () => getLoyaltyTransactions(customerId, filters),
        enabled: !!customerId,
    });
}

export function useEarnPoints() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ customerId, data }: { customerId: string; data: { points: number; description?: string } }) => earnPoints(customerId, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['crm', 'loyalty'] }),
    });
}

export function useSpendPoints() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ customerId, data }: { customerId: string; data: { points: number; description?: string } }) => spendPoints(customerId, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['crm', 'loyalty'] }),
    });
}
