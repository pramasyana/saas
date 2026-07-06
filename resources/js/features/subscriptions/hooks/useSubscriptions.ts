import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Invoice, InvoiceFilters, Subscription, SubscriptionFilters } from '@/features/subscriptions/types';
import type { PaginationMeta } from '@/features/users/types';
import api from '@/lib/axios';

interface SubscriptionsResponse {
    status: string;
    data: Subscription[];
    meta: PaginationMeta;
}

interface SubscriptionResponse {
    status: string;
    data: Subscription;
}

interface InvoicesResponse {
    status: string;
    data: Invoice[];
    meta: PaginationMeta;
}

function getInvoices(params: InvoiceFilters): Promise<InvoicesResponse> {
    return api.get('/api/v1/admin/invoices', { params }).then((res) => res.data);
}

export function useInvoices(filters: InvoiceFilters) {
    return useQuery({
        queryKey: ['invoices', filters],
        queryFn: () => getInvoices(filters),
        retry: false,
    });
}

function getSubscriptions(params: SubscriptionFilters): Promise<SubscriptionsResponse> {
    return api.get('/api/v1/admin/subscriptions', { params }).then((res) => res.data);
}

function getSubscription(id: string): Promise<SubscriptionResponse> {
    return api.get(`/api/v1/admin/subscriptions/${id}`).then((res) => res.data);
}

function cancelSubscription({ id, reason }: { id: string; reason?: string }): Promise<SubscriptionResponse> {
    return api.put(`/api/v1/admin/subscriptions/${id}/cancel`, { reason }).then((res) => res.data);
}

function changePlanRequest({ id, plan_id, billing_interval }: { id: string; plan_id: string; billing_interval?: string }): Promise<SubscriptionResponse> {
    return api.put(`/api/v1/admin/subscriptions/${id}/change-plan`, { plan_id, billing_interval }).then((res) => res.data);
}

export function useSubscriptions(filters: SubscriptionFilters) {
    return useQuery({
        queryKey: ['subscriptions', filters],
        queryFn: () => getSubscriptions(filters),
        retry: false,
    });
}

export function useSubscription(id: string) {
    return useQuery({
        queryKey: ['subscription', id],
        queryFn: () => getSubscription(id),
        retry: false,
        enabled: !!id,
    });
}

export function useCancelSubscription() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, reason }: { id: string; reason?: string }) => cancelSubscription({ id, reason }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
        },
    });
}

export function useChangePlan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, plan_id, billing_interval }: { id: string; plan_id: string; billing_interval?: string }) =>
            changePlanRequest({ id, plan_id, billing_interval }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
        },
    });
}
