import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { StaffSchedule } from '../types';

interface SchedulePayload {
    staff_id: string;
    schedules: Partial<StaffSchedule>[];
}

function getSchedules(staffId: string): Promise<StaffSchedule[]> {
    return api.get('/api/v1/staff/schedules', { params: { staff_id: staffId } }).then((r) => r.data);
}

function updateSchedules(payload: SchedulePayload): Promise<void> {
    return api.put('/api/v1/staff/schedules', payload).then((r) => r.data);
}

export function useSchedules(staffId: string | null) {
    return useQuery({
        queryKey: ['staff', 'schedules', staffId],
        queryFn: () => getSchedules(staffId!),
        enabled: !!staffId,
    });
}

export function useUpdateSchedules() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: updateSchedules,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['staff', 'schedules'] }),
    });
}
