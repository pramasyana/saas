import { Head } from '@inertiajs/react';
import Footer from '@/organisms/Footer';
import Navbar from '@/organisms/Navbar';
import CtaFooter from '@/pages/landing/CtaFooter';
import FaqSection from '@/pages/landing/FaqSection';
import FeaturesSection from '@/pages/landing/FeaturesSection';
import HeroSection from '@/pages/landing/HeroSection';
import HowItWorksSection from '@/pages/landing/HowItWorksSection';
import PricingSection from '@/pages/landing/PricingSection';
import TargetAudienceSection from '@/pages/landing/TargetAudienceSection';

export default function Welcome() {
    return (
        <>
            <Head title="BookCRM — Booking Lebih Pintar. Bisnis Lebih Berkembang." />

            <div className="min-h-screen bg-white font-sans text-neutral-900 antialiased">
                <Navbar />

                <main>
                    <HeroSection />
                    <HowItWorksSection />
                    <FeaturesSection />
                    <TargetAudienceSection />
                    <PricingSection />
                    <FaqSection />
                    <CtaFooter />
                </main>

                <Footer />
            </div>
        </>
    );
}
