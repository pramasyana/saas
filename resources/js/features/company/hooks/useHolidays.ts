import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { Holiday, HolidayFormData, PaginationMeta } from '../types';

interface HolidaysFilters {
    search?: string;
    branch_id?: string;
    page?: number;
    per_page?: number;
}

interface HolidaysResponse {
    status: string;
    data: Holiday[];
    meta: PaginationMeta;
}

function getHolidays(params: HolidaysFilters): Promise<HolidaysResponse> {
    return api.get('/company/holidays', { params }).then((res) => res.data);
}

function createHoliday(data: HolidayFormData): Promise<{ status: string; data: Holiday }> {
    return api.post('/company/holidays', data).then((res) => res.data);
}

function updateHoliday(id: string, data: HolidayFormData): Promise<{ status: string; data: Holiday }> {
    return api.put(`/company/holidays/${id}`, data).then((res) => res.data);
}

function deleteHoliday(id: string): Promise<void> {
    return api.delete(`/company/holidays/${id}`).then((res) => res.data);
}

export function useHolidays(filters: HolidaysFilters = {}) {
    return useQuery({
        queryKey: ['company', 'holidays', filters],
        queryFn: () => getHolidays(filters),
        retry: false,
    });
}

export function useCreateHoliday() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: HolidayFormData) => createHoliday(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['company', 'holidays'] });
        },
    });
}

export function useUpdateHoliday() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: HolidayFormData }) => updateHoliday(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['company', 'holidays'] });
        },
    });
}

export function useDeleteHoliday() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteHoliday(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['company', 'holidays'] });
        },
    });
}
