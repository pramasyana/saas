import type { ComponentType } from 'react';

interface SectionProps {
    data: any;
    colors: any;
    [key: string]: any;
}

export type SectionKey = 'hero' | 'features' | 'about' | 'stats' | 'services' | 'team' | 'testimonials' | 'faq' | 'gallery' | 'cta' | 'contact' | 'pricing' | 'branches';

export type TemplateSections = Record<SectionKey, ComponentType<SectionProps>>;

// Lumina (default)
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import AboutSection from './AboutSection';
import StatsSection from './StatsSection';
import ServicesSection from './ServicesSection';
import TeamSection from './TeamSection';
import TestimonialsSection from './TestimonialsSection';
import FAQSection from './FAQSection';
import GallerySection from './GallerySection';
import CTASection from './CTASection';
import ContactSection from './ContactSection';
import PricingSection from './PricingSection';
import BranchesSection from './BranchesSection';

// Clean Business
import HeroSectionCB from './clean-business/HeroSection';
import FeaturesSectionCB from './clean-business/FeaturesSection';
import AboutSectionCB from './clean-business/AboutSection';
import StatsSectionCB from './clean-business/StatsSection';
import ServicesSectionCB from './clean-business/ServicesSection';
import TeamSectionCB from './clean-business/TeamSection';
import TestimonialsSectionCB from './clean-business/TestimonialsSection';
import FAQSectionCB from './clean-business/FAQSection';
import GallerySectionCB from './clean-business/GallerySection';
import CTASectionCB from './clean-business/CTASection';
import ContactSectionCB from './clean-business/ContactSection';
import PricingSectionCB from './clean-business/PricingSection';
import BranchesSectionCB from './clean-business/BranchesSection';

// Modern Minimalis
import HeroSectionMM from './modern-minimalis/HeroSection';
import FeaturesSectionMM from './modern-minimalis/FeaturesSection';
import AboutSectionMM from './modern-minimalis/AboutSection';
import StatsSectionMM from './modern-minimalis/StatsSection';
import ServicesSectionMM from './modern-minimalis/ServicesSection';
import TeamSectionMM from './modern-minimalis/TeamSection';
import TestimonialsSectionMM from './modern-minimalis/TestimonialsSection';
import FAQSectionMM from './modern-minimalis/FAQSection';
import GallerySectionMM from './modern-minimalis/GallerySection';
import CTASectionMM from './modern-minimalis/CTASection';
import ContactSectionMM from './modern-minimalis/ContactSection';
import PricingSectionMM from './modern-minimalis/PricingSection';
import BranchesSectionMM from './modern-minimalis/BranchesSection';

// Portfolio
import HeroSectionP from './portfolio/HeroSection';
import FeaturesSectionP from './portfolio/FeaturesSection';
import AboutSectionP from './portfolio/AboutSection';
import StatsSectionP from './portfolio/StatsSection';
import ServicesSectionP from './portfolio/ServicesSection';
import TeamSectionP from './portfolio/TeamSection';
import TestimonialsSectionP from './portfolio/TestimonialsSection';
import FAQSectionP from './portfolio/FAQSection';
import GallerySectionP from './portfolio/GallerySection';
import CTASectionP from './portfolio/CTASection';
import ContactSectionP from './portfolio/ContactSection';
import PricingSectionP from './portfolio/PricingSection';
import BranchesSectionP from './portfolio/BranchesSection';

export const templateRegistry: Record<string, TemplateSections> = {
    lumina: {
        hero: HeroSection,
        features: FeaturesSection,
        about: AboutSection,
        stats: StatsSection,
        services: ServicesSection,
        team: TeamSection,
        testimonials: TestimonialsSection,
        faq: FAQSection,
        gallery: GallerySection,
        cta: CTASection,
        contact: ContactSection,
        pricing: PricingSection,
        branches: BranchesSection,
    },
    'clean-business': {
        hero: HeroSectionCB,
        features: FeaturesSectionCB,
        about: AboutSectionCB,
        stats: StatsSectionCB,
        services: ServicesSectionCB,
        team: TeamSectionCB,
        testimonials: TestimonialsSectionCB,
        faq: FAQSectionCB,
        gallery: GallerySectionCB,
        cta: CTASectionCB,
        contact: ContactSectionCB,
        pricing: PricingSectionCB,
        branches: BranchesSectionCB,
    },
    'modern-minimalis': {
        hero: HeroSectionMM,
        features: FeaturesSectionMM,
        about: AboutSectionMM,
        stats: StatsSectionMM,
        services: ServicesSectionMM,
        team: TeamSectionMM,
        testimonials: TestimonialsSectionMM,
        faq: FAQSectionMM,
        gallery: GallerySectionMM,
        cta: CTASectionMM,
        contact: ContactSectionMM,
        pricing: PricingSectionMM,
        branches: BranchesSectionMM,
    },
    portfolio: {
        hero: HeroSectionP,
        features: FeaturesSectionP,
        about: AboutSectionP,
        stats: StatsSectionP,
        services: ServicesSectionP,
        team: TeamSectionP,
        testimonials: TestimonialsSectionP,
        faq: FAQSectionP,
        gallery: GallerySectionP,
        cta: CTASectionP,
        contact: ContactSectionP,
        pricing: PricingSectionP,
        branches: BranchesSectionP,
    },
};

export function getSectionComponent(template: string | undefined, sectionKey: string): ComponentType<SectionProps> | null {
    const key = sectionKey as SectionKey;
    const sections = templateRegistry[template ?? 'lumina'] ?? templateRegistry['lumina'];
    return sections?.[key] ?? null;
}
