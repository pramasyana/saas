export interface Tenant {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    data: Record<string, unknown> | null;
    domains: string[];
    user: { id: number; name: string; email: string } | null;
    users_count: number;
    subscriptions_count: number;
    created_at: string;
    joined_at: string;
}

export interface TenantFormData {
    name: string;
    email?: string;
    phone?: string;
    domain?: string;
}

export interface TenantFilters {
    search?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
    page?: number;
    per_page?: number;
}

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}
