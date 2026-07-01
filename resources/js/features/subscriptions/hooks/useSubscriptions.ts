import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { Subscription, SubscriptionFilters } from '@/features/subscriptions/types';
import type { PaginationMeta } from '@/features/users/types';

interface SubscriptionsResponse {
    status: string;
    data: Subscription[];
    meta: PaginationMeta;
}

interface SubscriptionResponse {
    status: string;
    data: Subscription;
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
