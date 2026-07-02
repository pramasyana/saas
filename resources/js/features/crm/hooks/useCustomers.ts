import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { Customer, CustomerFormData, PaginatedResponse } from '../types';

interface Filters {
    search?: string;
    branch_id?: string;
    is_active?: boolean;
    tag_id?: string;
    page?: number;
    per_page?: number;
}

function getCustomers(filters: Filters): Promise<PaginatedResponse<Customer>> {
    return api.get('/api/v1/crm/customers', { params: filters }).then((r) => r.data);
}

function getCustomer(id: string): Promise<{ data: Customer }> {
    return api.get(`/api/v1/crm/customers/${id}`).then((r) => r.data);
}

function createCustomer(data: CustomerFormData): Promise<Customer> {
    return api.post('/api/v1/crm/customers', data).then((r) => r.data);
}

function updateCustomer(id: string, data: CustomerFormData): Promise<Customer> {
    return api.put(`/api/v1/crm/customers/${id}`, data).then((r) => r.data);
}

function deleteCustomer(id: string): Promise<void> {
    return api.delete(`/api/v1/crm/customers/${id}`).then((r) => r.data);
}

function getCustomerStats(): Promise<{ data: { total: number; active: number; new_this_month: number } }> {
    return api.get('/api/v1/crm/customers/stats').then((r) => r.data);
}

export function useCustomers(filters: Filters) {
    return useQuery({
        queryKey: ['crm', 'customers', filters],
        queryFn: () => getCustomers(filters),
    });
}

export function useCustomer(id: string) {
    return useQuery({
        queryKey: ['crm', 'customers', id],
        queryFn: () => getCustomer(id),
        enabled: !!id,
    });
}

export function useCreateCustomer() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: createCustomer,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['crm', 'customers'] }),
    });
}

export function useUpdateCustomer() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: CustomerFormData }) => updateCustomer(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['crm', 'customers'] }),
    });
}

export function useDeleteCustomer() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: deleteCustomer,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['crm', 'customers'] }),
    });
}

export function useCustomerStats() {
    return useQuery({
        queryKey: ['crm', 'customers', 'stats'],
        queryFn: getCustomerStats,
    });
}
