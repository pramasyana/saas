import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export interface FeatureItem {
    icon?: string;
    title: string;
    description: string;
}

export interface StatItem {
    number: string;
    label: string;
    prefix?: string;
    suffix?: string;
}

export interface FAQItem {
    question: string;
    answer: string;
}

export interface PricingInfo {
    original_price: number;
    adjusted_price: number;
    discount: number;
    discount_label: string | null;
}

export interface ServiceItem {
    id: string;
    name: string;
    description: string | null;
    duration: number;
    price: number;
    color: string | null;
    category_id: string | null;
    branch_id: string | null;
    category_name: string | null;
    category_color: string | null;
    pricing_by_branch?: Record<string, PricingInfo | null>;
}

export interface PackageServiceItem {
    id: string;
    name: string;
    quantity: number;
}

export interface PackageItem {
    id: string;
    name: string;
    description: string | null;
    price: number;
    duration: number;
    branch_id: string | null;
    services: PackageServiceItem[];
    pricing_by_branch?: Record<string, PricingInfo | null>;
}

export interface CategoryItem {
    id: string;
    name: string;
    slug: string;
    color: string | null;
    sort_order: number;
}

export interface PricingItem {
    name: string;
    price: string;
    period?: string;
    description?: string;
    features: string[];
    cta_text?: string;
    cta_link?: string;
    highlighted?: boolean;
    highlight_label?: string;
}

export interface GalleryItem {
    image: string;
    title?: string;
    description?: string;
}

export interface CTASettings {
    enabled?: boolean;
    title?: string;
    subtitle?: string;
    button_text?: string;
    button_link?: string;
    background_color?: string;
    text_color?: string;
}

export interface DividerSettings {
    enabled?: boolean;
    style?: 'line' | 'dots' | 'wave' | 'space';
    height?: number;
}

export interface LogoCloudItem {
    image: string;
    name?: string;
    url?: string;
}

export interface BranchesSettings {
    enabled?: boolean;
    title?: string;
    subtitle?: string;
}

export interface LandingConfig {
    enabled?: boolean;
    template?: string;
    section_order?: string[];
    logo?: string | null;
    colors?: {
        primary?: string;
        secondary?: string;
        accent?: string;
        background?: string;
        text?: string;
        text_muted?: string;
    };
    hero?: {
        enabled?: boolean;
        title?: string;
        subtitle?: string;
        badge?: string;
        image?: string | null;
        cta_text?: string;
        cta_link?: string;
        background_type?: 'color' | 'image' | 'carousel';
        background_image?: string | null;
        overlay_opacity?: number;
        carousel_items?: {
            title: string;
            subtitle: string;
            cta_text: string;
            cta_link: string;
            background_image: string | null;
        }[];
        carousel_interval?: number;
        stats?: StatItem[];
    };
    about?: {
        enabled?: boolean;
        title?: string;
        content?: string;
        image?: string | null;
    };
    services?: {
        enabled?: boolean;
        title?: string;
        subtitle?: string;
    };
    team?: {
        enabled?: boolean;
        title?: string;
        subtitle?: string;
    };
    testimonials?: {
        enabled?: boolean;
        title?: string;
        subtitle?: string;
        items?: {
            name: string;
            role?: string;
            content: string;
            rating: number;
        }[];
    };
    branches?: BranchesSettings;
    contact?: {
        enabled?: boolean;
        title?: string;
        subtitle?: string;
        address?: string;
        phone?: string;
        email?: string;
        whatsapp_number?: string;
        map_embed_url?: string;
    };
    features?: {
        enabled?: boolean;
        title?: string;
        subtitle?: string;
        items?: FeatureItem[];
    };
    stats?: {
        enabled?: boolean;
        items?: StatItem[];
    };
    faq?: {
        enabled?: boolean;
        title?: string;
        subtitle?: string;
        items?: FAQItem[];
    };
    pricing?: {
        enabled?: boolean;
        title?: string;
        subtitle?: string;
        source?: 'services' | 'custom';
        items?: PricingItem[];
    };
    gallery?: {
        enabled?: boolean;
        title?: string;
        subtitle?: string;
        items?: GalleryItem[];
    };
    cta?: CTASettings;
    divider?: DividerSettings;
    logo_cloud?: {
        enabled?: boolean;
        title?: string;
        items?: LogoCloudItem[];
    };
    footer?: {
        copyright_text?: string;
    };
}

export function useLandingSettings() {
    return useQuery<LandingConfig>({
        queryKey: ['booking', 'landing'],
        queryFn: async () => {
            const { data } = await api.get('/api/v1/booking/landing');

            return data.data ?? {};
        },
    });
}

export function useUpdateLandingSettings() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (settings: Partial<LandingConfig>) => {
            const { data } = await api.put('/api/v1/booking/landing', settings);

            return data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['booking', 'landing'] });
        },
    });
}

export function useUploadLandingLogo() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append('logo', file);
            const { data } = await api.post('/api/v1/booking/landing/logo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            return data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['booking', 'landing'] });
        },
    });
}

export function useDeleteLandingLogo() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const { data } = await api.delete('/api/v1/booking/landing/logo');

            return data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['booking', 'landing'] });
        },
    });
}

export function useUploadLandingImage() {
    return useMutation({
        mutationFn: async ({ file, section }: { file: File; section: string }) => {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('section', section);
            const { data } = await api.post('/api/v1/booking/landing/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            return data.data as { url: string };
        },
    });
}
