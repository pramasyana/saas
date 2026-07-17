import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { getSectionComponent } from '@/features/booking/components/landing/sections/templateRegistry';
import { DividerSection, LogoCloudSection } from '@/features/booking/components/landing/sections';
import type { LandingConfig, PackageItem } from '@/features/booking/hooks/useLandingSettings';
import PublicLayout from '@/layouts/PublicLayout';

interface ServiceItem {
    id: string; name: string; description: string | null; duration: number; price: number; color: string | null; category_id: string | null; branch_id: string | null; category_name: string | null; category_color: string | null; pricing_by_branch?: Record<string, { original_price: number; adjusted_price: number; discount: number; discount_label: string | null } | null>;
}

interface CategoryItem {
    id: string; name: string; slug: string; color: string | null; sort_order: number;
}

interface TeamMember {
    id: string; name: string; position: string | null; email: string | null;
}

interface BranchItem {
    id: string; name: string; address: string | null; phone: string | null; email: string | null; whatsapp: string | null; map_embed_url: string | null; latitude: number | null; longitude: number | null; is_default: boolean;
}

interface PageProps {
    landing: LandingConfig;
    categories: CategoryItem[];
    services: ServiceItem[];
    packages: PackageItem[];
    team: TeamMember[];
    branches: BranchItem[];
    settings: { show_prices: boolean };
    tenant: { name: string; logo: string | null };
}

export default function LandingPage({ landing, categories, services, packages, branches, team, settings, tenant: tenantInfo }: PageProps) {
    const colors = { primary: '#7C3AED', secondary: '#10B981', accent: '#F59E0B', background: '#FAFAFA', text: '#171717', text_muted: '#737373', ...landing.colors };
    const logo = landing.logo ?? tenantInfo.logo;
    const template = landing.template ?? 'lumina';
    const sectionOrder = landing.section_order ?? [
        'hero', 'features', 'about', 'stats', 'services', 'team',
        'testimonials', 'faq', 'gallery', 'cta', 'contact', 'branches', 'divider', 'logo_cloud', 'footer',
    ];

    const commonProps = { colors };

    function renderSection(key: string): ReactNode {
        const sectionData = (landing as Record<string, unknown>)[key] as Record<string, unknown> ?? {};
        const enabled = (sectionData as { enabled?: boolean })?.enabled;

        if (enabled === false) {
            return null;
        }

        // Shared sections (divider, logo_cloud) are not template-specific
        if (key === 'divider') {
            return <DividerSection data={sectionData as any} {...commonProps} />;
        }

        if (key === 'logo_cloud') {
            return <LogoCloudSection data={sectionData as any} {...commonProps} />;
        }

        if (key === 'footer') {
            return null; // Footer handled by PublicLayout
        }

        // Get template-specific section component from registry
        const SectionComponent = getSectionComponent(template, key);

        if (!SectionComponent) {
            return null;
        }

        // Build props based on section key
        const extraProps: Record<string, any> = {};

        if (key === 'hero') {
            extraProps.tenantName = tenantInfo.name;
        }

        if (key === 'services') {
            extraProps.services = services;
            extraProps.packages = packages;
            extraProps.categories = categories;
            extraProps.branches = branches;
            extraProps.settings = settings;
        }

        if (key === 'pricing') {
            extraProps.services = services;
            extraProps.categories = categories;
        }

        if (key === 'team') {
            extraProps.team = team;
        }

        if (key === 'contact' || key === 'branches') {
            extraProps.branches = branches;
        }

        return <SectionComponent data={sectionData as any} {...commonProps} {...extraProps} />;
    }

    const orderedSections = sectionOrder.filter((key) => key !== 'footer');

    return (
        <PublicLayout tenantName={tenantInfo.name} logo={logo} colors={colors}>
            <Head title={tenantInfo.name} />
            {orderedSections.map((key) => {
                const rendered = renderSection(key);

                return rendered ? <div key={key}>{rendered}</div> : null;
            })}
        </PublicLayout>
    );
}
