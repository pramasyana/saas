import { usePage } from '@inertiajs/react';
import Section from '@/molecules/Section';
import PlanCardGroup from '@/organisms/PlanCardGroup';

export default function PricingSection() {
    const { plans } = usePage<{ plans: any[] }>().props;

    return (
        <Section
            id="pricing"
            heading="Harga sederhana dan transparan."
            subheading="Mulai gratis. Upgrade saat berkembang. Tanpa kejutan."
            className="bg-neutral-50/50"
        >
            <div className="mx-auto max-w-6xl">
                <PlanCardGroup mode="link" plans={plans} />

                <p className="mt-8 text-center text-sm text-neutral-400">
                    Semua paket termasuk uji coba 14 hari. Tanpa kartu kredit.
                </p>
            </div>
        </Section>
    );
}
