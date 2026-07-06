import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

interface QueueStatus {
    pending_jobs: number;
    failed_jobs: number;
    healthy: boolean;
}

interface FailedJob {
    id: number;
    uuid: string;
    connection: string;
    queue: string;
    failed_at: string;
}

interface JobBatch {
    id: string;
    name: string;
    total_jobs: number;
    pending_jobs: number;
    failed_jobs: number;
    created_at: string;
    finished_at: string | null;
}

interface CacheStatus {
    reachable: boolean;
    driver: string;
}

interface MaintenanceStatus {
    active: boolean;
}

interface SystemHealth {
    queue: QueueStatus;
    failed_jobs: { total: number; recent: FailedJob[] };
    job_batches: JobBatch[];
    cache: CacheStatus;
    maintenance: MaintenanceStatus;
}

interface SystemHealthResponse {
    status: string;
    data: SystemHealth;
}

function getSystemHealth(): Promise<SystemHealthResponse> {
    return api.get('/api/v1/admin/system').then((res) => res.data);
}

function toggleMaintenance(): Promise<{ status: string; message: string; data: MaintenanceStatus }> {
    return api.post('/api/v1/admin/system/maintenance').then((res) => res.data);
}

export function useSystemHealth() {
    return useQuery({
        queryKey: ['system-health'],
        queryFn: getSystemHealth,
        retry: false,
        refetchInterval: 30_000,
    });
}

export function useToggleMaintenance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: toggleMaintenance,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['system-health'] });
        },
    });
}
