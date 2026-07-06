import type { Plan } from '@/features/pricing/types';

export interface Subscription {
    id: string;
    user_id: string;
    plan_id: string;
    price_amount: number;
    billing_interval: 'monthly' | 'yearly';
    features_snapshot: FeatureSnapshot[];
    status: 'active' | 'cancelled' | 'expired' | 'trialing';
    starts_at: string | null;
    ends_at: string | null;
    trial_ends_at: string | null;
    cancelled_at: string | null;
    created_at: string | null;
    user?: {
        id: string;
        name: string;
        email: string;
    };
    plan?: Plan;
    invoices?: Invoice[];
}

export interface FeatureSnapshot {
    key: string;
    label: string;
    type: 'boolean' | 'numeric';
    value: string;
}

export interface Invoice {
    id: string;
    subscription_id: string;
    number: string;
    amount: number;
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    due_date: string | null;
    paid_at: string | null;
    notes: string | null;
    created_at: string | null;
    subscription?: Subscription;
}

export interface SubscriptionFilters {
    search?: string;
    status?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
    page?: number;
    per_page?: number;
}

export interface InvoiceFilters {
    status?: string;
    subscription_id?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
    page?: number;
    per_page?: number;
}
