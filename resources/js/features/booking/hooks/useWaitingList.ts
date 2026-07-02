import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { WaitingList, WaitingListFormData, PaginatedResponse } from '../types';

interface Filters {
    search?: string;
    status?: string;
    date?: string;
    page?: number;
    per_page?: number;
}

function getWaitingList(filters: Filters): Promise<PaginatedResponse<WaitingList>> {
    return api.get('/api/v1/booking/waiting-list', { params: filters }).then((r) => r.data);
}

function createWaitingList(data: WaitingListFormData): Promise<{ data: WaitingList }> {
    return api.post('/api/v1/booking/waiting-list', data).then((r) => r.data);
}

function updateWaitingList(id: string, data: Partial<WaitingListFormData>): Promise<{ data: WaitingList }> {
    return api.put(`/api/v1/booking/waiting-list/${id}`, data).then((r) => r.data);
}

function deleteWaitingList(id: string): Promise<void> {
    return api.delete(`/api/v1/booking/waiting-list/${id}`).then((r) => r.data);
}

function notifyWaitingList(id: string): Promise<{ data: WaitingList }> {
    return api.post(`/api/v1/booking/waiting-list/${id}/notify`).then((r) => r.data);
}

export function useWaitingList(filters: Filters) {
    return useQuery({
        queryKey: ['waiting-list', filters],
        queryFn: () => getWaitingList(filters),
    });
}

export function useCreateWaitingList() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: createWaitingList,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['waiting-list'] }),
    });
}

export function useUpdateWaitingList() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<WaitingListFormData> }) => updateWaitingList(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['waiting-list'] }),
    });
}

export function useDeleteWaitingList() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: deleteWaitingList,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['waiting-list'] }),
    });
}

export function useNotifyWaitingList() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: notifyWaitingList,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['waiting-list'] }),
    });
}
