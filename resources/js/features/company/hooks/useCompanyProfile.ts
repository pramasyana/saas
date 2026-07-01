import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { CompanyProfile } from '../types';

export function useCompanyProfile() {
    return useQuery<CompanyProfile>({
        queryKey: ['company', 'profile'],
        queryFn: async () => {
            const { data } = await api.get('/company/profile');
            return data.data ?? data;
        },
    });
}

export function useUpdateCompanyProfile() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (formData: CompanyProfile) => {
            const { data } = await api.put('/company/profile', formData);
            return data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['company', 'profile'] });
        },
    });
}
