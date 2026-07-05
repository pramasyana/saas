import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export interface Branch {
    id: string;
    name: string;
    slug: string;
    address: string | null;
    phone: string | null;
}

export interface ServiceItem {
    id: string;
    name: string;
    description: string | null;
    duration: number;
    price: number;
    color: string | null;
    category_id: string | null;
}

export interface PackageItem {
    id: string;
    name: string;
    description: string | null;
    price: number;
    duration: number;
    branch_id: string;
    services: { id: string; name: string; quantity: number }[];
}

export interface StaffMember {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    position: string | null;
    branch_id: string | null;
}

export interface AddonItem {
    id: string;
    name: string;
    description: string | null;
    price: number;
    duration: number | null;
}

export interface RoomItem {
    id: string;
    name: string;
    capacity: number;
    color: string | null;
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

interface ServiceAddon {
    name: string;
    price: number;
    quantity: number;
}

interface BookingServiceItem {
    name: string;
    price: number;
    duration: number;
    quantity: number;
    addons?: ServiceAddon[];
}

export interface BookingDetail {
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
    total_guests: number;
    guest_details: string[] | null;
    is_group?: boolean;
    max_participants?: number;
    services: BookingServiceItem[];
    rooms?: { id: string; name: string; color: string | null }[];
    participants?: { name: string; phone?: string; email?: string; status?: string }[];
}

export interface CreateBookingServiceItem {
    service_id?: string;
    name: string;
    price: number;
    duration: number;
    quantity: number;
    addons?: {
        addon_id?: string;
        name: string;
        price: number;
        quantity: number;
    }[];
}

export interface CreateBookingPayload {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    service_id?: string;
    package_id?: string;
    services?: CreateBookingServiceItem[];
    staff_id?: string;
    branch_id: string;
    start_time: string;
    duration_minutes: number;
    notes?: string;
    total_guests?: number;
    guest_details?: string[];
    rooms?: { room_id: string; start_time: string; end_time: string }[];
    is_group?: boolean;
    max_participants?: number;
    participants?: { name: string; phone?: string; email?: string; notes?: string }[];
    recurring?: {
        frequency: 'daily' | 'weekly' | 'monthly';
        interval?: number;
        end_type: 'after_count' | 'until_date' | 'never';
        count?: number;
        until_date?: string;
    };
}

function getBranches(): Promise<{ data: Branch[] }> {
    return api.get('/api/v1/booking/branches').then((r) => r.data);
}

function getAddons(params: { branch_id?: string }): Promise<{ data: AddonItem[] }> {
    return api.get('/api/v1/booking/addons', { params }).then((r) => r.data);
}

function getPackages(params: { branch_id?: string }): Promise<{ data: PackageItem[] }> {
    return api.get('/api/v1/booking/packages', { params }).then((r) => r.data);
}

function getServices(params: { branch_id?: string }): Promise<{ data: ServiceItem[] }> {
    return api.get('/api/v1/booking/services', { params }).then((r) => r.data);
}

function getStaff(params: { branch_id?: string; date?: string; service_id?: string }): Promise<{ data: StaffMember[] }> {
    return api.get('/api/v1/booking/staff', { params }).then((r) => r.data);
}

function getRooms(params: { branch_id?: string }): Promise<{ data: RoomItem[] }> {
    return api.get('/api/v1/booking/rooms', { params }).then((r) => r.data);
}

function getAvailableRooms(params: { date: string; start_time: string; end_time: string; branch_id?: string }): Promise<{ data: RoomItem[] }> {
    return api.get('/api/v1/booking/rooms/available', { params }).then((r) => r.data);
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

export function usePublicAddons(params: { branch_id?: string }) {
    return useQuery({
        queryKey: ['public-booking', 'addons', params],
        queryFn: () => getAddons(params),
        staleTime: 1000 * 60 * 10,
        enabled: !!params.branch_id,
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

export function usePublicStaff(params: { branch_id?: string; date?: string; service_id?: string }) {
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

export function usePublicRooms(params: { branch_id?: string }) {
    return useQuery({
        queryKey: ['public-booking', 'rooms', params],
        queryFn: () => getRooms(params),
        staleTime: 1000 * 60 * 10,
        enabled: !!params.branch_id,
    });
}

export function usePublicAvailableRooms(params: { date: string; start_time: string; end_time: string; branch_id?: string }) {
    return useQuery({
        queryKey: ['public-booking', 'rooms-available', params],
        queryFn: () => getAvailableRooms(params),
        staleTime: 1000 * 60,
        enabled: !!params.date && !!params.start_time && !!params.end_time,
        retry: false,
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
