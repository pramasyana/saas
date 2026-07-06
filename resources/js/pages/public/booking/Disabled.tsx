import { motion } from 'framer-motion';
import PublicLayout from '@/layouts/PublicLayout';

interface PageProps {
    colors?: {
        primary?: string;
        secondary?: string;
        accent?: string;
        background?: string;
        text?: string;
        text_muted?: string;
    } | null;
    tenant?: {
        name: string;
    };
}

const defaultColors = {
    primary: '#7C3AED',
    secondary: '#7C3AED',
    accent: '#F59E0B',
    background: '#FAFAFA',
    text: '#171717',
    text_muted: '#737373',
};

export default function BookingDisabled({ colors: colorsProp, tenant }: PageProps) {
    const c = { ...defaultColors, ...colorsProp };

    return (
        <PublicLayout tenantName={tenant?.name} colors={c} solidHeader>
            <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="text-center"
                >
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: c.primary + '08' }}>
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: c.primary }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold" style={{ color: c.text }}>Booking Tidak Tersedia</h1>
                    <p className="mt-2 text-sm" style={{ color: c.text_muted }}>
                        Maaf, booking online sedang tidak aktif untuk saat ini.
                    </p>
                    <p className="mt-1 text-sm" style={{ color: c.text_muted }}>
                        Silakan hubungi kami melalui kontak yang tersedia.
                    </p>
                </motion.div>
            </div>
        </PublicLayout>
    );
}
