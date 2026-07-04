import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

interface Branch {
    id: string;
    name: string;
    slug: string;
    address: string | null;
    phone: string | null;
}

interface ServiceItem {
    id: string;
    name: string;
    description: string | null;
    duration: number;
    price: number;
    color: string | null;
    category_id: string | null;
}

interface PackageItem {
    id: string;
    name: string;
    description: string | null;
    price: number;
    duration: number;
    branch_id: string;
    services: { id: string; name: string; pivot: { quantity: number } }[];
}

interface StaffMember {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    position: string | null;
    branch_id: string | null;
}

interface AvailabilitySlot {
    time: string;
    start_time: string;
    end_time: string;
    staff: { id: string; name: string }[];
}

interface AvailabilityResult {
    date: string;
    available: boolean;
    reason?: string;
    slots: AvailabilitySlot[];
}

interface BookingResult {
    id: string;
    booking_code: string;
    status: string;
}

interface BookingDetail {
    id: string;
    booking_code: string;
    status: string;
    customer_name: string;
    customer_email: string;
    staff_name: string | null;
    branch_name: string | null;
    start_time: string;
    end_time: string;
    duration_minutes: number;
    source: string;
    notes: string | null;
    services: { name: string; price: number; duration: number; quantity: number }[];
}

interface CreateBookingPayload {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    service_id?: string;
    package_id?: string;
    staff_id?: string;
    branch_id: string;
    start_time: string;
    duration_minutes: number;
    notes?: string;
}

function getBranches(): Promise<{ data: Branch[] }> {
    return api.get('/api/v1/booking/branches').then((r) => r.data);
}

function getPackages(params: { branch_id?: string }): Promise<{ data: PackageItem[] }> {
    return api.get('/api/v1/booking/packages', { params }).then((r) => r.data);
}

function getServices(params: { branch_id?: string }): Promise<{ data: ServiceItem[] }> {
    return api.get('/api/v1/booking/services', { params }).then((r) => r.data);
}

function getStaff(params: { branch_id?: string }): Promise<{ data: StaffMember[] }> {
    return api.get('/api/v1/booking/staff', { params }).then((r) => r.data);
}

function getAvailability(params: {
    date: string;
    service_id: string;
    duration: number;
    branch_id?: string;
    staff_id?: string;
}): Promise<{ data: AvailabilityResult }> {
    return api.get('/api/v1/booking/availability', { params }).then((r) => r.data);
}

function createBooking(data: CreateBookingPayload): Promise<{ data: BookingResult }> {
    return api.post('/api/v1/booking/bookings', data).then((r) => r.data);
}

function getBookingByCode(code: string): Promise<{ data: BookingDetail }> {
    return api.get(`/api/v1/booking/bookings/${code}`).then((r) => r.data);
}

export function usePublicBranches() {
    return useQuery({
        queryKey: ['public-booking', 'branches'],
        queryFn: getBranches,
        staleTime: 1000 * 60 * 10,
    });
}

export function usePublicPackages(params: { branch_id?: string }) {
    return useQuery({
        queryKey: ['public-booking', 'packages', params],
        queryFn: () => getPackages(params),
        staleTime: 1000 * 60 * 10,
        enabled: !!params.branch_id,
    });
}

export function usePublicServices(params: { branch_id?: string }) {
    return useQuery({
        queryKey: ['public-booking', 'services', params],
        queryFn: () => getServices(params),
        staleTime: 1000 * 60 * 10,
        enabled: !!params.branch_id,
    });
}

export function usePublicStaff(params: { branch_id?: string; date?: string }) {
    return useQuery({
        queryKey: ['public-booking', 'staff', params],
        queryFn: () => getStaff(params),
        staleTime: 1000 * 60 * 5,
        enabled: !!params.branch_id,
    });
}

export function usePublicAvailability(params: {
    date: string;
    service_id: string;
    duration: number;
    branch_id?: string;
    staff_id?: string;
}) {
    return useQuery({
        queryKey: ['public-booking', 'availability', params],
        queryFn: () => getAvailability(params),
        staleTime: 1000 * 60,
        enabled: !!params.date && !!params.service_id && !!params.branch_id,
        retry: false,
    });
}

export function usePublicCreateBooking() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createBooking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['public-booking'] });
        },
    });
}

export function usePublicBooking(code: string | undefined) {
    return useQuery({
        queryKey: ['public-booking', 'booking', code],
        queryFn: () => getBookingByCode(code!),
        enabled: !!code,
        refetchInterval: (query) => {
            const data = query.state.data?.data;

            if (data && data.status !== 'pending') {
return false;
}

            return 30_000;
        },
        staleTime: 10_000,
    });
}
