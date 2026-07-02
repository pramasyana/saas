import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { Membership, MembershipFormData } from '../types';

function getCustomerMembership(customerId: string): Promise<{ data: Membership }> {
    return api.get(`/api/v1/crm/customers/${customerId}/membership`).then((r) => r.data);
}

function updateMembership(customerId: string, data: MembershipFormData): Promise<Membership> {
    return api.put(`/api/v1/crm/customers/${customerId}/membership`, data).then((r) => r.data);
}

export function useCustomerMembership(customerId: string) {
    return useQuery({
        queryKey: ['crm', 'membership', customerId],
        queryFn: () => getCustomerMembership(customerId),
        enabled: !!customerId,
    });
}

export function useUpdateMembership() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ customerId, data }: { customerId: string; data: MembershipFormData }) => updateMembership(customerId, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['crm', 'membership'] }),
    });
}
