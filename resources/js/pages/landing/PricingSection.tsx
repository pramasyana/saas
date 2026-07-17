import { usePage } from '@inertiajs/react';
import Section from '@/molecules/Section';
import PlanCardGroup from '@/organisms/PlanCardGroup';

export default function PricingSection() {
    const { plans } = usePage<{ plans: any[] }>().props;

    return (
        <Section
            id="pricing"
            heading="Paket Harga yang Sesuai untuk Anda"
            subheading="Pilih paket yang paling sesuai dengan skala bisnis Anda saat ini."
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
