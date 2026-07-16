export interface CustomerInvoiceItem {
    id: string;
    type: 'service' | 'addon' | 'discount' | 'tax';
    type_label: string;
    name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    metadata: Record<string, unknown> | null;
}

export interface CustomerInvoice {
    id: string;
    number: string;
    booking_id: string | null;
    customer_id: string | null;
    customer_name: string | null;
    customer_email: string | null;
    customer_phone: string | null;
    customer_address: string | null;
    booking_code: string | null;
    subtotal: number;
    tax_rate: number;
    tax_amount: number;
    discount_amount: number;
    total_amount: number;
    status: 'draft' | 'pending' | 'paid' | 'partial' | 'cancelled';
    status_label: string;
    payment_method: string | null;
    payment_method_label: string | null;
    paid_amount: number;
    paid_at: string | null;
    notes: string | null;
    due_date: string | null;
    is_overdue: boolean;
    items: CustomerInvoiceItem[];
    created_at: string | null;
}

export interface CustomerInvoiceFilters {
    status?: string;
    customer_id?: string;
    search?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
    page?: number;
    per_page?: number;
}

export interface CustomerInvoiceStats {
    total: number;
    total_amount: number;
    paid_count: number;
    paid_amount: number;
    pending_count: number;
    pending_amount: number;
    overdue_count: number;
}
