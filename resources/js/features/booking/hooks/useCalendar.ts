import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { CalendarEvent } from '../types';

interface CalendarFilters {
    start: string;
    end: string;
    branch_id?: string;
    staff_id?: string;
}

function getCalendarEvents(filters: CalendarFilters): Promise<{ data: CalendarEvent[] }> {
    return api.get('/api/v1/booking/calendar', { params: filters }).then((r) => r.data);
}

export function useCalendar(filters: CalendarFilters) {
    return useQuery({
        queryKey: ['booking-calendar', filters],
        queryFn: () => getCalendarEvents(filters),
        enabled: !!filters.start && !!filters.end,
    });
}
