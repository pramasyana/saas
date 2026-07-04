import { Head, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePublicBranches, usePublicServices, usePublicPackages, usePublicStaff, usePublicAvailability, usePublicCreateBooking } from '@/features/booking/hooks/usePublicBooking';
import PublicLayout from '@/layouts/PublicLayout';
import { cn, formatPrice } from '@/lib/utils';

interface Branch {
    id: string;
    name: string;
    slug: string;
    address: string | null;
    phone: string | null;
}

interface ServiceItem {
    id: string;
    name: string;
    description: string | null;
    duration: number;
    price: number;
    color: string | null;
    category_id: string | null;
}

interface PackageItem {
    id: string;
    name: string;
    description: string | null;
    price: number;
    duration: number;
    branch_id: string;
    services: { id: string; name: string; quantity: number }[];
}

interface CategoryItem {
    id: string;
    name: string;
    slug: string;
    color: string | null;
}

interface StaffMember {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    position: string | null;
    branch_id: string | null;
}

interface PageProps {
    branches: Branch[];
    services: ServiceItem[];
    packages: PackageItem[];
    categories: CategoryItem[];
    settings: {
        show_prices: boolean;
    };
    colors: {
        primary?: string;
        secondary?: string;
        accent?: string;
        background?: string;
        text?: string;
        text_muted?: string;
    } | null;
    tenant: {
        name: string;
        logo: string | null;
    };
}

const defaultColors = {
    primary: '#7C3AED',
    secondary: '#10B981',
    accent: '#F59E0B',
    background: '#FAFAFA',
    text: '#171717',
    text_muted: '#737373',
};

