import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { Referral, ReferralFormData, PaginatedResponse } from '../types';

interface Filters {
    page?: number;
    per_page?: number;
}

function getCustomerReferrals(customerId: string, filters: Filters): Promise<PaginatedResponse<Referral>> {
    return api.get(`/api/v1/crm/customers/${customerId}/referrals`, { params: filters }).then((r) => r.data);
}

function createReferral(customerId: string, data: ReferralFormData): Promise<Referral> {
    return api.post(`/api/v1/crm/customers/${customerId}/referrals`, data).then((r) => r.data);
}

function convertReferral(id: string): Promise<Referral> {
    return api.post(`/api/v1/crm/referrals/${id}/convert`).then((r) => r.data);
}

function markRewardGiven(id: string): Promise<Referral> {
    return api.post(`/api/v1/crm/referrals/${id}/mark-reward`).then((r) => r.data);
}

export function useCustomerReferrals(customerId: string, filters: Filters) {
    return useQuery({
        queryKey: ['crm', 'referrals', customerId, filters],
        queryFn: () => getCustomerReferrals(customerId, filters),
        enabled: !!customerId,
    });
}

export function useCreateReferral() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ customerId, data }: { customerId: string; data: ReferralFormData }) => createReferral(customerId, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['crm', 'referrals'] }),
    });
}

export function useConvertReferral() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: convertReferral,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['crm', 'referrals'] }),
    });
}

export function useMarkRewardGiven() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: markRewardGiven,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['crm', 'referrals'] }),
    });
}
