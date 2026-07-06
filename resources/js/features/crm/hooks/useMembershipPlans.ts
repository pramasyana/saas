import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { CustomerMembershipPlan, CustomerMembershipPlanFormData, PaginatedResponse } from '../types';

interface Filters {
    search?: string;
    is_active?: boolean;
    billing_interval?: string;
    page?: number;
    per_page?: number;
}

function getPlans(filters: Filters = {}): Promise<PaginatedResponse<CustomerMembershipPlan>> {
    return api.get('/api/v1/crm/membership-plans', { params: filters }).then((r) => r.data);
}

function getAllPlans(): Promise<{ data: CustomerMembershipPlan[] }> {
    return api.get('/api/v1/crm/membership-plans/all').then((r) => r.data);
}

function getPlan(id: string): Promise<{ data: CustomerMembershipPlan }> {
    return api.get(`/api/v1/crm/membership-plans/${id}`).then((r) => r.data);
}

function createPlan(data: CustomerMembershipPlanFormData): Promise<CustomerMembershipPlan> {
    return api.post('/api/v1/crm/membership-plans', data).then((r) => r.data);
}

function updatePlan(id: string, data: CustomerMembershipPlanFormData): Promise<CustomerMembershipPlan> {
    return api.put(`/api/v1/crm/membership-plans/${id}`, data).then((r) => r.data);
}

function deletePlan(id: string): Promise<void> {
    return api.delete(`/api/v1/crm/membership-plans/${id}`).then((r) => r.data);
}

function getPlanStats(): Promise<{ data: { total_plans: number; active_plans: number; inactive_plans: number; total_subscribers: number } }> {
    return api.get('/api/v1/crm/membership-plans/stats').then((r) => r.data);
}

export function useMembershipPlans(filters: Filters = {}) {
    return useQuery({
        queryKey: ['crm', 'membership-plans', filters],
        queryFn: () => getPlans(filters),
    });
}

export function useAllMembershipPlans() {
    return useQuery({
        queryKey: ['crm', 'membership-plans', 'all'],
        queryFn: getAllPlans,
    });
}

export function useMembershipPlan(id: string) {
    return useQuery({
        queryKey: ['crm', 'membership-plans', id],
        queryFn: () => getPlan(id),
        enabled: !!id,
    });
}

export function useCreateMembershipPlan() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: createPlan,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['crm', 'membership-plans'] });
        },
    });
}

export function useUpdateMembershipPlan() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: CustomerMembershipPlanFormData }) => updatePlan(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['crm', 'membership-plans'] });
        },
    });
}

export function useDeleteMembershipPlan() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: deletePlan,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['crm', 'membership-plans'] });
        },
    });
}

export function useMembershipPlanStats() {
    return useQuery({
        queryKey: ['crm', 'membership-plans', 'stats'],
        queryFn: getPlanStats,
    });
}
