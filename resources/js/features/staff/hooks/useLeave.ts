import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { Leave, LeaveFormData, PaginatedResponse } from '../types';

interface Filters {
    staff_id?: string;
    status?: string;
    type?: string;
    date_from?: string;
    date_to?: string;
    page?: number;
    per_page?: number;
}

function getLeaves(filters: Filters): Promise<PaginatedResponse<Leave>> {
    return api.get('/api/v1/staff/leaves', { params: filters }).then((r) => r.data);
}

function createLeave(data: LeaveFormData): Promise<Leave> {
    return api.post('/api/v1/staff/leaves', data).then((r) => r.data);
}

function updateLeaveStatus(id: string, status: string): Promise<Leave> {
    return api.put(`/api/v1/staff/leaves/${id}`, { status }).then((r) => r.data);
}

function deleteLeave(id: string): Promise<void> {
    return api.delete(`/api/v1/staff/leaves/${id}`).then((r) => r.data);
}

export function useLeaves(filters: Filters) {
    return useQuery({
        queryKey: ['staff', 'leaves', filters],
        queryFn: () => getLeaves(filters),
    });
}

export function useCreateLeave() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createLeave,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['staff', 'leaves'] }),
    });
}

export function useUpdateLeaveStatus() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) => updateLeaveStatus(id, status),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['staff', 'leaves'] }),
    });
}

export function useDeleteLeave() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: deleteLeave,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['staff', 'leaves'] }),
    });
}
