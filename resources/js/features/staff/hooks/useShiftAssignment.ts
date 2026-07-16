import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { ShiftAssignmentFormData, ShiftCalendarData } from '../types';

function getShiftCalendar(params: { start_date: string; end_date: string; branch_id?: string }): Promise<{ data: ShiftCalendarData }> {
    return api.get('/api/v1/staff/shifts', { params }).then((r) => r.data);
}

function bulkAssignShifts(assignments: ShiftAssignmentFormData[]): Promise<{ data: { created: number; total: number } }> {
    return api.post('/api/v1/staff/shifts', { assignments }).then((r) => r.data);
}

function deleteShifts(items: { staff_id: string; date: string }[]): Promise<{ data: { deleted: number } }> {
    return api.delete('/api/v1/staff/shifts', { data: { items } }).then((r) => r.data);
}

export function useShiftCalendar(params: { start_date: string; end_date: string; branch_id?: string }) {
    return useQuery({
        queryKey: ['shift-calendar', params],
        queryFn: () => getShiftCalendar(params),
        enabled: !!params.start_date && !!params.end_date,
    });
}

export function useBulkAssignShift() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: bulkAssignShifts,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['shift-calendar'] }),
    });
}

export function useDeleteShifts() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: deleteShifts,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['shift-calendar'] }),
    });
}
