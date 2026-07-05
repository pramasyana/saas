import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export interface SettingItem {
    key: string;
    value: unknown;
    type: string;
    group: string | null;
}

interface SettingsResponse {
    status: string;
    data: SettingItem[];
}

function getSettings(): Promise<SettingsResponse> {
    return api.get('/api/v1/settings').then((r) => r.data);
}

function getSettingsGroup(group: string): Promise<SettingsResponse> {
    return api.get(`/api/v1/settings/group/${group}`).then((r) => r.data);
}

function updateSettings(settings: { key: string; value: unknown; type?: string; group?: string }[]) {
    return api.put('/api/v1/settings', { settings }).then((r) => r.data);
}

export function useSettings() {
    return useQuery({
        queryKey: ['settings'],
        queryFn: getSettings,
        staleTime: 300_000,
    });
}

export function useSettingsGroup(group: string) {
    return useQuery({
        queryKey: ['settings', 'group', group],
        queryFn: () => getSettingsGroup(group),
        enabled: !!group,
        staleTime: 300_000,
    });
}

export function useUpdateSettings() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: updateSettings,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }),
    });
}

export function useSetting(key: string, defaultValue: unknown = null) {
    const { data } = useSettings();
    const item = data?.data?.find((s) => s.key === key);

    return item?.value ?? defaultValue;
}
