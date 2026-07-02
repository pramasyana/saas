import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { CompanyBranding } from '../types';

export function useCompanyBranding() {
    return useQuery<CompanyBranding>({
        queryKey: ['company', 'branding'],
        queryFn: async () => {
            const { data } = await api.get('/api/v1/company/branding');
            return data.data ?? data;
        },
    });
}

export function useUpdateCompanyBranding() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (formData: FormData) => {
            formData.append('_method', 'PUT');
            const { data } = await api.post('/api/v1/company/branding', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['company', 'branding'] });
        },
    });
}
