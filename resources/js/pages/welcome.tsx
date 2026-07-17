import { Head } from '@inertiajs/react';
import Footer from '@/organisms/Footer';
import Navbar from '@/organisms/Navbar';
import CtaFooter from '@/pages/landing/CtaFooter';
import FaqSection from '@/pages/landing/FaqSection';
import HeroSection from '@/pages/landing/HeroSection';
import TrustedBySection from '@/pages/landing/TrustedBySection';
import CoreFeaturesSection from '@/pages/landing/CoreFeaturesSection';
import ContentSection from '@/pages/landing/ContentSection';
import TestimonialsSection from '@/pages/landing/TestimonialsSection';
import PricingSection from '@/pages/landing/PricingSection';

export default function Welcome() {
    return (
        <>
            <Head title="Nusentra — Connected Business Ecosystem" />

            <div className="min-h-screen bg-background font-sans text-on-background antialiased">
                <Navbar />

                <main className="pt-2 overflow-hidden">
                    <HeroSection />
                    <TrustedBySection />
                    <CoreFeaturesSection />
                    <ContentSection />
                    <TestimonialsSection />
                    <PricingSection />
                    <FaqSection />
                    <CtaFooter />
                </main>

                <Footer />
            </div>
        </>
    );
}
