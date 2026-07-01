export interface PlanFeature {
    id: string;
    value: string;
    definition: {
        key: string;
        label: string;
        type: string;
        category: string;
    };
}

export interface Plan {
    id: string;
    name: string;
    slug: string;
    description: string;
    price_monthly: number;
    price_yearly: number | null;
    is_popular: boolean;
    is_active?: boolean;
    sort_order: number;
    features: PlanFeature[];
}

export type BillingInterval = 'monthly' | 'yearly';
