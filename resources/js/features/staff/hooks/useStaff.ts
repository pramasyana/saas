import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { Staff, StaffFormData, PaginatedResponse } from '../types';

interface Filters {
    search?: string;
    branch_id?: string;
    is_active?: boolean;
    page?: number;
    per_page?: number;
}

function getStaff(filters: Filters): Promise<PaginatedResponse<Staff>> {
    return api.get('/api/v1/staff', { params: filters }).then((r) => r.data);
}

function getAllStaff(): Promise<{ data: Staff[] }> {
    return api.get('/api/v1/staff/all').then((r) => r.data);
}

function createStaff(data: StaffFormData): Promise<Staff> {
    return api.post('/api/v1/staff', data).then((r) => r.data);
}

function updateStaff(id: string, data: StaffFormData): Promise<Staff> {
    return api.put(`/api/v1/staff/${id}`, data).then((r) => r.data);
}

function deleteStaff(id: string): Promise<void> {
    return api.delete(`/api/v1/staff/${id}`).then((r) => r.data);
}

export function useStaff(filters: Filters) {
    return useQuery({
        queryKey: ['staff', 'list', filters],
        queryFn: () => getStaff(filters),
    });
}

export function useAllStaff() {
    return useQuery({
        queryKey: ['staff', 'all'],
        queryFn: getAllStaff,
    });
}

export function useCreateStaff() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: createStaff,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['staff'] }),
    });
}

export function useUpdateStaff() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: StaffFormData }) => updateStaff(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['staff'] }),
    });
}

export function useDeleteStaff() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: deleteStaff,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['staff'] }),
    });
}
