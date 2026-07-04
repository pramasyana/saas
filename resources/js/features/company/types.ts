export interface CompanyProfile {
    address: string | null;
    city: string | null;
    province: string | null;
    postal_code: string | null;
    country: string | null;
    phone: string | null;
}

export interface CompanyBranding {
    primary_color: string | null;
    secondary_color: string | null;
    favicon_url: string | null;
    favicon_path: string | null;
    custom_css: string | null;
}

export interface Branch {
    id: string;
    name: string;
    slug: string;
    is_default: boolean;
    address: string | null;
    phone: string | null;
    email: string | null;
    whatsapp: string | null;
    manager_name: string | null;
    map_embed_url: string | null;
    latitude: number | null;
    longitude: number | null;
    is_active: boolean;
    sort_order: number;
    created_at: string;
}

export interface BranchFormData {
    name: string;
    slug: string;
    address?: string;
    phone?: string;
    email?: string;
    whatsapp?: string;
    manager_name?: string;
    is_active?: boolean;
    sort_order?: number;
    map_embed_url?: string;
    latitude?: number;
    longitude?: number;
}

export interface WorkingHour {
    id?: string;
    day_of_week: number;
    is_open: boolean;
    open_time: string | null;
    close_time: string | null;
}

export interface Holiday {
    id: string;
    name: string;
    date_start: string;
    date_end: string;
    is_recurring_yearly: boolean;
    description: string | null;
    branch_id: string | null;
    branch_name: string | null;
    created_at: string;
}

export interface HolidayFormData {
    name: string;
    date_start: string;
    date_end: string;
    is_recurring_yearly?: boolean;
    description?: string;
    branch_id?: string;
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
