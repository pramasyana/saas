import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { CustomerNote, CustomerNoteFormData, PaginatedResponse } from '../types';

interface Filters {
    page?: number;
    per_page?: number;
}

function getCustomerNotes(customerId: string, filters: Filters): Promise<PaginatedResponse<CustomerNote>> {
    return api.get(`/api/v1/crm/customers/${customerId}/notes`, { params: filters }).then((r) => r.data);
}

function createNote(customerId: string, data: CustomerNoteFormData): Promise<CustomerNote> {
    return api.post(`/api/v1/crm/customers/${customerId}/notes`, data).then((r) => r.data);
}

function updateNote(customerId: string, id: string, data: CustomerNoteFormData): Promise<CustomerNote> {
    return api.put(`/api/v1/crm/customers/${customerId}/notes/${id}`, data).then((r) => r.data);
}

function deleteNote(customerId: string, id: string): Promise<void> {
    return api.delete(`/api/v1/crm/customers/${customerId}/notes/${id}`).then((r) => r.data);
}

export function useCustomerNotes(customerId: string, filters: Filters) {
    return useQuery({
        queryKey: ['crm', 'notes', customerId, filters],
        queryFn: () => getCustomerNotes(customerId, filters),
        enabled: !!customerId,
    });
}

export function useCreateNote() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ customerId, data }: { customerId: string; data: CustomerNoteFormData }) => createNote(customerId, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['crm', 'notes'] }),
    });
}

export function useUpdateNote() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ customerId, id, data }: { customerId: string; id: string; data: CustomerNoteFormData }) => updateNote(customerId, id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['crm', 'notes'] }),
    });
}

export function useDeleteNote() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ customerId, id }: { customerId: string; id: string }) => deleteNote(customerId, id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['crm', 'notes'] }),
    });
}
