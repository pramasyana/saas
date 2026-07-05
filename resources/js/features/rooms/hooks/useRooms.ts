import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { Room, RoomFormData, PaginatedResponse } from '../types';

interface Filters {
    search?: string;
    is_active?: boolean;
    branch_id?: string;
    page?: number;
    per_page?: number;
}

function getRooms(filters: Filters): Promise<PaginatedResponse<Room>> {
    return api.get('/api/v1/booking/rooms', { params: filters }).then((r) => r.data);
}

function getRoom(id: string): Promise<{ data: Room }> {
    return api.get(`/api/v1/booking/rooms/${id}`).then((r) => r.data);
}

function getAllRooms(): Promise<{ data: Room[] }> {
    return api.get('/api/v1/booking/rooms/all').then((r) => r.data);
}

function createRoom(data: RoomFormData): Promise<{ data: Room }> {
    return api.post('/api/v1/booking/rooms', data).then((r) => r.data);
}

function updateRoom(id: string, data: RoomFormData): Promise<{ data: Room }> {
    return api.put(`/api/v1/booking/rooms/${id}`, data).then((r) => r.data);
}

function deleteRoom(id: string): Promise<void> {
    return api.delete(`/api/v1/booking/rooms/${id}`).then((r) => r.data);
}

export function useRooms(filters: Filters) {
    return useQuery({
        queryKey: ['rooms', filters],
        queryFn: () => getRooms(filters),
    });
}

export function useRoom(id: string) {
    return useQuery({
        queryKey: ['room', id],
        queryFn: () => getRoom(id),
        enabled: !!id,
    });
}

export function useAllRooms() {
    return useQuery({
        queryKey: ['rooms', 'all'],
        queryFn: getAllRooms,
    });
}

export function useCreateRoom() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: createRoom,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['rooms'] }),
    });
}

export function useUpdateRoom() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: RoomFormData }) => updateRoom(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['rooms'] }),
    });
}

export function useDeleteRoom() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: deleteRoom,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['rooms'] }),
    });
}
