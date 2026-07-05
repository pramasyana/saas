import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { CustomerSubscription, CustomerSubscriptionFormData, PaginatedResponse } from '../types';

interface Filters {
    search?: string;
    status?: string;
    plan_id?: string;
    page?: number;
    per_page?: number;
}

function getSubscriptions(filters: Filters = {}): Promise<PaginatedResponse<CustomerSubscription>> {
    return api.get('/api/v1/crm/subscriptions', { params: filters }).then((r) => r.data);
}

function getSubscription(id: string): Promise<{ data: CustomerSubscription }> {
    return api.get(`/api/v1/crm/subscriptions/${id}`).then((r) => r.data);
}

function createSubscription(data: CustomerSubscriptionFormData): Promise<CustomerSubscription> {
    return api.post('/api/v1/crm/subscriptions', data).then((r) => r.data);
}

function cancelSubscription(id: string): Promise<CustomerSubscription> {
    return api.post(`/api/v1/crm/subscriptions/${id}/cancel`).then((r) => r.data);
}

function getSubscriptionStats(): Promise<{ data: { total: number; active: number; cancelled: number; expired: number } }> {
    return api.get('/api/v1/crm/subscriptions/stats').then((r) => r.data);
}

function getCustomerSubscriptions(customerId: string, filters: Filters = {}): Promise<PaginatedResponse<CustomerSubscription>> {
    return api.get(`/api/v1/crm/customers/${customerId}/subscriptions`, { params: filters }).then((r) => r.data);
}

export function useCustomerSubscriptions(filters: Filters = {}) {
    return useQuery({
        queryKey: ['crm', 'subscriptions', filters],
        queryFn: () => getSubscriptions(filters),
    });
}

export function useCustomerSubscription(id: string) {
    return useQuery({
        queryKey: ['crm', 'subscriptions', id],
        queryFn: () => getSubscription(id),
        enabled: !!id,
    });
}

export function useCreateCustomerSubscription() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: createSubscription,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['crm', 'subscriptions'] });
            qc.invalidateQueries({ queryKey: ['crm', 'customers'] });
        },
    });
}

export function useCancelCustomerSubscription() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: cancelSubscription,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['crm', 'subscriptions'] });
        },
    });
}

export function useCustomerSubscriptionStats() {
    return useQuery({
        queryKey: ['crm', 'subscriptions', 'stats'],
        queryFn: getSubscriptionStats,
    });
}

export function useCustomerSubscriptionsByCustomer(customerId: string, filters: Filters = {}) {
    return useQuery({
        queryKey: ['crm', 'customers', customerId, 'subscriptions', filters],
        queryFn: () => getCustomerSubscriptions(customerId, filters),
        enabled: !!customerId,
    });
}
