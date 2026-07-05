import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { Booking, BookingFormData, PaginatedResponse } from '../types';

interface Filters {
    branch_id?: string;
    search?: string;
    status?: string;
    date?: string;
    staff_id?: string;
    source?: string;
    customer_id?: string;
    page?: number;
    per_page?: number;
}

function getBookings(filters: Filters): Promise<PaginatedResponse<Booking>> {
    return api.get('/api/v1/booking/bookings', { params: filters }).then((r) => r.data);
}

function getBooking(id: string): Promise<{ data: Booking }> {
    return api.get(`/api/v1/booking/bookings/${id}`).then((r) => r.data);
}

function createBooking(data: BookingFormData): Promise<{ data: Booking }> {
    return api.post('/api/v1/booking/bookings', data).then((r) => r.data);
}

function updateBooking(id: string, data: Partial<BookingFormData>): Promise<{ data: Booking }> {
    return api.put(`/api/v1/booking/bookings/${id}`, data).then((r) => r.data);
}

function deleteBooking(id: string): Promise<void> {
    return api.delete(`/api/v1/booking/bookings/${id}`).then((r) => r.data);
}

function rescheduleBooking(id: string, data: { start_time: string; end_time: string; staff_id?: string }): Promise<{ data: Booking }> {
    return api.post(`/api/v1/booking/bookings/${id}/reschedule`, data).then((r) => r.data);
}

function markNoShow(id: string): Promise<{ data: Booking }> {
    return api.post(`/api/v1/booking/bookings/${id}/no-show`).then((r) => r.data);
}

function checkIn(id: string): Promise<{ data: Booking }> {
    return api.post(`/api/v1/booking/bookings/${id}/check-in`).then((r) => r.data);
}

function completeBooking(id: string): Promise<{ data: Booking }> {
    return api.post(`/api/v1/booking/bookings/${id}/complete`).then((r) => r.data);
}

function cancelBooking(id: string): Promise<{ data: Booking }> {
    return api.post(`/api/v1/booking/bookings/${id}/cancel`).then((r) => r.data);
}

function walkIn(data: BookingFormData): Promise<{ data: Booking }> {
    return api.post('/api/v1/booking/walk-in', data).then((r) => r.data);
}

export function useBookings(filters: Filters) {
    return useQuery({
        queryKey: ['bookings', filters],
        queryFn: () => getBookings(filters),
    });
}

export function useBooking(id: string) {
    return useQuery({
        queryKey: ['booking', id],
        queryFn: () => getBooking(id),
        enabled: !!id,
    });
}

export function useCreateBooking() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: createBooking,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
    });
}

export function useUpdateBooking() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<BookingFormData> }) => updateBooking(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
    });
}

export function useDeleteBooking() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: deleteBooking,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
    });
}

export function useRescheduleBooking() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: { start_time: string; end_time: string; staff_id?: string } }) => rescheduleBooking(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
    });
}

export function useMarkNoShow() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: markNoShow,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
    });
}

export function useCheckIn() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: checkIn,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
    });
}

export function useCompleteBooking() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: completeBooking,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
    });
}

export function useConfirmBooking() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => api.post(`/api/v1/booking/bookings/${id}/confirm`).then((r) => r.data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
    });
}

export function useCancelBooking() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: cancelBooking,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
    });
}

export function useWalkIn() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: walkIn,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
    });
}

type BookingSettings = {
    enabled: boolean;
    show_prices: boolean;
    auto_confirm: boolean;
    enable_addons: boolean;
    enable_multi_service: boolean;
    enable_guests: boolean;
};

function getBookingSettings(): Promise<{ data: BookingSettings }> {
    return api.get('/api/v1/booking/settings').then((r) => r.data);
}

function updateBookingSettings(data: Partial<BookingSettings>): Promise<{ data: Record<string, unknown> }> {
    return api.put('/api/v1/booking/settings', data).then((r) => r.data);
}

export function useBookingSettings() {
    return useQuery({
        queryKey: ['booking-settings'],
        queryFn: getBookingSettings,
    });
}

export function useUpdateBookingSettings() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: updateBookingSettings,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['booking-settings'] }),
    });
}
