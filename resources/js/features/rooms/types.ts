export interface Room {
    id: string;
    branch_id: string | null;
    branch_name: string | null;
    name: string;
    description: string | null;
    capacity: number | null;
    color: string;
    is_active: boolean;
    created_at: string;
}

export interface RoomFormData {
    branch_id?: string;
    name: string;
    description?: string;
    capacity?: number;
    color?: string;
    is_active?: boolean;
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
