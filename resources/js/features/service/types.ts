export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    color: string | null;
    sort_order: number;
    is_active: boolean;
    services_count?: number;
    created_at: string;
}

export interface CategoryFormData {
    name: string;
    description?: string;
    color?: string;
    sort_order?: number;
    is_active?: boolean;
}

export interface ServiceItem {
    id: string;
    category_id: string | null;
    category_name: string | null;
    name: string;
    description: string | null;
    duration: number;
    price: number;
    color: string | null;
    is_active: boolean;
    created_at: string;
}

export interface ServiceFormData {
    category_id?: string;
    name: string;
    description?: string;
    duration: number;
    price: number;
    color?: string;
    is_active?: boolean;
}

export interface Package {
    id: string;
    name: string;
    description: string | null;
    price: number;
    duration: number;
    is_active: boolean;
    services: PackageService[];
    services_count?: number;
    created_at: string;
}

export interface PackageService {
    id: string;
    service_id: string;
    name: string;
    duration: number;
    price: number;
    quantity: number;
    sort_order: number;
}

export interface PackageFormData {
    name: string;
    description?: string;
    price: number;
    duration?: number;
    is_active?: boolean;
    services?: { service_id: string; quantity?: number; sort_order?: number }[];
}

export interface Addon {
    id: string;
    name: string;
    description: string | null;
    price: number;
    duration: number | null;
    is_active: boolean;
    created_at: string;
}

export interface AddonFormData {
    name: string;
    description?: string;
    price: number;
    duration?: number;
    is_active?: boolean;
}

export interface PricingRule {
    id: string;
    name: string;
    description: string | null;
    action_type: 'percentage_discount' | 'fixed_discount' | 'percentage_surcharge' | 'fixed_surcharge' | 'price_override';
    action_label: string;
    value: number;
    conditions: PricingRuleConditions;
    priority: number;
    is_active: boolean;
    start_date: string | null;
    end_date: string | null;
    created_at: string;
}

export interface PricingRuleConditions {
    apply_to?: ('service' | 'package' | 'addon')[];
    category_ids?: string[];
    service_ids?: string[];
    package_ids?: string[];
    addon_ids?: string[];
    branch_ids?: string[];
    staff_ids?: string[];
    days_of_week?: number[];
    time_start?: string;
    time_end?: string;
    min_price?: number;
    max_price?: number;
    customer_condition?: string;
}

export interface PricingRuleFormData {
    name: string;
    description?: string;
    action_type: string;
    value: number;
    conditions: PricingRuleConditions;
    priority?: number;
    is_active?: boolean;
    start_date?: string;
    end_date?: string;
}

export interface Promotion {
    id: string;
    name: string;
    description: string | null;
    code: string | null;
    promotion_type: 'percentage' | 'fixed' | 'buy_x_get_y';
    promotion_label: string;
    value: number;
    conditions: Record<string, unknown> | null;
    usage_limit: number | null;
    usage_count: number;
    min_purchase: number | null;
    max_discount: number | null;
    is_active: boolean;
    start_date: string | null;
    end_date: string | null;
    created_at: string;
}

export interface PromotionFormData {
    name: string;
    description?: string;
    code?: string;
    promotion_type: string;
    value: number;
    conditions?: Record<string, unknown>;
    usage_limit?: number;
    min_purchase?: number;
    max_discount?: number;
    is_active?: boolean;
    start_date?: string;
    end_date?: string;
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
