import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

interface AdminSettingsResponse {
    status: string;
    data: {
        base_domain: string;
    };
}

function getAdminSettings(): Promise<AdminSettingsResponse> {
    return api.get('/api/v1/admin/settings').then((r) => r.data);
}

function updateAdminSettings(payload: { base_domain: string }): Promise<AdminSettingsResponse> {
    return api.put('/api/v1/admin/settings', payload).then((r) => r.data);
}

export function useAdminSettings() {
    return useQuery({
        queryKey: ['admin-settings'],
        queryFn: getAdminSettings,
        staleTime: 300_000,
    });
}

export function useUpdateAdminSettings() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: updateAdminSettings,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-settings'] }),
    });
}