function formatTime(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

const containerVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

export default function PublicBookingPage({ branches, services, settings, colors: colorsProp, tenant: tenantInfo, categories, packages: initialPackages }: PageProps) {
    const c = { ...defaultColors, ...colorsProp };
    const [step, setStep] = useState(0);
    const [branchId, setBranchId] = useState(branches.length === 1 ? branches[0].id : '');
    const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
    const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');

    const { data: servicesData } = usePublicServices({ branch_id: branchId });
    const { data: packagesData } = usePublicPackages({ branch_id: branchId });
    const { data: staffData } = usePublicStaff({ branch_id: branchId });
    const availServiceId = selectedService?.id ?? (selectedPackage ? selectedPackage.services[0]?.id : '');
    const availDuration = selectedService?.duration ?? selectedPackage?.duration ?? 60;

    const { data: availability } = usePublicAvailability({
        date: selectedDate,
        service_id: availServiceId,
        duration: availDuration,
        branch_id: branchId,
        staff_id: selectedStaff?.id,
    });
    const createMutation = usePublicCreateBooking();

    const multiBranch = branches.length > 1;
    const servicesList = servicesData?.data ?? services;
    const packagesList = packagesData?.data ?? initialPackages;
    const staffList = staffData?.data ?? [];
    const slots = availability?.data?.slots ?? [];

    const hasPackages = packagesList.length > 0;
    const allItems = servicesList;

    const filteredServices = useMemo(() => {
        if (activeCategory === 'all') return servicesList;
        if (activeCategory === '__packages') return [];
        return servicesList.filter((s) => s.category_id === activeCategory);
    }, [activeCategory, servicesList]);

    const showPackagesInline = activeCategory === 'all' && packagesList.length > 0;

    const steps = useMemo(() => {
        const s = ['Layanan', 'Waktu', 'Data', 'Konfirmasi'];
        if (multiBranch) s.unshift('Cabang');
        return s;
    }, [multiBranch]);

    function getStepIndex(stepName: string): number {
        return steps.indexOf(stepName);
    }

    const selectedItem = selectedService || selectedPackage;

    function canProceed(): boolean {
        switch (step) {
            case getStepIndex('Cabang'): return multiBranch ? !!branchId : true;
            case getStepIndex('Layanan'): return !!selectedItem;
            case getStepIndex('Waktu'): return !!selectedSlot;
            case getStepIndex('Data'): return !!customerName && !!customerEmail && !!customerPhone;
            default: return false;
        }
    }

    function nextStep() {
        if (!canProceed()) return;
        setError('');
        setStep(step + 1);
    }

    function prevStep() {
        setError('');
        setStep(step - 1);
    }

    function handleSubmit() {
        if (!selectedItem || !selectedSlot || !branchId) return;
        setError('');
        createMutation.mutate({
            customer_name: customerName,
            customer_email: customerEmail,
            customer_phone: customerPhone,
            service_id: selectedService?.id,
            package_id: selectedPackage?.id,
            staff_id: selectedStaff?.id,
            branch_id: branchId,
            start_time: selectedSlot,
            duration_minutes: selectedPackage?.duration ?? selectedService!.duration,
            notes: notes || undefined,
        }, {
            onSuccess: (result) => {
                router.visit(`/booking/${result.data.booking_code}/confirmation`);
            },
            onError: (err: unknown) => {
                const axiosErr = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
                setError(axiosErr?.response?.data?.message
                    || Object.values(axiosErr?.response?.data?.errors ?? {}).flat().join(', ')
                    || 'Booking gagal. Silakan coba lagi.');
            },
        });
    }

    return (
        <PublicLayout tenantName={tenantInfo.name} colors={c} solidHeader>
            <Head title="Booking" />

            <div className="mx-auto max-w-4xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
                {/* Progress Steps */}
                <div className="mb-10 flex items-center justify-center gap-0">
                    {steps.map((label, i) => {
                        const isActive = i === step;
                        const isDone = i < step;
                        return (
                            <div key={label} className="flex items-center">
                                {i > 0 && (
                                    <div
                                        className={cn('mx-2 h-px w-8 sm:w-12 transition-colors', isDone ? '' : '')}
                                        style={{ backgroundColor: isDone ? c.primary : c.primary + '20' }}
                                    />
                                )}
                                <div className="flex items-center gap-2">
                                    <div
                                        className={cn(
                                            'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300',
                                            isDone ? 'text-white shadow-sm' : isActive ? 'text-white shadow-sm' : '',
                                        )}
                                        style={{
                                            backgroundColor: isDone || isActive ? c.primary : c.primary + '10',
                                            color: isDone || isActive ? '#fff' : c.text_muted,
                                        }}
                                    >
                                        {isDone ? (
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                        ) : (
                                            i + 1
                                        )}
                                    </div>
                                    <span
                                        className={cn(
                                            'text-sm font-medium transition-colors hidden sm:inline',
                                        )}
                                        style={{ color: isActive ? c.primary : c.text_muted }}
                                    >
                                        {label}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Error */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="mb-6 rounded-xl border px-5 py-3.5 text-sm"
                            style={{
                                backgroundColor: c.primary + '06',
                                borderColor: c.primary + '15',
                                color: c.text,
                            }}
                        >
                            <div className="flex items-center gap-2.5">
                                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: c.primary }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    {/* Step: Cabang */}
                    {step === getStepIndex('Cabang') && multiBranch && (
                        <motion.div key="step-cabang" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                            <h2 className="mb-6 text-xl font-bold" style={{ color: c.text }}>Pilih Cabang</h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {branches.map((b) => {
                                    const isActive = branchId === b.id;
                                    return (
                                        <button
                                            key={b.id}
                                            type="button"
                                            onClick={() => { setBranchId(b.id); setSelectedService(null); setSelectedStaff(null); setSelectedSlot(null); }}
                                            className={cn(
                                                'group relative flex flex-col gap-2 rounded-2xl border-2 p-5 text-left transition-all duration-300',
                                                isActive ? 'shadow-sm' : 'bg-white hover:border-neutral-300 hover:shadow-sm',
                                            )}
                                            style={{
                                                borderColor: isActive ? c.primary : c.primary + '12',
                                                boxShadow: isActive ? `0 2px 12px ${c.primary}14` : undefined,
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="flex h-10 w-10 items-center justify-center rounded-xl text-sm transition-all"
                                                    style={{
                                                        backgroundColor: isActive ? c.primary : c.primary + '08',
                                                        color: isActive ? '#fff' : c.primary,
                                                    }}
                                                >
                                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                                    </svg>
                                                </div>
                                                <span className="text-sm font-semibold" style={{ color: c.text }}>{b.name}</span>
                                            </div>
                                            {b.address && (
                                                <p className="text-xs leading-relaxed" style={{ color: c.text_muted }}>{b.address}</p>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* Step: Layanan */}
                    {step === getStepIndex('Layanan') && (
                        <motion.div key="step-layanan" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                            <h2 className="mb-6 text-xl font-bold" style={{ color: c.text }}>
                                {activeCategory === '__packages' ? 'Pilih Paket' : 'Pilih Layanan'}
                            </h2>

                            <div className="lg:flex lg:gap-10">
                                {(servicesList.length > 0 || packagesList.length > 0) && (
                                    <div className="mb-8 flex gap-1 overflow-x-auto pb-1 lg:mb-0 lg:w-52 lg:shrink-0 lg:flex-col lg:gap-0">
                                        <button
                                            type="button"
                                            onClick={() => { setActiveCategory('all'); setSelectedService(null); setSelectedPackage(null); setSelectedStaff(null); setSelectedSlot(null); }}
                                            className={cn(
                                                'relative flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all lg:w-full lg:rounded-r-none lg:rounded-l-xl',
                                                activeCategory === 'all' ? 'text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-800',
                                            )}
                                            style={{
                                                backgroundColor: activeCategory === 'all' ? c.primary : 'transparent',
                                            }}
                                        >
                                            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                                            </svg>
                                            <span className="truncate">Semua Layanan</span>
                                            <span
                                                className={cn(
                                                    'ml-auto inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums leading-none',
                                                    activeCategory === 'all' ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500',
                                                )}
                                            >
                                                {servicesList.length}
                                            </span>
                                        </button>
                                        {categories.map((cat) => {
                                            const isCatActive = activeCategory === cat.id;
                                            const count = servicesList.filter((s) => s.category_id === cat.id).length;
                                            return (
                                                <button
                                                    key={cat.id}
                                                    type="button"
                                                    onClick={() => { setActiveCategory(cat.id); setSelectedService(null); setSelectedPackage(null); setSelectedStaff(null); setSelectedSlot(null); }}
                                                    className={cn(
                                                        'relative flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all lg:w-full lg:rounded-r-none lg:rounded-l-xl',
                                                        isCatActive ? 'text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-800',
                                                    )}
                                                    style={{
                                                        backgroundColor: isCatActive ? (cat.color || c.primary) : 'transparent',
                                                    }}
                                                >
                                                    {cat.color && (
                                                        <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-white" style={{ backgroundColor: cat.color }} />
                                                    )}
                                                    {!cat.color && (
                                                        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                                                        </svg>
                                                    )}
                                                    <span className="truncate">{cat.name}</span>
                                                    <span
                                                        className={cn(
                                                            'ml-auto inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums leading-none',
                                                            isCatActive ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500',
                                                        )}
                                                    >
                                                        {count}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                        {hasPackages && (
                                            <button
                                                type="button"
                                                onClick={() => { setActiveCategory('__packages'); setSelectedService(null); setSelectedPackage(null); setSelectedStaff(null); setSelectedSlot(null); }}
                                                className={cn(
                                                    'relative flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all lg:w-full lg:rounded-r-none lg:rounded-l-xl',
                                                    activeCategory === '__packages' ? 'text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-800',
                                                )}
                                                style={{
                                                    backgroundColor: activeCategory === '__packages' ? c.primary : 'transparent',
                                                }}
                                            >
                                                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                                </svg>
                                                <span className="truncate">Paket</span>
                                                <span
                                                    className={cn(
                                                        'ml-auto inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums leading-none',
                                                        activeCategory === '__packages' ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500',
                                                    )}
                                                >
                                                    {packagesList.length}
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                )}

                                <div className="min-w-0 flex-1">
                                    {activeCategory === '__packages' ? (
                                        packagesList.length === 0 ? (
                                            <div className="flex items-center gap-3 rounded-2xl border bg-white px-8 py-5 shadow-sm" style={{ borderColor: c.primary + '15' }}>
                                                <svg className="h-8 w-8 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} style={{ color: c.text_muted }}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 11.625l2.25-2.25M12 11.625l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                                </svg>
                                                <div className="text-left">
                                                    <p className="text-sm font-medium" style={{ color: c.text }}>Belum ada paket tersedia</p>
                                                    <p className="mt-0.5 text-xs" style={{ color: c.text_muted }}>Paket akan muncul setelah ditambahkan oleh admin.</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                {packagesList.map((pkg) => {
                                                    const isActive = selectedPackage?.id === pkg.id;
                                                    return (
                                                        <button
                                                            key={pkg.id}
                                                            type="button"
                                                            onClick={() => { setSelectedPackage(pkg); setSelectedService(null); setSelectedStaff(null); setSelectedSlot(null); }}
                                                            className={cn(
                                                                'group relative flex flex-col gap-3 rounded-2xl border-2 p-5 text-left transition-all duration-300',
                                                                isActive ? 'shadow-sm' : 'bg-white hover:border-neutral-300 hover:shadow-sm',
                                                            )}
                                                            style={{
                                                                borderColor: isActive ? c.primary : c.primary + '14',
                                                                boxShadow: isActive ? `0 2px 12px ${c.primary}14` : undefined,
                                                            }}
                                                        >
                                                            <div className="flex items-center justify-between gap-2">
                                                                <span
                                                                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
                                                                    style={{ backgroundColor: c.primary + '08', color: c.primary }}
                                                                >
                                                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                                                    </svg>
                                                                    Paket
                                                                </span>
                                                                {settings.show_prices && (
                                                                    <span className="shrink-0 text-sm font-bold" style={{ color: c.primary }}>
                                                                        {formatPrice(pkg.price)}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <h3 className="text-sm font-semibold" style={{ color: c.text }}>{pkg.name}</h3>

                                                            {pkg.description && (
                                                                <p className="text-xs leading-relaxed" style={{ color: c.text_muted }}>{pkg.description}</p>
                                                            )}

                                                            {pkg.services.length > 0 && (
                                                                <div className="rounded-xl px-3 py-2.5" style={{ backgroundColor: c.primary + '03' }}>
                                                                    <div className="mb-1.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: c.text_muted }}>
                                                                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75" />
                                                                        </svg>
                                                                        Termasuk
                                                                    </div>
                                                                    <div className="space-y-0.5">
                                                                        {pkg.services.map((ps) => (
                                                                            <div key={ps.id} className="flex items-center gap-2 text-xs" style={{ color: c.text_muted }}>
                                                                                <svg className="h-3 w-3 shrink-0" style={{ color: c.secondary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                                                </svg>
                                                                                {ps.quantity > 1 && <span className="font-semibold tabular-nums" style={{ color: c.text }}>{ps.quantity}x</span>}
                                                                                <span>{ps.name}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <span className="inline-flex items-center gap-1 text-[11px] font-medium" style={{ color: c.text_muted }}>
                                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                {pkg.duration} menit
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )
                                    ) : filteredServices.length === 0 && !showPackagesInline ? (
                                        <div className="flex items-center gap-3 rounded-2xl border bg-white px-8 py-5 shadow-sm" style={{ borderColor: c.primary + '15' }}>
                                            <svg className="h-8 w-8 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} style={{ color: c.text_muted }}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 11.625l2.25-2.25M12 11.625l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                            </svg>
                                            <div className="text-left">
                                                <p className="text-sm font-medium" style={{ color: c.text }}>
                                                    Belum ada layanan tersedia
                                                </p>
                                                <p className="mt-0.5 text-xs" style={{ color: c.text_muted }}>
                                                    Layanan akan muncul setelah ditambahkan oleh admin.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            {filteredServices.map((s) => {
                                                const isActive = selectedService?.id === s.id;
                                                return (
                                                    <button
                                                        key={s.id}
                                                        type="button"
                                                        onClick={() => { setSelectedService(s); setSelectedPackage(null); setSelectedStaff(null); setSelectedSlot(null); }}
                                                        className={cn(
                                                            'group relative flex flex-col gap-3 rounded-2xl border-2 p-5 text-left transition-all duration-300',
                                                            isActive ? 'shadow-sm' : 'bg-white hover:border-neutral-300 hover:shadow-sm',
                                                        )}
                                                        style={{
                                                            borderColor: isActive ? c.primary : c.primary + '12',
                                                            boxShadow: isActive ? `0 2px 12px ${c.primary}14` : undefined,
                                                        }}
                                                    >
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="min-w-0 flex-1">
                                                                <div className="flex items-center gap-2.5">
                                                                    <div
                                                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs"
                                                                        style={{ backgroundColor: s.color || c.primary + '10' }}
                                                                    >
                                                                        <span style={{ color: s.color ? '#fff' : c.primary }}>✦</span>
                                                                    </div>
                                                                    <span className="text-sm font-semibold" style={{ color: c.text }}>{s.name}</span>
                                                                </div>
                                                                {s.description && (
                                                                    <p className="mt-2 text-xs leading-relaxed" style={{ color: c.text_muted }}>{s.description}</p>
                                                                )}
                                                            </div>
                                                            {settings.show_prices && (
                                                                <span className="shrink-0 text-sm font-bold" style={{ color: c.primary }}>
                                                                    {formatPrice(s.price)}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="inline-flex items-center gap-1 text-[11px] font-medium" style={{ color: c.text_muted }}>
                                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            {s.duration} menit
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                            {showPackagesInline && packagesList.map((pkg) => {
                                                const isActive = selectedPackage?.id === pkg.id;
                                                return (
                                                    <button
                                                        key={`pkg-${pkg.id}`}
                                                        type="button"
                                                        onClick={() => { setSelectedPackage(pkg); setSelectedService(null); setSelectedStaff(null); setSelectedSlot(null); }}
                                                        className={cn(
                                                            'group relative flex flex-col gap-3 rounded-2xl border-2 p-5 text-left transition-all duration-300',
                                                            isActive ? 'shadow-sm' : 'bg-white hover:border-neutral-300 hover:shadow-sm',
                                                        )}
                                                        style={{
                                                            borderColor: isActive ? c.primary : c.primary + '14',
                                                            boxShadow: isActive ? `0 2px 12px ${c.primary}14` : undefined,
                                                        }}
                                                    >
                                                        <div className="flex items-center justify-between gap-2">
                                                            <span
                                                                className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
                                                                style={{ backgroundColor: c.primary + '08', color: c.primary }}
                                                            >
                                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                                                </svg>
                                                                Paket
                                                            </span>
                                                            {settings.show_prices && (
                                                                <span className="shrink-0 text-sm font-bold" style={{ color: c.primary }}>
                                                                    {formatPrice(pkg.price)}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h3 className="text-sm font-semibold" style={{ color: c.text }}>{pkg.name}</h3>
                                                        {pkg.description && (
                                                            <p className="text-xs leading-relaxed" style={{ color: c.text_muted }}>{pkg.description}</p>
                                                        )}
                                                        {pkg.services.length > 0 && (
                                                            <div className="rounded-xl px-3 py-2.5" style={{ backgroundColor: c.primary + '03' }}>
                                                                <div className="mb-1.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: c.text_muted }}>
                                                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75" />
                                                                    </svg>
                                                                    Termasuk
                                                                </div>
                                                                <div className="space-y-0.5">
                                                                    {pkg.services.map((ps) => (
                                                                        <div key={ps.id} className="flex items-center gap-2 text-xs" style={{ color: c.text_muted }}>
                                                                            <svg className="h-3 w-3 shrink-0" style={{ color: c.secondary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                                            </svg>
                                                                            {ps.quantity > 1 && <span className="font-semibold tabular-nums" style={{ color: c.text }}>{ps.quantity}x</span>}
                                                                            <span>{ps.name}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                        <span className="inline-flex items-center gap-1 text-[11px] font-medium" style={{ color: c.text_muted }}>
                                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            {pkg.duration} menit
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step: Waktu */}
                    {step === getStepIndex('Waktu') && (
                        <motion.div key="step-waktu" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                            <h2 className="mb-6 text-xl font-bold" style={{ color: c.text }}>Pilih Staff & Waktu</h2>

                            {/* Staff */}
                            <div className="mb-6">
                                <label className="mb-2.5 block text-sm font-medium" style={{ color: c.text }}>Staff (opsional)</label>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedStaff(null)}
                                        className={cn(
                                            'rounded-xl border px-4 py-2 text-sm font-medium transition-all',
                                            !selectedStaff
                                                ? 'text-white shadow-sm'
                                                : 'bg-white hover:border-neutral-300',
                                        )}
                                        style={{
                                            backgroundColor: !selectedStaff ? c.primary : undefined,
                                            borderColor: !selectedStaff ? c.primary : c.primary + '20',
                                            color: !selectedStaff ? '#fff' : c.text_muted,
                                        }}
                                    >
                                        Staff Otomatis
                                    </button>
                                    {staffList.map((s) => {
                                        const isActive = selectedStaff?.id === s.id;
                                        return (
                                            <button
                                                key={s.id}
                                                type="button"
                                                onClick={() => setSelectedStaff(s)}
                                                className={cn(
                                                    'rounded-xl border px-4 py-2 text-sm font-medium transition-all',
                                                    isActive ? 'text-white shadow-sm' : 'bg-white hover:border-neutral-300',
                                                )}
                                                style={{
                                                    backgroundColor: isActive ? c.primary : undefined,
                                                    borderColor: isActive ? c.primary : c.primary + '20',
                                                    color: isActive ? '#fff' : c.text_muted,
                                                }}
                                            >
                                                {s.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Date */}
                            <div className="mb-6">
                                <label className="mb-2.5 block text-sm font-medium" style={{ color: c.text }}>Tanggal</label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot(null); }}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="block w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all"
                                    style={{
                                        borderColor: selectedDate ? c.primary + '30' : c.primary + '15',
                                        color: c.text,
                                        boxShadow: selectedDate ? `0 0 0 3px ${c.primary}0c` : undefined,
                                    }}
                                />
                            </div>

                            {/* Time Slots */}
                            {selectedDate && selectedItem && (
                                <div>
                                    <label className="mb-2.5 block text-sm font-medium" style={{ color: c.text }}>Waktu</label>
                                    {slots.length === 0 ? (
                                        <div className="rounded-2xl border-2 border-dashed px-6 py-8 text-center" style={{ borderColor: c.primary + '12' }}>
                                            <p className="text-sm" style={{ color: c.text_muted }}>Tidak ada slot tersedia untuk tanggal ini.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                                            {slots.map((slot) => {
                                                const isActive = selectedSlot === slot.start_time;
                                                return (
                                                    <button
                                                        key={slot.start_time}
                                                        type="button"
                                                        onClick={() => setSelectedSlot(slot.start_time)}
                                                        className={cn(
                                                            'rounded-xl border-2 px-3 py-2.5 text-center text-sm transition-all duration-200',
                                                            isActive ? 'text-white shadow-sm' : 'bg-white hover:border-neutral-300',
                                                        )}
                                                        style={{
                                                            backgroundColor: isActive ? c.primary : undefined,
                                                            borderColor: isActive ? c.primary : c.primary + '12',
                                                            color: isActive ? '#fff' : c.text,
                                                        }}
                                                    >
                                                        <div className="font-medium">{formatTime(slot.start_time)}</div>
                                                        {!selectedStaff && slot.staff?.length > 0 && (
                                                            <div className="mt-0.5 text-[10px] opacity-70">{slot.staff[0].name}</div>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Step: Data */}
                    {step === getStepIndex('Data') && (
                        <motion.div key="step-data" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                            <h2 className="mb-6 text-xl font-bold" style={{ color: c.text }}>Data Diri</h2>
                            <div className="space-y-5">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium" style={{ color: c.text }}>
                                        Nama <span style={{ color: c.primary }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        className="block w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all placeholder:text-neutral-300"
                                        style={{
                                            borderColor: customerName ? c.primary + '30' : c.primary + '15',
                                            color: c.text,
                                            boxShadow: customerName ? `0 0 0 3px ${c.primary}0c` : undefined,
                                        }}
                                        placeholder="Nama lengkap"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium" style={{ color: c.text }}>
                                        Email <span style={{ color: c.primary }}>*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={customerEmail}
                                        onChange={(e) => setCustomerEmail(e.target.value)}
                                        className="block w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all placeholder:text-neutral-300"
                                        style={{
                                            borderColor: customerEmail ? c.primary + '30' : c.primary + '15',
                                            color: c.text,
                                            boxShadow: customerEmail ? `0 0 0 3px ${c.primary}0c` : undefined,
                                        }}
                                        placeholder="email@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium" style={{ color: c.text }}>
                                        No. Telepon <span style={{ color: c.primary }}>*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={customerPhone}
                                        onChange={(e) => setCustomerPhone(e.target.value)}
                                        className="block w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all placeholder:text-neutral-300"
                                        style={{
                                            borderColor: customerPhone ? c.primary + '30' : c.primary + '15',
                                            color: c.text,
                                            boxShadow: customerPhone ? `0 0 0 3px ${c.primary}0c` : undefined,
                                        }}
                                        placeholder="08123456789"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium" style={{ color: c.text }}>Catatan (opsional)</label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={3}
                                        className="block w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all placeholder:text-neutral-300"
                                        style={{
                                            borderColor: notes ? c.primary + '30' : c.primary + '15',
                                            color: c.text,
                                            boxShadow: notes ? `0 0 0 3px ${c.primary}0c` : undefined,
                                        }}
                                        placeholder="Catatan tambahan..."
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step: Konfirmasi */}
                    {step === getStepIndex('Konfirmasi') && selectedItem && selectedSlot && (
                        <motion.div key="step-konfirmasi" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                            <h2 className="mb-6 text-xl font-bold" style={{ color: c.text }}>Konfirmasi Booking</h2>

                            <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: c.primary + '10' }}>
                                {selectedPackage && (
                                    <div className="mb-4 rounded-xl px-4 py-3" style={{ backgroundColor: c.primary + '06' }}>
                                        <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: c.text_muted }}>
                                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                            </svg>
                                            Termasuk
                                        </div>
                                        <div className="space-y-1">
                                            {selectedPackage.services.map((ps) => (
                                                <div key={ps.id} className="flex items-center gap-2 text-xs" style={{ color: c.text_muted }}>
                                                    <svg className="h-3 w-3 shrink-0" style={{ color: c.secondary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                    </svg>
                                                    {ps.quantity > 1 && <span className="font-semibold tabular-nums" style={{ color: c.text }}>{ps.quantity}x</span>}
                                                    <span>{ps.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <table className="w-full text-sm">
                                    <tbody>
                                        {[
                                            { label: selectedPackage ? 'Paket' : 'Layanan', value: selectedItem.name },
                                            ...(selectedStaff ? [{ label: 'Staff', value: selectedStaff.name }] : []),
                                            { label: 'Tanggal', value: formatDate(selectedSlot) },
                                            { label: 'Waktu', value: `${formatTime(selectedSlot)} - ${formatTime(new Date(new Date(selectedSlot).getTime() + ((selectedPackage?.duration ?? selectedService!.duration) * 60_000)).toISOString())}` },
                                            { label: 'Durasi', value: `${selectedPackage?.duration ?? selectedService!.duration} menit` },
                                            ...(settings.show_prices ? [{ label: 'Harga', value: formatPrice(selectedPackage?.price ?? selectedService!.price), highlight: true as const }] : []),
                                            { label: 'Nama', value: customerName },
                                            { label: 'Email', value: customerEmail },
                                            { label: 'Telepon', value: customerPhone },
                                            ...(notes ? [{ label: 'Catatan', value: notes }] : []),
                                        ].map((row) => (
                                            <tr key={row.label}>
                                                <td className="w-1/3 py-2.5 pr-4 text-sm" style={{ color: c.text_muted }}>{row.label}</td>
                                                <td
                                                    className={cn('py-2.5 text-sm font-medium', row.highlight ? 'font-bold' : '')}
                                                    style={{ color: row.highlight ? c.primary : c.text }}
                                                >
                                                    {row.value}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={createMutation.isPending}
                                className="mt-6 w-full rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                                style={{ backgroundColor: c.primary }}
                            >
                                {createMutation.isPending ? (
                                    <span className="inline-flex items-center gap-2">
                                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Memproses...
                                    </span>
                                ) : 'Booking Sekarang'}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                {step < getStepIndex('Konfirmasi') && (
                    <div className={cn('mt-8 flex items-center', step === 0 ? 'justify-end' : 'justify-between')}>
                        {step > 0 && (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="rounded-xl border px-6 py-2.5 text-sm font-medium transition-all hover:shadow-sm"
                                style={{
                                    borderColor: c.primary + '20',
                                    color: c.text,
                                    backgroundColor: 'white',
                                }}
                            >
                                Kembali
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={nextStep}
                            disabled={!canProceed()}
                            className="rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                            style={{ backgroundColor: c.primary }}
                        >
                            Lanjut
                        </button>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
