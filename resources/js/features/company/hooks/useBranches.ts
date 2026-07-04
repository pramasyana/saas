import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { Branch, BranchFormData, PaginationMeta } from '../types';

interface BranchesFilters {
    search?: string;
    page?: number;
    per_page?: number;
}

interface BranchesResponse {
    status: string;
    data: Branch[];
    meta: PaginationMeta;
}

function getBranches(params: BranchesFilters): Promise<BranchesResponse> {
    return api.get('/api/v1/company/branches', { params }).then((res) => res.data);
}

function getAllBranches(): Promise<{ status: string; data: Branch[] }> {
    return api.get('/api/v1/company/branches', { params: { all: true } }).then((res) => res.data);
}

function createBranch(data: BranchFormData): Promise<{ status: string; data: Branch }> {
    return api.post('/api/v1/company/branches', data).then((res) => res.data);
}

function updateBranch(id: string, data: BranchFormData): Promise<{ status: string; data: Branch }> {
    return api.put(`/api/v1/company/branches/${id}`, data).then((res) => res.data);
}

function deleteBranch(id: string): Promise<void> {
    return api.delete(`/api/v1/company/branches/${id}`).then((res) => res.data);
}

function getBranch(id: string): Promise<{ status: string; data: Branch }> {
    return api.get(`/api/v1/company/branches/${id}`).then((res) => res.data);
}

export function useBranch(id: string) {
    return useQuery({
        queryKey: ['company', 'branches', id],
        queryFn: () => getBranch(id),
        enabled: !!id,
        retry: false,
    });
}

export function useBranches(filters: BranchesFilters = {}) {
    return useQuery({
        queryKey: ['company', 'branches', filters],
        queryFn: () => getBranches(filters),
        retry: false,
    });
}

export function useAllBranches() {
    return useQuery({
        queryKey: ['company', 'branches', 'all'],
        queryFn: getAllBranches,
    });
}

export function useCreateBranch() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (data: BranchFormData) => createBranch(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['company', 'branches'] });
        },
    });
}

export function useUpdateBranch() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: BranchFormData }) => updateBranch(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['company', 'branches'] });
        },
    });
}

export function useDeleteBranch() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteBranch(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['company', 'branches'] });
        },
    });
}
