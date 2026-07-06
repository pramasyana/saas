import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

interface AdminProfile {
    id: string;
    name: string;
    email: string;
    created_at: string | null;
}

interface ProfileResponse {
    status: string;
    data: AdminProfile;
}

interface UpdateProfileData {
    name: string;
    email: string;
    current_password?: string;
    new_password?: string;
    new_password_confirmation?: string;
}

function getProfile(): Promise<ProfileResponse> {
    return api.get('/api/v1/admin/profile').then((res) => res.data);
}

function updateProfile(data: UpdateProfileData): Promise<ProfileResponse> {
    return api.put('/api/v1/admin/profile', data).then((res) => res.data);
}

export function useAdminProfile() {
    return useQuery({
        queryKey: ['admin-profile'],
        queryFn: getProfile,
        retry: false,
    });
}

export function useUpdateAdminProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateProfileData) => updateProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-profile'] });
        },
    });
}
