import { Head } from '@inertiajs/react';
import Footer from '@/organisms/Footer';
import Navbar from '@/organisms/Navbar';
import BenefitsSection from '@/pages/landing/BenefitsSection';
import CtaFooter from '@/pages/landing/CtaFooter';
import DifferentiationSection from '@/pages/landing/DifferentiationSection';
import FaqSection from '@/pages/landing/FaqSection';
import FeaturesSection from '@/pages/landing/FeaturesSection';
import GoalSection from '@/pages/landing/GoalSection';
import HeroSection from '@/pages/landing/HeroSection';
import HowItWorksSection from '@/pages/landing/HowItWorksSection';
import MarketSection from '@/pages/landing/MarketSection';
import PricingSection from '@/pages/landing/PricingSection';
import ProblemSection from '@/pages/landing/ProblemSection';
import SolutionSection from '@/pages/landing/SolutionSection';
import TargetAudienceSection from '@/pages/landing/TargetAudienceSection';
import WhyNowSection from '@/pages/landing/WhyNowSection';

export default function Welcome() {
    return (
        <>
            <Head title="BookCRM — Booking Lebih Pintar. Bisnis Lebih Berkembang." />

            <div className="min-h-screen bg-white font-sans text-neutral-900 antialiased">
                <Navbar />

                <main>
                    <HeroSection />
                    <ProblemSection />
                    <SolutionSection />
                    <BenefitsSection />
                    <TargetAudienceSection />
                    <HowItWorksSection />
                    <PricingSection />
                    <FeaturesSection />
                    <MarketSection />
                    <WhyNowSection />
                    <DifferentiationSection />
                    <GoalSection />
                    <FaqSection />
                    <CtaFooter />
                </main>

                <Footer />
            </div>
        </>
    );
}
