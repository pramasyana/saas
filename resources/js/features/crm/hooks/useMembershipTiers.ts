import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { MembershipTier, MembershipTierFormData, PaginatedResponse } from '../types';

interface Filters {
    search?: string;
    is_active?: boolean;
    page?: number;
    per_page?: number;
}

function getMembershipTiers(filters: Filters = { per_page: 100 }): Promise<PaginatedResponse<MembershipTier>> {
    return api.get('/api/v1/crm/membership-tiers', { params: filters }).then((r) => r.data);
}

function createMembershipTier(data: MembershipTierFormData): Promise<MembershipTier> {
    return api.post('/api/v1/crm/membership-tiers', data).then((r) => r.data);
}

function updateMembershipTier(id: string, data: MembershipTierFormData): Promise<MembershipTier> {
    return api.put(`/api/v1/crm/membership-tiers/${id}`, data).then((r) => r.data);
}

function deleteMembershipTier(id: string): Promise<void> {
    return api.delete(`/api/v1/crm/membership-tiers/${id}`).then((r) => r.data);
}

export function useMembershipTiers(filters: Filters = { per_page: 100 }) {
    return useQuery({
        queryKey: ['crm', 'membership-tiers', filters],
        queryFn: () => getMembershipTiers(filters),
    });
}

export function useCreateMembershipTier() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: createMembershipTier,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['crm', 'membership-tiers'] }),
    });
}

export function useUpdateMembershipTier() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: MembershipTierFormData }) => updateMembershipTier(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['crm', 'membership-tiers'] }),
    });
}

export function useDeleteMembershipTier() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: deleteMembershipTier,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['crm', 'membership-tiers'] }),
    });
}
