import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';
import {
    HeroSection,
    FeaturesSection,
    AboutSection,
    StatsSection,
    ServicesSection,
    TeamSection,
    TestimonialsSection,
    FAQSection,
    GallerySection,
    CTASection,
    ContactSection,
    DividerSection,
    LogoCloudSection,
    BranchesSection,
} from '@/features/booking/components/landing/sections';
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
    id: string; name: string; address: string | null; phone: string | null; email: string | null; whatsapp: string | null; is_default: boolean;
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
    const sectionOrder = landing.section_order ?? [
        'hero', 'features', 'about', 'stats', 'services', 'team',
        'testimonials', 'faq', 'gallery', 'cta', 'contact', 'branches', 'divider', 'logo_cloud', 'footer',
    ];

    const commonProps = { colors };
    const sectionMap: Record<string, () => ReactNode> = {
        hero: () => {
            if (landing.hero?.enabled === false) {
return null;
}

            return <HeroSection data={landing.hero ?? {}} colors={colors} tenantName={tenantInfo.name} />;
        },
        features: () => {
            if (landing.features?.enabled === false) {
return null;
}

            return <FeaturesSection data={landing.features ?? {}} {...commonProps} />;
        },
        about: () => {
            if (landing.about?.enabled === false) {
return null;
}

            return <AboutSection data={landing.about ?? {}} {...commonProps} />;
        },
        stats: () => {
            if (landing.stats?.enabled === false) {
return null;
}

            return <StatsSection data={landing.stats ?? {}} {...commonProps} />;
        },
        services: () => {
            if (landing.services?.enabled === false) {
return null;
}

            return <ServicesSection data={landing.services ?? {}} {...commonProps} services={services} packages={packages} categories={categories} branches={branches} settings={settings} />;
        },
        team: () => {
            if (landing.team?.enabled === false) {
return null;
}

            return <TeamSection data={landing.team ?? {}} {...commonProps} team={team} />;
        },
        testimonials: () => {
            if (landing.testimonials?.enabled === false) {
return null;
}

            return <TestimonialsSection data={landing.testimonials ?? {}} {...commonProps} />;
        },
        faq: () => {
            if (landing.faq?.enabled === false) {
return null;
}

            return <FAQSection data={landing.faq ?? {}} {...commonProps} />;
        },
        gallery: () => {
            if (landing.gallery?.enabled === false) {
return null;
}

            return <GallerySection data={landing.gallery ?? {}} {...commonProps} />;
        },
        cta: () => {
            if (landing.cta?.enabled === false) {
return null;
}

            return <CTASection data={landing.cta ?? {}} {...commonProps} />;
        },
        contact: () => {
            if (landing.contact?.enabled === false) {
return null;
}

            return <ContactSection data={landing.contact ?? {}} {...commonProps} branches={branches} />;
        },
        branches: () => {
            if (landing.branches?.enabled === false) {
return null;
}

            return <BranchesSection data={landing.branches ?? {}} {...commonProps} branches={branches} />;
        },
        divider: () => {
            if (landing.divider?.enabled === false) {
return null;
}

            return <DividerSection data={landing.divider ?? {}} {...commonProps} />;
        },
        logo_cloud: () => {
            if (landing.logo_cloud?.enabled === false) {
return null;
}

            return <LogoCloudSection data={landing.logo_cloud ?? {}} {...commonProps} />;
        },
        footer: () => null,
    };

    const orderedSections = sectionOrder.filter((key) => key !== 'footer');

    return (
        <PublicLayout tenantName={tenantInfo.name} logo={logo} colors={colors}>
            <Head title={tenantInfo.name} />
            {orderedSections.map((key) => {
                const render = sectionMap[key];

                return render ? <div key={key}>{render()}</div> : null;
            })}
        </PublicLayout>
    );
}
