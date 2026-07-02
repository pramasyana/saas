import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { Attendance, AttendanceFormData, PaginatedResponse } from '../types';

interface Filters {
    staff_id?: string;
    date?: string;
    date_from?: string;
    date_to?: string;
    status?: string;
    page?: number;
    per_page?: number;
}

function getAttendance(filters: Filters): Promise<PaginatedResponse<Attendance>> {
    return api.get('/api/v1/staff/attendance', { params: filters }).then((r) => r.data);
}

function createAttendance(data: AttendanceFormData): Promise<Attendance> {
    return api.post('/api/v1/staff/attendance', data).then((r) => r.data);
}

function updateAttendance(id: string, data: AttendanceFormData): Promise<Attendance> {
    return api.put(`/api/v1/staff/attendance/${id}`, data).then((r) => r.data);
}

function deleteAttendance(id: string): Promise<void> {
    return api.delete(`/api/v1/staff/attendance/${id}`).then((r) => r.data);
}

export function useAttendance(filters: Filters) {
    return useQuery({
        queryKey: ['staff', 'attendance', filters],
        queryFn: () => getAttendance(filters),
    });
}

export function useCreateAttendance() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createAttendance,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['staff', 'attendance'] }),
    });
}

export function useUpdateAttendance() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: AttendanceFormData }) => updateAttendance(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['staff', 'attendance'] }),
    });
}

export function useDeleteAttendance() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: deleteAttendance,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['staff', 'attendance'] }),
    });
}
