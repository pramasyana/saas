import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { Review, ReviewFormData, PaginatedResponse } from '../types';

interface Filters {
    page?: number;
    per_page?: number;
}

function getCustomerReviews(customerId: string, filters: Filters): Promise<PaginatedResponse<Review>> {
    return api.get(`/api/v1/crm/customers/${customerId}/reviews`, { params: filters }).then((r) => r.data);
}

function createReview(customerId: string, data: ReviewFormData): Promise<Review> {
    return api.post(`/api/v1/crm/customers/${customerId}/reviews`, data).then((r) => r.data);
}

function approveReview(id: string): Promise<Review> {
    return api.post(`/api/v1/crm/reviews/${id}/approve`).then((r) => r.data);
}

function deleteReview(id: string): Promise<void> {
    return api.delete(`/api/v1/crm/reviews/${id}`).then((r) => r.data);
}

export function useCustomerReviews(customerId: string, filters: Filters) {
    return useQuery({
        queryKey: ['crm', 'reviews', customerId, filters],
        queryFn: () => getCustomerReviews(customerId, filters),
        enabled: !!customerId,
    });
}

export function useCreateReview() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ customerId, data }: { customerId: string; data: ReviewFormData }) => createReview(customerId, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['crm', 'reviews'] }),
    });
}

export function useApproveReview() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: approveReview,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['crm', 'reviews'] }),
    });
}

export function useDeleteReview() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: deleteReview,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['crm', 'reviews'] }),
    });
}
