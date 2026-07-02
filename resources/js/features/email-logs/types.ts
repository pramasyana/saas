export interface EmailLog {
    id: string;
    user_id: string;
    channel: string;
    subject: string;
    status: 'sent' | 'failed';
    error_message: string | null;
    attempt: number;
    metadata: Record<string, unknown> | null;
    created_at: string;
    user: {
        id: string;
        name: string;
        email: string;
    } | null;
}

export interface EmailLogFilters {
    search?: string;
    status?: string;
    channel?: string;
    user_id?: string;
    page?: number;
    per_page?: number;
}
