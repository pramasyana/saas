import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { LoyaltyConfig } from '@/features/crm/types';
import api from '@/lib/axios';

interface ApiResponse {
    status: string;
    data: LoyaltyConfig;
}

function getConfig(): Promise<ApiResponse> {
    return api.get('/api/v1/crm/loyalty/config').then((r) => r.data);
}

function updateConfig(data: LoyaltyConfig): Promise<ApiResponse> {
    return api.put('/api/v1/crm/loyalty/config', data).then((r) => r.data);
}

export function useLoyaltyConfig() {
    return useQuery({
        queryKey: ['loyalty-config'],
        queryFn: getConfig,
    });
}

export function useUpdateLoyaltyConfig() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateConfig,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['loyalty-config'] });
        },
    });
}
