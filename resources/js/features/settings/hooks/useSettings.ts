import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { ApiResponse } from '@/features/settings/types';

export function useSettings() {
    return useQuery<ApiResponse>({
        queryKey: ['settings'],
        queryFn: async () => {
            const { data } = await axios.get('/api/v1/admin/settings');

            return data;
        },
    });
}

export function useUpdateSettings() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: { base_domain: string }) => {
            const { data } = await axios.put('/api/v1/admin/settings', payload);

            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['settings'] });
        },
    });
}
