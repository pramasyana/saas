import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

interface AnalyticsData {
    total: number;
    confirmed: number;
    in_progress: number;
    completed: number;
    cancelled: number;
    no_show: number;
    booking_chart: { day: string; date: string; count: number }[];
    revenue_month: number;
    revenue_week: number;
    top_services: { name: string; total_bookings: number; total_revenue: number }[];
    staff_performance: { id: string; name: string; total_bookings: number; total_revenue: number }[];
}

function getAnalytics(): Promise<{ data: AnalyticsData }> {
    return api.get('/api/v1/booking/analytics/overview').then((r) => r.data);
}

export function useAnalytics() {
    return useQuery({
        queryKey: ['booking', 'analytics', 'overview'],
        queryFn: getAnalytics,
        refetchInterval: 60_000,
    });
}
