export interface NavLink {
    label: string;
    href: string;
}

export interface PricingPlan {
    name: string;
    price: { monthly: number; yearly: number };
    description: string;
    features: string[];
    popular?: boolean;
}

export interface BusinessType {
    icon: string;
    title: string;
    description: string;
}

export interface Feature {
    icon: string;
    title: string;
    description: string;
}

export interface TimelineStep {
    step: number;
    icon: string;
    title: string;
    explanation: string;
}
