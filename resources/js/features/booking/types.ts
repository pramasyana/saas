export interface Booking {
    id: string;
    booking_code: string;
    branch_id: string | null;
    branch_name: string | null;
    customer_id: string;
    customer_name: string;
    customer_phone: string | null;
    staff_id: string | null;
    staff_name: string | null;
    start_time: string;
    end_time: string;
    duration_minutes: number;
    status: BookingStatus;
    source: 'online' | 'walk_in' | 'phone';
    notes: string | null;
    total_guests: number;
    guest_details: string[] | null;
    services: BookingServiceItem[];
    reminders: ReminderItem[];
    status_logs: StatusLogItem[];
    created_at: string;
}

export interface ReminderItem {
    id: string;
    booking_id: string;
    type: string;
    status: 'pending' | 'sent' | 'failed' | 'cancelled';
    scheduled_at: string | null;
    sent_at: string | null;
    error_message: string | null;
}

export interface StatusLogItem {
    from_status: string | null;
    to_status: string;
    changed_by: string;
    changed_by_name: string | null;
    notes: string | null;
    created_at: string;
}

export interface BookingServiceItem {
    id: string;
    service_id: string | null;
    name: string;
    price: number;
    duration: number;
    quantity: number;
    sort_order: number;
    addons?: { name: string; price: number; quantity: number }[];
}

export interface BookingFormData {
    branch_id?: string;
    customer_id: string;
    staff_id?: string;
    start_time: string;
    end_time: string;
    duration_minutes: number;
    status?: string;
    source?: string;
    notes?: string;
    services?: {
        service_id?: string;
        name: string;
        price: number;
        duration: number;
        quantity?: number;
        sort_order?: number;
    }[];
}

export interface CalendarEvent {
    id: string;
    title: string;
    start: string;
    end: string;
    backgroundColor: string;
    borderColor: string;
    textColor: string;
    extendedProps: {
        status: BookingStatus;
        source: string;
        customer_name: string;
        customer_phone: string | null;
        staff_name: string | null;
        duration_minutes: number;
        notes: string | null;
        services: string[];
    };
}

export interface WaitingList {
    id: string;
    branch_id: string | null;
    customer_id: string;
    customer_name: string;
    customer_phone: string | null;
    service_id: string | null;
    service_name: string | null;
    preferred_date: string;
    preferred_time: string | null;
    notes: string | null;
    status: 'waiting' | 'notified' | 'booked' | 'cancelled';
    position: number;
    notified_at: string | null;
    created_at: string;
}

export interface WaitingListFormData {
    branch_id?: string;
    customer_id: string;
    service_id?: string;
    preferred_date: string;
    preferred_time?: string;
    notes?: string;
}

export interface AvailabilitySlot {
    time: string;
    start_time: string;
    end_time: string;
    staff: { id: string; name: string }[];
}

export interface AvailabilityResult {
    date: string;
    available: boolean;
    reason?: string;
    slots: AvailabilitySlot[];
}

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}
