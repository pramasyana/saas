import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { Referral, PaginatedResponse } from '../types';

interface Filters {
    search?: string;
    status?: string;
    reward_given?: boolean;
    page?: number;
    per_page?: number;
}

function getReferrals(filters: Filters): Promise<PaginatedResponse<Referral>> {
    return api.get('/api/v1/crm/referrals', { params: filters }).then((r) => r.data);
}

export function useReferrals(filters: Filters) {
    return useQuery({
        queryKey: ['crm', 'referrals', 'all', filters],
        queryFn: () => getReferrals(filters),
    });
}
