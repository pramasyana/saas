import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { PaginatedResponse } from '../types';

export interface Reminder {
    id: string;
    booking_id: string;
    booking_code: string;
    customer_name: string;
    type: string;
    status: 'pending' | 'sent' | 'failed' | 'cancelled';
    scheduled_at: string | null;
    sent_at: string | null;
    error_message: string | null;
    created_at: string;
}

interface ReminderFilters {
    status?: string;
    page?: number;
    per_page?: number;
}

function getReminders(filters: ReminderFilters): Promise<PaginatedResponse<Reminder>> {
    return api.get('/api/v1/booking/reminders', { params: filters }).then((r) => r.data);
}

export function useReminders(filters: ReminderFilters) {
    return useQuery({
        queryKey: ['booking-reminders', filters],
        queryFn: () => getReminders(filters),
    });
}
