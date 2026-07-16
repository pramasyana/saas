import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { CustomerInvoice, CustomerInvoiceFilters, CustomerInvoiceStats, PaginatedResponse } from '../types';

function getInvoices(filters: CustomerInvoiceFilters): Promise<PaginatedResponse<CustomerInvoice>> {
    return api.get('/api/v1/tenant/invoices', { params: filters }).then((r) => r.data);
}

function getInvoice(id: string): Promise<{ data: CustomerInvoice }> {
    return api.get(`/api/v1/tenant/invoices/${id}`).then((r) => r.data);
}

function getInvoiceStats(): Promise<{ data: CustomerInvoiceStats }> {
    return api.get('/api/v1/tenant/invoices/stats').then((r) => r.data);
}

function payInvoice(id: string, data: { payment_method: string; amount: number }): Promise<{ data: CustomerInvoice }> {
    return api.put(`/api/v1/tenant/invoices/${id}/pay`, data).then((r) => r.data);
}

function updateInvoiceNotes(id: string, notes: string | null): Promise<{ data: CustomerInvoice }> {
    return api.put(`/api/v1/tenant/invoices/${id}/notes`, { notes }).then((r) => r.data);
}

export function useCustomerInvoices(filters: CustomerInvoiceFilters) {
    return useQuery({
        queryKey: ['customer-invoices', filters],
        queryFn: () => getInvoices(filters),
        retry: false,
    });
}

export function useCustomerInvoice(id: string) {
    return useQuery({
        queryKey: ['customer-invoice', id],
        queryFn: () => getInvoice(id),
        enabled: !!id,
    });
}

export function useCustomerInvoiceStats() {
    return useQuery({
        queryKey: ['customer-invoice-stats'],
        queryFn: getInvoiceStats,
    });
}

export function usePayInvoice() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: { payment_method: string; amount: number } }) => payInvoice(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['customer-invoices'] });
            qc.invalidateQueries({ queryKey: ['customer-invoice-stats'] });
        },
    });
}

export function useUpdateInvoiceNotes() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, notes }: { id: string; notes: string | null }) => updateInvoiceNotes(id, notes),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['customer-invoices'] });
        },
    });
}
