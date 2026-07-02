import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { WorkingHour } from '../types';

export function useWorkingHours(branchId?: string | null) {
    return useQuery<WorkingHour[]>({
        queryKey: ['company', 'working-hours', branchId],
        queryFn: async () => {
            const params = branchId ? { branch_id: branchId } : {};
            const { data } = await api.get('/api/v1/company/working-hours', { params });
            return data.data ?? data;
        },
    });
}

export function useUpdateWorkingHours() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { branch_id?: string; hours: Partial<WorkingHour>[] }) => {
            const { data } = await api.put('/api/v1/company/working-hours', payload);
            return data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['company', 'working-hours'] });
        },
    });
}
