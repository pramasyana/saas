import { useMemo } from 'react';
import type { ReactNode } from 'react';
import type { LandingConfig, PackageItem } from '@/features/booking/hooks/useLandingSettings';
import { cn } from '@/lib/utils';
import {
    HeroSection,
    FeaturesSection,
    AboutSection,
    StatsSection,
    ServicesSection,
    PricingSection,
    TeamSection,
    TestimonialsSection,
    FAQSection,
    GallerySection,
    CTASection,
    ContactSection,
    DividerSection,
    LogoCloudSection,
    BranchesSection,
    FooterSection,
} from './sections';

interface BranchItem {
    id: string; name: string; address: string | null; phone: string | null; email: string | null; whatsapp: string | null; map_embed_url: string | null; latitude: number | null; longitude: number | null; is_default: boolean;
}

interface ServiceItem {
    id: string; name: string; description: string | null; duration: number; price: number; color: string | null; category_id: string | null; branch_id: string | null; category_name: string | null; category_color: string | null; pricing_by_branch?: Record<string, { original_price: number; adjusted_price: number; discount: number; discount_label: string | null } | null>;
}

interface CategoryItem {
    id: string; name: string; slug: string; color: string | null; sort_order: number;
}

interface TeamMember {
    id: string; name: string; position: string | null; email: string | null;
}

interface Props {
    config: LandingConfig;
    services?: ServiceItem[];
    packages?: PackageItem[];
    categories?: CategoryItem[];
    team?: TeamMember[];
    branches?: BranchItem[];
    settings?: { show_prices: boolean };
    tenantName?: string;
    selectedSection: string | null;
    onSectionClick: (key: string) => void;
    onRemoveSection: (key: string) => void;
}

const allSectionKeys = [
    'hero', 'features', 'about', 'stats', 'services', 'team',
    'testimonials', 'faq', 'gallery', 'cta', 'contact', 'branches', 'divider', 'logo_cloud', 'footer',
];

function SectionWrapper({
    id,
    children,
    isSelected,
    onClick,
    onRemove,
}: {
    id: string;
    children: ReactNode;
    isSelected: boolean;
    onClick: () => void;
    onRemove?: () => void;
}) {
    return (
        <div className={cn('group/section relative')}>
            {/* Remove button */}
            {id !== 'hero' && id !== 'footer' && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove?.();
                    }}
                    className="absolute right-2 top-2 z-20 flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-neutral-400 opacity-0 shadow-sm ring-1 ring-black/5 backdrop-blur transition-all hover:bg-danger hover:text-white group-hover/section:opacity-100"
                >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}

            {/* Click overlay for editing */}
            <div
                onClick={onClick}
                className={cn(
                    'absolute inset-0 z-10 cursor-pointer rounded-2xl transition-all',
                    isSelected ? 'ring-2 ring-primary ring-offset-2' : 'ring-1 ring-transparent group-hover/section:ring-primary/30 group-hover/section:ring-offset-1',
                )}
            />

            {/* Content */}
            <div className="pointer-events-none [&_a]:pointer-events-none [&_button]:pointer-events-none">
                {children}
            </div>
        </div>
    );
}

export default function LandingPreview({
    config,
    services,
    packages,
    categories,
    team,
    branches,
    settings,
    tenantName,
    selectedSection,
    onSectionClick,
    onRemoveSection,
}: Props) {
    const colors = { primary: '#7C3AED', secondary: '#10B981', accent: '#F59E0B', background: '#FAFAFA', text: '#171717', text_muted: '#737373', ...config.colors };

    const visibleSections = useMemo(() => {
        const order = config.section_order ?? [
            'hero', 'features', 'about', 'stats', 'services', 'team',
            'testimonials', 'faq', 'gallery', 'cta', 'contact', 'divider', 'logo_cloud', 'footer',
        ];
        const filtered = [...new Set(order.filter((k) => allSectionKeys.includes(k)))];
        const hasHero = filtered.includes('hero');
        const hasFooter = filtered.includes('footer');
        const middle = filtered.filter((k) => k !== 'hero' && k !== 'footer');
        const result: string[] = [];

        if (hasHero) {
result.push('hero');
}

        result.push(...middle);

        if (hasFooter) {
result.push('footer');
}

        return result;
    }, [config.section_order]);

    function renderSection(key: string): ReactNode {
        const sectionData = (config as Record<string, unknown>)[key] as Record<string, unknown> ?? {};
        const enabled = (sectionData as { enabled?: boolean })?.enabled;

        if (enabled === false && key !== selectedSection) {
            return null;
        }

        const commonProps = { colors };

        switch (key) {
            case 'hero':
                return <HeroSection data={sectionData as any} colors={colors} tenantName={tenantName} />;
            case 'features':
                return <FeaturesSection data={sectionData as any} {...commonProps} />;
            case 'about':
                return <AboutSection data={sectionData as any} {...commonProps} />;
            case 'stats':
                return <StatsSection data={sectionData as any} {...commonProps} />;
            case 'services':
                return <ServicesSection data={sectionData as any} {...commonProps} services={services} packages={packages} categories={categories} branches={branches} settings={settings} />;
            case 'pricing':
                return <PricingSection data={sectionData as any} {...commonProps} services={services} categories={categories} />;
            case 'team':
                return <TeamSection data={sectionData as any} {...commonProps} team={team} />;
            case 'testimonials':
                return <TestimonialsSection data={sectionData as any} {...commonProps} />;
            case 'faq':
                return <FAQSection data={sectionData as any} {...commonProps} />;
            case 'gallery':
                return <GallerySection data={sectionData as any} {...commonProps} />;
            case 'cta':
                return <CTASection data={sectionData as any} {...commonProps} />;
            case 'contact':
                return <ContactSection data={sectionData as any} {...commonProps} branches={branches} />;
            case 'branches':
                return <BranchesSection data={sectionData as any} {...commonProps} branches={branches} />;
            case 'divider':
                return <DividerSection data={sectionData as any} {...commonProps} />;
            case 'logo_cloud':
                return <LogoCloudSection data={sectionData as any} {...commonProps} />;
            case 'footer':
                return <FooterSection data={sectionData as any} {...commonProps} tenantName={tenantName} />;
            default:
                return null;
        }
    }

    return (
        <div className="min-h-0 flex-1">
            <div className="mx-auto max-w-5xl rounded-2xl border border-neutral-200 bg-white shadow-sm" style={{ overflow: 'hidden' }}>
                {visibleSections.map((key) => {
                    const sectionData = (config as Record<string, unknown>)[key] as Record<string, unknown> ?? {};
                    const enabled = (sectionData as { enabled?: boolean })?.enabled;

                    if (enabled === false && key !== selectedSection) {
                        return null;
                    }

                    return (
                        <SectionWrapper
                            key={key}
                            id={key}
                            isSelected={selectedSection === key}
                            onClick={() => onSectionClick(selectedSection === key ? '' : key)}
                            onRemove={() => onRemoveSection(key)}
                        >
                            {renderSection(key)}
                        </SectionWrapper>
                    );
                })}
            </div>
        </div>
    );
}
