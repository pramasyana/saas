import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { User, UserFilters, UserFormData, PaginationMeta } from '@/features/users/types';
import api from '@/lib/axios';

interface UsersResponse {
    status: string;
    data: User[];
    meta: PaginationMeta;
}

interface UserResponse {
    status: string;
    data: User;
}

function getUsers(params: UserFilters): Promise<UsersResponse> {
    return api.get('/api/v1/admin/users', { params }).then((res) => {
        return res.data;
    });
}

function getUser(id: string): Promise<UserResponse> {
    return api.get(`/api/v1/admin/users/${id}`).then((res) => res.data);
}

function createUser(data: UserFormData): Promise<UserResponse> {
    return api.post('/api/v1/admin/users', data).then((res) => res.data);
}

function updateUser(id: string, data: UserFormData): Promise<UserResponse> {
    return api.put(`/api/v1/admin/users/${id}`, data).then((res) => res.data);
}

function deleteUser(id: string): Promise<void> {
    return api.delete(`/api/v1/admin/users/${id}`).then((res) => res.data);
}

function toggleActive(id: string): Promise<UserResponse> {
    return api.put(`/api/v1/admin/users/${id}/toggle-active`).then((res) => res.data);
}

function resendVerification(id: string): Promise<{ status: string; message: string }> {
    return api.post(`/api/v1/admin/users/${id}/resend-verification`).then((res) => res.data);
}

export function useUsers(filters: UserFilters) {
    return useQuery({
        queryKey: ['users', filters],
        queryFn: () => getUsers(filters),
        retry: false,
    });
}

export function useUser(id: string | null) {
    return useQuery({
        queryKey: ['users', id],
        queryFn: () => getUser(id!),
        enabled: id !== null,
    });
}

export function useCreateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UserFormData) => createUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
}

export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UserFormData }) => updateUser(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
}

export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
}

export function useToggleActive() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => toggleActive(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
}

export function useResendVerification() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => resendVerification(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
}
