export interface FeatureDefinition {
    id: string;
    key: string;
    label: string;
    description: string | null;
    type: 'boolean' | 'numeric';
    default_value: string | null;
    category: string;
    sort_order: number;
}

export interface PlanFeature {
    id: string;
    feature_definition_id: string;
    value: string | null;
    definition: FeatureDefinition;
}

export interface Plan {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price_monthly: number;
    price_yearly: number | null;
    is_active: boolean;
    is_popular: boolean;
    sort_order: number;
    features: PlanFeature[];
    created_at: string;
}

export interface PlanFormData {
    name: string;
    slug: string;
    description: string;
    price_monthly: number;
    price_yearly: number | null;
    is_active: boolean;
    is_popular: boolean;
    sort_order: number;
    features: { feature_definition_id: string; value: string | null }[];
}

export interface PlanFilters {
    search?: string;
    is_active?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
    page?: number;
    per_page?: number;
}
