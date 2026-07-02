import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { AvailabilityResult } from '../types';

interface AvailabilityFilters {
    date: string;
    service_id: string;
    duration: number;
    branch_id?: string;
    staff_id?: string;
}

function checkAvailability(filters: AvailabilityFilters): Promise<{ data: AvailabilityResult }> {
    return api.get('/api/v1/booking/availability', { params: filters }).then((r) => r.data);
}

export function useAvailability(filters: AvailabilityFilters) {
    return useQuery({
        queryKey: ['booking-availability', filters],
        queryFn: () => checkAvailability(filters),
        enabled: !!filters.date && !!filters.service_id && filters.duration > 0,
    });
}
