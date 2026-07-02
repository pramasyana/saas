import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { FeatureDefinition, Plan, PlanFilters, PlanFormData } from '@/features/pricing/types';
import type { PaginationMeta } from '@/features/users/types';
import api from '@/lib/axios';

interface PlansResponse {
    status: string;
    data: Plan[];
    meta: PaginationMeta;
}

interface FeatureDefinitionsResponse {
    status: string;
    data: FeatureDefinition[];
}

function getPlans(params: PlanFilters): Promise<PlansResponse> {
    return api.get('/api/v1/admin/plans', { params }).then((res) => res.data);
}

function getPlan(id: string): Promise<{ status: string; data: Plan }> {
    return api.get(`/api/v1/admin/plans/${id}`).then((res) => res.data);
}

function createPlan(data: PlanFormData): Promise<{ status: string; message: string; data: Plan }> {
    return api.post('/api/v1/admin/plans', data).then((res) => res.data);
}

function updatePlan({ id, data }: { id: string; data: Partial<PlanFormData> }): Promise<{ status: string; message: string; data: Plan }> {
    return api.put(`/api/v1/admin/plans/${id}`, data).then((res) => res.data);
}

function deletePlan(id: string): Promise<{ status: string; message: string }> {
    return api.delete(`/api/v1/admin/plans/${id}`).then((res) => res.data);
}

function getFeatureDefinitions(): Promise<FeatureDefinitionsResponse> {
    return api.get('/api/v1/admin/feature-definitions').then((res) => res.data);
}

export function usePlans(filters: PlanFilters) {
    return useQuery({
        queryKey: ['plans', filters],
        queryFn: () => getPlans(filters),
        retry: false,
    });
}

export function usePlan(id: string) {
    return useQuery({
        queryKey: ['plan', id],
        queryFn: () => getPlan(id),
        retry: false,
        enabled: !!id,
    });
}

export function useCreatePlan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: PlanFormData) => createPlan(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['plans'] });
        },
    });
}

export function useUpdatePlan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<PlanFormData> }) => updatePlan({ id, data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['plans'] });
        },
    });
}

function togglePopular(id: string): Promise<{ status: string; message: string; data: Plan }> {
    return api.put(`/api/v1/admin/plans/${id}/toggle-popular`).then((res) => res.data);
}

export function useTogglePopular() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => togglePopular(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['plans'] });
        },
    });
}

export function useDeletePlan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deletePlan(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['plans'] });
        },
    });
}

export function useFeatureDefinitions() {
    return useQuery({
        queryKey: ['feature-definitions'],
        queryFn: getFeatureDefinitions,
        staleTime: 5 * 60 * 1000,
    });
}
