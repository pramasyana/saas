import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { Review, ReviewFormData, PaginatedResponse } from '../types';

interface Filters {
    search?: string;
    is_approved?: boolean;
    rating?: number;
    page?: number;
    per_page?: number;
}

function getReviews(filters: Filters): Promise<PaginatedResponse<Review>> {
    return api.get('/api/v1/crm/reviews', { params: filters }).then((r) => r.data);
}

function updateReview(id: string, data: ReviewFormData): Promise<Review> {
    return api.put(`/api/v1/crm/reviews/${id}`, data).then((r) => r.data);
}

export function useReviews(filters: Filters) {
    return useQuery({
        queryKey: ['crm', 'reviews', 'all', filters],
        queryFn: () => getReviews(filters),
    });
}

export function useUpdateReview() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: ReviewFormData }) => updateReview(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['crm', 'reviews'] }),
    });
}
