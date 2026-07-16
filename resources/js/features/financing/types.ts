import api from '@/lib/axios';

export interface CostCategory {
    id: string;
    name: string;
    description: string | null;
    color: string;
    sort_order: number;
    costs_count: number;
    costs_sum_amount: number;
    created_at: string;
}

export interface CostCategoryFormData {
    name: string;
    description?: string;
    color?: string;
    sort_order?: number;
}

export interface Cost {
    id: string;
    name: string;
    amount: number;
    date: string;
    notes: string | null;
    attachment: string | null;
    category: {
        id: string;
        name: string;
        color: string;
    };
    creator: {
        id: string;
        name: string;
    };
    created_at: string;
}

export interface CostFormData {
    cost_category_id: string;
    name: string;
    amount: number;
    date: string;
    notes?: string;
}

export interface FinancingOverview {
    total_revenue: number;
    total_cost: number;
    profit: number;
    profit_margin: number;
    total_revenue_all_time: number;
    total_cost_all_time: number;
    cost_growth: number;
    start_date: string;
    end_date: string;
}

export interface MonthlyData {
    labels: string[];
    revenue: number[];
    costs: number[];
    profits: number[];
}

export interface CostBreakdown {
    name: string;
    color: string;
    total: number;
}

export interface FinancingStats {
    total_categories: number;
    total_costs: number;
    current_month_cost: number;
    prev_month_cost: number;
}
