export interface TenantUser {
    id: string;
    name: string;
    email: string;
    is_active: boolean;
    email_verified_at: string | null;
    is_verified: boolean;
    created_at: string;
    joined_at: string;
}

export interface TenantUserFormData {
    name: string;
    email: string;
    password?: string;
    password_confirmation?: string;
    is_active?: boolean;
}

export interface Staff {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    position: string | null;
    branch_id: string | null;
    branch_name: string | null;
    hire_date: string | null;
    is_active: boolean;
    created_at: string;
}

export interface StaffFormData {
    name: string;
    email?: string;
    phone?: string;
    position?: string;
    branch_id?: string;
    hire_date?: string;
    is_active?: boolean;
}

export interface StaffSchedule {
    id?: string;
    staff_id: string;
    day_of_week: number;
    start_time: string | null;
    end_time: string | null;
    is_active: boolean;
}

export interface Attendance {
    id: string;
    staff_id: string;
    staff_name: string | null;
    date: string;
    clock_in: string | null;
    clock_out: string | null;
    status: 'present' | 'late' | 'absent' | 'half_day';
    notes: string | null;
    created_at: string;
}

export interface AttendanceFormData {
    staff_id: string;
    date: string;
    clock_in?: string;
    clock_out?: string;
    status: 'present' | 'late' | 'absent' | 'half_day';
    notes?: string;
}

export interface Leave {
    id: string;
    staff_id: string;
    staff_name: string | null;
    type: string;
    type_label: string;
    date_start: string;
    date_end: string;
    reason: string | null;
    status: string;
    status_label: string;
    approved_by: number | null;
    approver_name: string | null;
    approved_at: string | null;
    created_at: string;
}

export interface LeaveFormData {
    staff_id: string;
    type: 'sick' | 'vacation' | 'other';
    date_start: string;
    date_end: string;
    reason?: string;
}

export interface Commission {
    id: string;
    staff_id: string;
    staff_name: string | null;
    booking_id: string | null;
    amount: number;
    amount_formatted: string;
    type: string;
    type_label: string;
    date: string;
    notes: string | null;
    created_at: string;
}

export interface CommissionFormData {
    staff_id: string;
    booking_id?: string;
    amount: number;
    type: 'service' | 'product' | 'bonus';
    date: string;
    notes?: string;
}

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

export interface ShiftAssignment {
    id: string;
    staff_id: string;
    staff_name: string;
    branch_id: string | null;
    date: string;
    start_time: string;
    end_time: string;
    notes: string | null;
}

export interface ShiftAssignmentFormData {
    staff_id: string;
    date: string;
    start_time: string;
    end_time: string;
    notes?: string;
}

export interface ShiftCalendarData {
    start_date: string;
    end_date: string;
    assignments: {
        staff_id: string;
        staff_name: string;
        branch_id: string | null;
        shifts: {
            id: string;
            date: string;
            start_time: string;
            end_time: string;
            notes: string | null;
        }[];
    }[];
}
