import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { TimelineEvent, PaginatedResponse } from '../types';

interface Filters {
    page?: number;
    per_page?: number;
}

function getCustomerTimeline(customerId: string, filters: Filters): Promise<PaginatedResponse<TimelineEvent>> {
    return api.get(`/api/v1/crm/customers/${customerId}/timeline`, { params: filters }).then((r) => r.data);
}

export function useCustomerTimeline(customerId: string, filters: Filters) {
    return useQuery({
        queryKey: ['crm', 'timeline', customerId, filters],
        queryFn: () => getCustomerTimeline(customerId, filters),
        enabled: !!customerId,
    });
}
