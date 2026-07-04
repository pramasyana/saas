export interface Customer {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    company: string | null;
    address: string | null;
    birthday: string | null;
    avatar: string | null;
    is_active: boolean;
    tags: Tag[] | null;
    tags_count: number | null;
    notes_count: number | null;
    membership: Membership | null;
    created_at: string;
}

export interface CustomerFormData {
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    address?: string;
    birthday?: string;
    avatar?: string;
    is_active?: boolean;
    tag_ids?: string[];
}

export interface Tag {
    id: string;
    name: string;
    color: string;
    is_active: boolean;
    customers_count: number | null;
    created_at: string;
}

export interface TagFormData {
    name: string;
    color?: string;
    is_active?: boolean;
}

export interface CustomerNote {
    id: string;
    customer_id: string;
    content: string;
    user: { id: string; name: string } | null;
    created_at: string;
}

export interface CustomerNoteFormData {
    customer_id: string;
    content: string;
}

export interface TimelineEvent {
    id: string;
    type: string;
    description: string;
    metadata: Record<string, unknown> | null;
    user: { id: string; name: string } | null;
    created_at: string;
}

export interface Membership {
    id: string;
    points: number;
    total_spent: number;
    joined_at: string | null;
    expired_at: string | null;
    tier: MembershipTier | null;
}

export interface MembershipFormData {
    membership_tier_id?: string;
    points?: number;
    total_spent?: number;
    joined_at?: string;
    expired_at?: string;
}

export interface MembershipTier {
    id: string;
    name: string;
    min_points: number;
    min_total_spent: number;
    benefits: string[] | null;
    sort_order: number;
    is_active: boolean;
}

export interface MembershipTierFormData {
    name: string;
    min_points?: number;
    min_total_spent?: number;
    benefits?: string[];
    sort_order?: number;
    is_active?: boolean;
}

export interface LoyaltyTransaction {
    id: string;
    type: 'earn' | 'spend';
    points: number;
    description: string | null;
    created_at: string;
}

export interface LoyaltyConfig {
    enabled: boolean;
    mode: 'percentage' | 'fixed';
    points_per_amount: number;
    points_fixed: number;
}

export interface LoyaltyBalance {
    points: number;
    total_spent: number;
}

export interface Reward {
    id: string;
    name: string;
    description: string | null;
    points_required: number;
    stock: number | null;
    image: string | null;
    is_active: boolean;
    created_at: string;
}

export interface RewardFormData {
    name: string;
    description?: string;
    points_required: number;
    stock?: number;
    image?: string;
    is_active?: boolean;
}

export interface RewardRedemption {
    id: string;
    points_spent: number;
    status: string;
    notes: string | null;
    reward: Reward | null;
    created_at: string;
}

export interface RewardRedemptionRequest {
    customer_id: string;
    reward_id: string;
}

export interface Review {
    id: string;
    rating: number;
    title: string | null;
    content: string | null;
    is_approved: boolean;
    customer: { id: string; name: string } | null;
    staff: { id: string; name: string } | null;
    created_at: string;
}

export interface ReviewFormData {
    customer_id: string;
    reviewable_type: string;
    reviewable_id: string;
    staff_id?: string;
    rating: number;
    title?: string;
    content?: string;
}

export interface Referral {
    id: string;
    code: string;
    referred_name: string | null;
    referred_email: string | null;
    status: string;
    reward_given: boolean;
    created_at: string;
}

export interface ReferralFormData {
    referrer_customer_id: string;
    referred_name?: string;
    referred_email?: string;
}

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}
