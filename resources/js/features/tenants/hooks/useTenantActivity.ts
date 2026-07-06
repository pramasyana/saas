import { useQuery } from '@tanstack/react-query';
import type { PaginationMeta } from '@/features/users/types';
import api from '@/lib/axios';

export interface ActivityTenant {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    domain: string | null;
    owner: { id: string; name: string; email: string } | null;
    subscription: { id: string; status: string; plan_name: string | null; price_amount: number } | null;
    users_count: number;
    branches_count: number;
    has_profile: boolean;
    created_at: string | null;
}

interface ActivityResponse {
    status: string;
    data: ActivityTenant[];
    meta: PaginationMeta;
}

export interface ActivityFilters {
    search?: string;
    status?: string;
    page?: number;
    per_page?: number;
}

function getActivity(params: ActivityFilters): Promise<ActivityResponse> {
    return api.get('/api/v1/admin/activity', { params }).then((res) => res.data);
}

export function useTenantActivity(filters: ActivityFilters) {
    return useQuery({
        queryKey: ['tenant-activity', filters],
        queryFn: () => getActivity(filters),
        retry: false,
    });
}
