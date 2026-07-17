import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type {
    Cost,
    CostBreakdown,
    CostCategory,
    CostCategoryFormData,
    CostFormData,
    FinancingOverview,
    FinancingStats,
    MonthlyData,
} from '../types';

interface PaginatedResponse<T> {
    status: string;
    message: string;
    data: T[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

interface ApiResponse<T> {
    status: string;
    message: string;
    data: T;
}

// ─── Overview ────────────────────────────────────────

function getOverview(params?: { start_date?: string; end_date?: string }): Promise<ApiResponse<FinancingOverview>> {
    return api.get('/api/v1/financing/overview', { params }).then((r) => r.data);
}

function getMonthly(months = 12): Promise<ApiResponse<MonthlyData>> {
    return api.get('/api/v1/financing/monthly', { params: { months } }).then((r) => r.data);
}

function getBreakdown(params?: { start_date?: string; end_date?: string }): Promise<ApiResponse<CostBreakdown[]>> {
    return api.get('/api/v1/financing/breakdown', { params }).then((r) => r.data);
}

function getStats(): Promise<ApiResponse<FinancingStats>> {
    return api.get('/api/v1/financing/stats').then((r) => r.data);
}

export function useFinancingOverview(params?: { start_date?: string; end_date?: string }) {
    return useQuery({
        queryKey: ['financing', 'overview', params],
        queryFn: () => getOverview(params),
    });
}

export function useFinancingMonthly(months = 12) {
    return useQuery({
        queryKey: ['financing', 'monthly', months],
        queryFn: () => getMonthly(months),
    });
}

export function useFinancingBreakdown(params?: { start_date?: string; end_date?: string }) {
    return useQuery({
        queryKey: ['financing', 'breakdown', params],
        queryFn: () => getBreakdown(params),
    });
}

export function useFinancingStats() {
    return useQuery({
        queryKey: ['financing', 'stats'],
        queryFn: getStats,
    });
}

// ─── Costs ───────────────────────────────────────────

interface CostFilters {
    search?: string;
    category_id?: string;
    date_from?: string;
    date_to?: string;
    page?: number;
    per_page?: number;
}

function getCosts(filters: CostFilters): Promise<PaginatedResponse<Cost>> {
    return api.get('/api/v1/financing/costs', { params: filters }).then((r) => r.data);
}

function createCost(data: CostFormData): Promise<ApiResponse<Cost>> {
    return api.post('/api/v1/financing/costs', data).then((r) => r.data);
}

function updateCost(id: string, data: CostFormData): Promise<ApiResponse<Cost>> {
    return api.put(`/api/v1/financing/costs/${id}`, data).then((r) => r.data);
}

function deleteCost(id: string): Promise<ApiResponse<null>> {
    return api.delete(`/api/v1/financing/costs/${id}`).then((r) => r.data);
}

function importCosts(csvData: string): Promise<ApiResponse<{ imported: number }>> {
    return api.post('/api/v1/financing/import', { csv_data: csvData }).then((r) => r.data);
}

export function useCosts(filters: CostFilters) {
    return useQuery({
        queryKey: ['financing', 'costs', filters],
        queryFn: () => getCosts(filters),
    });
}

export function useCreateCost() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: createCost,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['financing', 'costs'] });
            qc.invalidateQueries({ queryKey: ['financing', 'overview'] });
            qc.invalidateQueries({ queryKey: ['financing', 'monthly'] });
            qc.invalidateQueries({ queryKey: ['financing', 'breakdown'] });
            qc.invalidateQueries({ queryKey: ['financing', 'stats'] });
        },
    });
}

export function useUpdateCost() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: CostFormData }) => updateCost(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['financing', 'costs'] });
            qc.invalidateQueries({ queryKey: ['financing', 'overview'] });
            qc.invalidateQueries({ queryKey: ['financing', 'monthly'] });
            qc.invalidateQueries({ queryKey: ['financing', 'breakdown'] });
        },
    });
}

export function useDeleteCost() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: deleteCost,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['financing', 'costs'] });
            qc.invalidateQueries({ queryKey: ['financing', 'overview'] });
            qc.invalidateQueries({ queryKey: ['financing', 'monthly'] });
            qc.invalidateQueries({ queryKey: ['financing', 'breakdown'] });
            qc.invalidateQueries({ queryKey: ['financing', 'stats'] });
        },
    });
}

export function useImportCosts() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: importCosts,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['financing', 'costs'] });
            qc.invalidateQueries({ queryKey: ['financing', 'overview'] });
            qc.invalidateQueries({ queryKey: ['financing', 'monthly'] });
            qc.invalidateQueries({ queryKey: ['financing', 'breakdown'] });
            qc.invalidateQueries({ queryKey: ['financing', 'stats'] });
        },
    });
}

// ─── Categories ──────────────────────────────────────

function getCategories(): Promise<ApiResponse<CostCategory[]>> {
    return api.get('/api/v1/financing/categories').then((r) => r.data);
}

function createCategory(data: CostCategoryFormData): Promise<ApiResponse<CostCategory>> {
    return api.post('/api/v1/financing/categories', data).then((r) => r.data);
}

function updateCategory(id: string, data: CostCategoryFormData): Promise<ApiResponse<CostCategory>> {
    return api.put(`/api/v1/financing/categories/${id}`, data).then((r) => r.data);
}

function deleteCategory(id: string): Promise<ApiResponse<null>> {
    return api.delete(`/api/v1/financing/categories/${id}`).then((r) => r.data);
}

export function useCostCategories() {
    return useQuery({
        queryKey: ['financing', 'categories'],
        queryFn: getCategories,
    });
}

export function useCreateCategory() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: createCategory,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['financing', 'categories'] }),
    });
}

export function useUpdateCategory() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: CostCategoryFormData }) => updateCategory(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['financing', 'categories'] }),
    });
}

export function useDeleteCategory() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['financing', 'categories'] });
            qc.invalidateQueries({ queryKey: ['financing', 'costs'] });
        },
    });
}
