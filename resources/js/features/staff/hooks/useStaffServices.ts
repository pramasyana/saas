import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

interface StaffServiceItem {
    id: string;
    name: string;
    is_primary: boolean;
    commission_percentage: number;
}

export function useStaffServices(staffId: string) {
    return useQuery({
        queryKey: ['staff', staffId, 'services'],
        queryFn: () => api.get(`/api/v1/staff/${staffId}/services`).then((r) => r.data.data as StaffServiceItem[]),
        enabled: !!staffId,
    });
}

export function useSyncStaffServices(staffId: string) {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (services: { id: string; is_primary: boolean; commission_percentage: number }[]) =>
            api.put(`/api/v1/staff/${staffId}/services`, { services }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['staff', staffId, 'services'] });
            qc.invalidateQueries({ queryKey: ['services'] });
        },
    });
}
