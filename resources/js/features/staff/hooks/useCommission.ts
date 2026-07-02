import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { Commission, CommissionFormData, PaginatedResponse } from '../types';

interface Filters {
    staff_id?: string;
    type?: string;
    date_from?: string;
    date_to?: string;
    page?: number;
    per_page?: number;
}

function getCommissions(filters: Filters): Promise<PaginatedResponse<Commission>> {
    return api.get('/api/v1/staff/commissions', { params: filters }).then((r) => r.data);
}

function createCommission(data: CommissionFormData): Promise<Commission> {
    return api.post('/api/v1/staff/commissions', data).then((r) => r.data);
}

function updateCommission(id: string, data: CommissionFormData): Promise<Commission> {
    return api.put(`/api/v1/staff/commissions/${id}`, data).then((r) => r.data);
}

function deleteCommission(id: string): Promise<void> {
    return api.delete(`/api/v1/staff/commissions/${id}`).then((r) => r.data);
}

export function useCommissions(filters: Filters) {
    return useQuery({
        queryKey: ['staff', 'commissions', filters],
        queryFn: () => getCommissions(filters),
    });
}

export function useCreateCommission() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createCommission,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['staff', 'commissions'] }),
    });
}

export function useUpdateCommission() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: CommissionFormData }) => updateCommission(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['staff', 'commissions'] }),
    });
}

export function useDeleteCommission() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: deleteCommission,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['staff', 'commissions'] }),
    });
}
