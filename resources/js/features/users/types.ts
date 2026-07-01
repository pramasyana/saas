export interface User {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    is_active: boolean;
    email_verified_at: string | null;
    is_verified: boolean;
    created_at: string;
    joined_at: string;
}

export interface UserFormData {
    name: string;
    email: string;
    password?: string;
    password_confirmation?: string;
    is_admin?: boolean;
}

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface EmailLog {
    id: string;
    user_id: number;
    channel: string;
    subject: string;
    status: 'sent' | 'failed';
    error_message: string | null;
    attempt: number;
    metadata: Record<string, unknown> | null;
    created_at: string;
}

export interface UserFilters {
    search?: string;
    is_admin?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
    page?: number;
    per_page?: number;
}
