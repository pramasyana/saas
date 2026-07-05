import { Head, router } from '@inertiajs/react';
import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    usePublicBranches, usePublicServices, usePublicPackages, usePublicStaff,
    usePublicAvailability, usePublicCreateBooking, usePublicAddons,
} from '@/features/booking/hooks/usePublicBooking';
import type { ServiceItem, PackageItem, StaffMember, AddonItem, Branch } from '@/features/booking/hooks/usePublicBooking';
import PublicLayout from '@/layouts/PublicLayout';
import { cn, formatPrice } from '@/lib/utils';

interface CategoryItem {
    id: string;
    name: string;
    slug: string;
    color: string | null;
}

interface PageProps {
    branches: Branch[];
    services: ServiceItem[];
    packages: PackageItem[];
    categories: CategoryItem[];
    addons: AddonItem[];
    settings: {
        show_prices: boolean;
        enable_addons: boolean;
        enable_multi_service: boolean;
        enable_guests: boolean;
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
    primary: '#6B38D4',
    secondary: '#4648D4',
    accent: '#855000',
    background: '#FAF8FF',
    text: '#131B2E',
    text_muted: '#494454',
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

type StepName = 'Cabang' | 'Layanan' | 'Tambahan' | 'Tamu' | 'Waktu' | 'Data' | 'Konfirmasi';

export default function PublicBookingPage({ branches, services, settings, colors: colorsProp, tenant: tenantInfo, categories, packages: initialPackages, addons: initialAddons }: PageProps) {
    const c = { ...defaultColors, ...colorsProp };
    const [step, setStep] = useState(0);
    const [branchId, setBranchId] = useState(branches.length === 1 ? branches[0].id : '');
    const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);
    const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null);
    const [serviceAddons, setServiceAddons] = useState<Record<string, { addon: AddonItem; quantity: number }[]>>({});
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [totalGuests, setTotalGuests] = useState(1);
    const [guestNames, setGuestNames] = useState<string[]>([]);
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');

    const { data: servicesData } = usePublicServices({ branch_id: branchId });
    const { data: packagesData } = usePublicPackages({ branch_id: branchId });
    const { data: staffData } = usePublicStaff({ branch_id: branchId });
    const { data: addonsData } = usePublicAddons({ branch_id: branchId });
    const createMutation = usePublicCreateBooking();

    const multiBranch = branches.length > 1;
    const servicesList = servicesData?.data ?? services;
    const packagesList = packagesData?.data ?? initialPackages;
    const staffList = staffData?.data ?? [];
    const addonsList = addonsData?.data ?? initialAddons;

    const enableAddons = settings.enable_addons;
    const enableMultiService = settings.enable_multi_service;
    const enableGuests = settings.enable_guests;

    const totalDuration = useMemo(() => {
        if (selectedPackage) return Number(selectedPackage.duration) || 0;
        return selectedServices.reduce((sum, s) => sum + (Number(s.duration) || 0), 0);
    }, [selectedServices, selectedPackage]);

    const pax = Math.max(1, enableGuests ? totalGuests : 1);

    const totalPrice = useMemo(() => {
        if (selectedPackage) {
            const addonTotal = Object.values(serviceAddons).flat().reduce((sum, a) => sum + (Number(a.addon.price) || 0) * (Number(a.quantity) || 0), 0);
            return ((Number(selectedPackage.price) || 0) * pax) + addonTotal;
        }
        const serviceTotal = selectedServices.reduce((sum, s) => sum + (Number(s.price) || 0), 0) * pax;
        const addonTotal = Object.values(serviceAddons).flat().reduce((sum, a) => sum + (Number(a.addon.price) || 0) * (Number(a.quantity) || 0), 0);
        return serviceTotal + addonTotal;
    }, [selectedServices, selectedPackage, serviceAddons, pax]);

    const availServiceId = selectedServices[0]?.id ?? (selectedPackage ? selectedPackage.services[0]?.id : '');
    const { data: availability } = usePublicAvailability({
        date: selectedDate,
        service_id: availServiceId,
        duration: totalDuration,
        branch_id: branchId,
        staff_id: selectedStaff?.id,
    });
    const slots = availability?.data?.slots ?? [];

    const hasPackages = packagesList.length > 0;
    const allItems = servicesList;

    const filteredServices = useMemo(() => {
        let result = servicesList;
        if (activeCategory === '__packages') return [];
        if (activeCategory !== 'all') {
            result = result.filter((s) => s.category_id === activeCategory);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter((s) => s.name.toLowerCase().includes(q) || (s.description && s.description.toLowerCase().includes(q)));
        }
        return result;
    }, [activeCategory, servicesList, searchQuery]);

    const showPackagesInline = activeCategory === 'all' && packagesList.length > 0;

    const steps = useMemo(() => {
        const s: StepName[] = [];
        if (multiBranch) s.push('Cabang');
        s.push('Layanan');
        if (enableAddons && addonsList.length > 0) s.push('Tambahan');
        if (enableGuests) s.push('Tamu');
        s.push('Waktu', 'Data', 'Konfirmasi');
        return s;
    }, [multiBranch, enableAddons, enableGuests, addonsList.length]);

    function getStepIndex(stepName: StepName): number {
        return steps.indexOf(stepName);
    }

    const isLayananStep = steps[step] === 'Layanan';

    const hasSelection = selectedServices.length > 0 || !!selectedPackage;

    function canProceed(): boolean {
        switch (steps[step]) {
            case 'Cabang': return multiBranch ? !!branchId : true;
            case 'Layanan': return hasSelection;
            case 'Tambahan': return true;
            case 'Tamu': return true;
            case 'Waktu': return !!selectedSlot;
            case 'Data': return !!customerName && !!customerEmail && !!customerPhone;
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

    function toggleService(svc: ServiceItem) {
        if (!enableMultiService) {
            setSelectedServices([svc]);
            setSelectedPackage(null);
            setSelectedStaff(null);
            setSelectedSlot(null);
            setServiceAddons({});
            return;
        }
        setSelectedPackage(null);
        setSelectedStaff(null);
        setSelectedSlot(null);
        setSelectedServices((prev) => {
            const exists = prev.find((s) => s.id === svc.id);
            if (exists) return prev.filter((s) => s.id !== svc.id);
            return [...prev, svc];
        });
    }

    function selectPackage(pkg: PackageItem) {
        setSelectedPackage(pkg);
        setSelectedServices([]);
        setSelectedStaff(null);
        setSelectedSlot(null);
        setServiceAddons({});
    }

    function toggleAddon(svcId: string, addon: AddonItem) {
        setServiceAddons((prev) => {
            const current = prev[svcId] || [];
            const exists = current.find((a) => a.addon.id === addon.id);
            if (exists) {
                return { ...prev, [svcId]: current.filter((a) => a.addon.id !== addon.id) };
            }
            return { ...prev, [svcId]: [...current, { addon, quantity: 1 }] };
        });
    }

    function updateAddonQty(svcId: string, addonId: string, qty: number) {
        setServiceAddons((prev) => {
            const current = prev[svcId] || [];
            return {
                ...prev,
                [svcId]: current.map((a) => a.addon.id === addonId ? { ...a, quantity: Math.max(1, qty) } : a),
            };
        });
    }

    function handleGuestCountChange(count: number) {
        const clamped = Math.max(1, Math.min(50, count));
        setTotalGuests(clamped);
        setGuestNames((prev) => {
            if (prev.length === clamped) return prev;
            if (prev.length < clamped) return [...prev, ...Array(clamped - prev.length).fill('')];
            return prev.slice(0, clamped);
        });
    }

    function updateGuestName(idx: number, name: string) {
        setGuestNames((prev) => {
            const next = [...prev];
            next[idx] = name;
            return next;
        });
    }

    function buildServicesPayload() {
        if (selectedPackage) {
            return selectedPackage.services.map((ps) => ({
                service_id: ps.id,
                name: ps.name,
                price: 0,
                duration: 0,
                quantity: ps.quantity,
                addons: serviceAddons[ps.id]?.map((a) => ({
                    addon_id: a.addon.id,
                    name: a.addon.name,
                    price: a.addon.price,
                    quantity: a.quantity,
                })) || [],
            }));
        }
        return selectedServices.map((s) => ({
            service_id: s.id,
            name: s.name,
            price: s.price,
            duration: s.duration,
            quantity: 1,
            addons: serviceAddons[s.id]?.map((a) => ({
                addon_id: a.addon.id,
                name: a.addon.name,
                price: a.addon.price,
                quantity: a.quantity,
            })) || [],
        }));
    }

    function handleSubmit() {
        if (!hasSelection || !selectedSlot || !branchId) return;
        setError('');
        const servicesPayload = buildServicesPayload();
        const guestDetailsArr = totalGuests > 1 ? guestNames.filter(Boolean) : undefined;

        createMutation.mutate({
            customer_name: customerName,
            customer_email: customerEmail,
            customer_phone: customerPhone,
            services: servicesPayload,
            package_id: selectedPackage?.id,
            staff_id: selectedStaff?.id,
            branch_id: branchId,
            start_time: selectedSlot,
            duration_minutes: totalDuration,
            total_guests: totalGuests,
            guest_details: guestDetailsArr,
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

    const selectedItem = selectedPackage || (selectedServices.length > 0 ? selectedServices[0] : null);

    function renderProgressSteps() {
        return (
            <div className="flex items-center justify-center gap-0 overflow-x-auto px-4">
                {steps.map((label, i) => {
                    const isActive = i === step;
                    const isDone = i < step;
                    return (
                        <div key={label} className="flex items-center shrink-0">
                            {i > 0 && (
                                <div
                                    className={cn(
                                        'mx-2 h-0.5 w-8 sm:w-14 md:w-20 transition-colors shrink-0 rounded-full',
                                        isDone ? 'shadow-sm' : '',
                                    )}
                                    style={{
                                        background: isDone
                                            ? `linear-gradient(90deg, ${c.primary}, ${c.secondary || c.primary})`
                                            : `${c.primary}18`,
                                    }}
                                />
                            )}
                            <div className="flex flex-col items-center gap-1">
                                <div
                                    className={cn(
                                        'flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full text-xs sm:text-sm font-bold transition-all duration-300 shrink-0',
                                        isDone ? 'shadow-md' : '',
                                    )}
                                    style={{
                                        background: isDone
                                            ? `linear-gradient(135deg, ${c.primary}, ${c.secondary || c.primary})`
                                            : isActive
                                                ? `linear-gradient(135deg, ${c.primary}, ${c.secondary || c.primary})`
                                                : '#f0edf4',
                                        color: isDone || isActive ? '#fff' : c.text_muted,
                                        boxShadow: isDone || isActive ? `0 4px 12px ${c.primary}30` : 'none',
                                    }}
                                >
                                    {isDone ? (
                                        <span className="material-symbols-rounded text-lg sm:text-xl">check</span>
                                    ) : (
                                        i + 1
                                    )}
                                </div>
                                <span
                                    className={cn(
                                        'text-[10px] sm:text-xs font-semibold tracking-wide text-center whitespace-nowrap transition-colors',
                                        isActive ? 'opacity-100' : 'opacity-60',
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
        );
    }

    function renderSummaryBar() {
        if (!hasSelection || step >= getStepIndex('Konfirmasi')) return null;
        const stepName = steps[step];
        const showCompact = stepName === 'Layanan' || stepName === 'Tambahan' || stepName === 'Tamu';
        if (!showCompact) return null;
        return (
            <div className="glass-card rounded-2xl px-5 py-3.5 flex items-center gap-3">
                <span className="material-symbols-rounded text-lg shrink-0" style={{ color: c.primary }}>contract_edit</span>
                <div className="flex-1 min-w-0">
                    {selectedPackage ? (
                        <span className="text-sm font-semibold" style={{ color: c.text }}>{selectedPackage.name}</span>
                    ) : (
                        <>
                            {selectedServices.length === 1 ? (
                                <span className="text-sm font-semibold" style={{ color: c.text }}>{selectedServices[0].name}</span>
                            ) : (
                                <span className="text-sm font-semibold" style={{ color: c.text }}>{selectedServices.length} layanan dipilih</span>
                            )}
                        </>
                    )}
                    <span className="text-xs ml-2" style={{ color: c.text_muted }}>· {totalDuration} menit</span>
                    {settings.show_prices && (
                        <span className="text-sm font-bold ml-2" style={{ color: c.primary }}>{formatPrice(totalPrice)}</span>
                    )}
                </div>
            </div>
        );
    }

    function renderOrderSummary() {
        if (!hasSelection) return null;
        return (
            <div className="glass-card rounded-2xl p-5">
                <h4 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: c.text }}>
                    <span className="material-symbols-rounded text-base" style={{ color: c.primary }}>shopping_cart</span>
                    Pesanan Anda
                </h4>
                {selectedPackage ? (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1.5 font-medium" style={{ color: c.text }}>
                                <span className="material-symbols-rounded text-sm" style={{ color: c.primary }}>redeem</span>
                                {selectedPackage.name}
                            </span>
                            {settings.show_prices && (
                                <span className="font-bold text-xs" style={{ color: c.primary }}>
                                    {pax > 1 ? `${formatPrice(selectedPackage.price)} × ${pax}` : formatPrice(selectedPackage.price)}
                                </span>
                            )}
                        </div>
                        {selectedPackage.services.map((ps) => (
                            <div key={ps.id} className="text-xs pl-7" style={{ color: c.text_muted }}>
                                {ps.quantity > 1 && <span className="font-semibold">{ps.quantity}x </span>}
                                {ps.name}
                                {serviceAddons[ps.id]?.length > 0 && (
                                    <span className="ml-1 text-[10px]" style={{ color: c.primary }}>
                                        +{serviceAddons[ps.id].reduce((s, a) => s + a.quantity, 0)} tambahan
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {selectedServices.map((svc) => (
                            <div key={svc.id} className="flex items-center justify-between text-sm">
                                <span className="font-medium truncate flex items-center gap-1.5" style={{ color: c.text }}>
                                    <span className="material-symbols-rounded text-sm shrink-0" style={{ color: c.primary }}>spa</span>
                                    {svc.name}
                                </span>
                                {settings.show_prices && (
                                    <span className="font-bold text-xs shrink-0 ml-2" style={{ color: c.primary }}>
                                        {pax > 1 ? `${formatPrice(svc.price)} × ${pax}` : formatPrice(svc.price)}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                {settings.show_prices && (
                    <div className="mt-3 pt-3 border-t flex items-center justify-between" style={{ borderColor: `${c.primary}15` }}>
                        <span className="text-xs font-semibold" style={{ color: c.text_muted }}>Total</span>
                        <span className="text-base font-bold" style={{ color: c.primary }}>{formatPrice(totalPrice)}</span>
                    </div>
                )}
                <div className="mt-2 flex items-center gap-1 text-xs" style={{ color: c.text_muted }}>
                    <span className="material-symbols-rounded text-xs">schedule</span>
                    {totalDuration} menit
                </div>
            </div>
        );
    }

    function renderStickyFooter() {
        if (step >= getStepIndex('Konfirmasi')) return null;
        return (
            <div className="sticky bottom-0 left-0 right-0 z-40 border-t" style={{ backgroundColor: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderColor: `${c.primary}10` }}>
                <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                    <div>
                        {step > 0 && (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all hover:scale-105"
                                style={{ color: c.text, backgroundColor: `${c.primary}08` }}
                            >
                                <span className="material-symbols-rounded text-base">arrow_back</span>
                                <span className="hidden sm:inline">Kembali</span>
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        {settings.show_prices && hasSelection && (
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-medium" style={{ color: c.text_muted }}>Total</p>
                                <p className="text-lg font-bold" style={{ color: c.primary }}>{formatPrice(totalPrice)}</p>
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={nextStep}
                            disabled={!canProceed()}
                            className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
                            style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.secondary || c.primary})` }}
                        >
                            <span>Lanjut</span>
                            <span className="material-symbols-rounded text-base">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const searchInputRef = useRef<HTMLInputElement>(null);

    function renderCategoryIcon(cat: CategoryItem): string {
        const map: Record<string, string> = {
            'facial': 'face',
            'body': 'airwave',
            'hair': 'styler',
            'nail': 'magic_button',
            'massage': 'massage',
            'treatment': 'spa',
        };
        return map[cat.slug] || 'spa';
    }

    return (
        <PublicLayout tenantName={tenantInfo.name} logo={tenantInfo.logo} colors={c} solidHeader>
            <Head title="Booking">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
            </Head>

            <style>{`
                .glass-card {
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    box-shadow: 0 2px 20px rgba(107, 56, 212, 0.06);
                }
                .glass-card-strong {
                    background: rgba(255, 255, 255, 0.85);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.6);
                    box-shadow: 0 4px 24px rgba(107, 56, 212, 0.08);
                }
                .bloom-shadow {
                    box-shadow: 0 8px 40px rgba(107, 56, 212, 0.12);
                }
                .btn-primary {
                    background: linear-gradient(135deg, ${c.primary}, ${c.secondary || c.primary});
                    color: white;
                    font-weight: 600;
                    border-radius: 12px;
                    padding: 10px 24px;
                    transition: all 0.2s;
                    box-shadow: 0 4px 16px rgba(107, 56, 212, 0.25);
                }
                .btn-primary:hover {
                    transform: scale(1.03);
                    box-shadow: 0 6px 24px rgba(107, 56, 212, 0.35);
                }
                .btn-primary:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                    transform: none;
                }
                .material-symbols-rounded {
                    font-family: 'Material Symbols Rounded';
                    font-weight: normal;
                    font-style: normal;
                    font-size: 24px;
                    line-height: 1;
                    letter-spacing: normal;
                    text-transform: none;
                    display: inline-block;
                    white-space: nowrap;
                    word-wrap: normal;
                    direction: ltr;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                    text-rendering: optimizeLegibility;
                    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                }
                .material-symbols-rounded.fill {
                    font-family: 'Material Symbols Rounded';
                    font-weight: normal;
                    font-style: normal;
                    font-size: 24px;
                    line-height: 1;
                    letter-spacing: normal;
                    text-transform: none;
                    display: inline-block;
                    white-space: nowrap;
                    word-wrap: normal;
                    direction: ltr;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                    text-rendering: optimizeLegibility;
                    font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                }
            `}</style>

            <div className="pt-24 sm:pt-28 pb-4 sm:pb-6">
                {renderProgressSteps()}
            </div>

            <div className="mx-auto max-w-5xl px-4 pb-6 sm:px-6 lg:px-8">
                        {/* Summary Bar */}
                        {renderSummaryBar()}

                        {/* Error */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    className="mb-6 rounded-2xl border px-5 py-3.5 text-sm glass-card"
                                    style={{ borderColor: `${c.primary}15` }}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <span className="material-symbols-rounded text-base" style={{ color: c.primary }}>error</span>
                                        <span style={{ color: c.text }}>{error}</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence mode="wait">
                            {/* ═══ Step: Cabang ═══ */}
                            {step === getStepIndex('Cabang') && multiBranch && (
                                <motion.div key="step-cabang" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                                    <div className="text-center mb-8">
                                        <h2 className="text-2xl font-bold" style={{ color: c.text }}>Pilih Cabang</h2>
                                        <p className="mt-1.5 text-sm" style={{ color: c.text_muted }}>Pilih lokasi cabang yang ingin kamu kunjungi</p>
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2 max-w-2xl mx-auto">
                                        {branches.map((b) => {
                                            const isActive = branchId === b.id;
                                            return (
                                                <button
                                                    key={b.id}
                                                    type="button"
                                                    onClick={() => { setBranchId(b.id); setSelectedServices([]); setSelectedPackage(null); setSelectedStaff(null); setSelectedSlot(null); setServiceAddons({}); }}
                                                    className={cn(
                                                        'group relative flex flex-col gap-3 rounded-2xl p-6 text-left transition-all duration-300',
                                                        isActive ? 'glass-card-strong bloom-shadow' : 'glass-card hover:glass-card-strong hover:bloom-shadow',
                                                    )}
                                                    style={{
                                                        borderColor: isActive ? c.primary : 'rgba(255,255,255,0.5)',
                                                        borderWidth: isActive ? 2 : 1,
                                                    }}
                                                >
                                                    {isActive && (
                                                        <span className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full text-white text-xs" style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.secondary || c.primary})` }}>
                                                            <span className="material-symbols-rounded text-sm">check</span>
                                                        </span>
                                                    )}
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="flex h-11 w-11 items-center justify-center rounded-xl text-base transition-all"
                                                            style={{
                                                                background: isActive ? `linear-gradient(135deg, ${c.primary}, ${c.secondary || c.primary})` : `${c.primary}0c`,
                                                                color: isActive ? '#fff' : c.primary,
                                                            }}
                                                        >
                                                            <span className="material-symbols-rounded">location_on</span>
                                                        </div>
                                                        <span className="text-base font-bold" style={{ color: c.text }}>{b.name}</span>
                                                    </div>
                                                    {b.address && (
                                                        <p className="text-xs leading-relaxed pl-14" style={{ color: c.text_muted }}>{b.address}</p>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}

                            {/* ═══ Step: Layanan ═══ */}
                            {step === getStepIndex('Layanan') && (
                                <motion.div key="step-layanan" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                                    <div className="flex flex-col lg:flex-row lg:gap-8">
                                        {/* ── Sidebar (lg) / Horizontal scroll (mobile) ── */}
                                        <div className="lg:w-64 lg:shrink-0">
                                            <div className="glass-card rounded-2xl p-4 lg:sticky lg:top-24">
                                                <h3 className="text-xs font-bold uppercase tracking-wider mb-3 px-2" style={{ color: c.text_muted }}>Kategori</h3>
                                                <div className="flex lg:flex-col gap-1 overflow-x-auto pb-1 lg:pb-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                                                        className={cn(
                                                            'flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-all whitespace-nowrap lg:w-full',
                                                        )}
                                                        style={{
                                                            backgroundColor: activeCategory === 'all' ? `${c.primary}12` : 'transparent',
                                                            color: activeCategory === 'all' ? c.primary : c.text_muted,
                                                        }}
                                                    >
                                                        <span className="material-symbols-rounded text-base">grid_view</span>
                                                        <span className="truncate">Semua</span>
                                                        <span
                                                            className="ml-auto inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums leading-none"
                                                            style={{
                                                                backgroundColor: activeCategory === 'all' ? c.primary : `${c.primary}0c`,
                                                                color: activeCategory === 'all' ? '#fff' : c.text_muted,
                                                            }}
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
                                                                onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); }}
                                                                className={cn(
                                                                    'flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-all whitespace-nowrap lg:w-full',
                                                                )}
                                                                style={{
                                                                    backgroundColor: isCatActive ? `${c.primary}12` : 'transparent',
                                                                    color: isCatActive ? c.primary : c.text_muted,
                                                                }}
                                                            >
                                                                <span className="material-symbols-rounded text-base">{renderCategoryIcon(cat)}</span>
                                                                <span className="truncate">{cat.name}</span>
                                                                <span
                                                                    className="ml-auto inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums leading-none"
                                                                    style={{
                                                                        backgroundColor: isCatActive ? c.primary : `${c.primary}0c`,
                                                                        color: isCatActive ? '#fff' : c.text_muted,
                                                                    }}
                                                                >
                                                                    {count}
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                    {hasPackages && (
                                                        <button
                                                            type="button"
                                                            onClick={() => { setActiveCategory('__packages'); setSearchQuery(''); }}
                                                            className={cn(
                                                                'flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-all whitespace-nowrap lg:w-full',
                                                            )}
                                                            style={{
                                                                backgroundColor: activeCategory === '__packages' ? `${c.primary}12` : 'transparent',
                                                                color: activeCategory === '__packages' ? c.primary : c.text_muted,
                                                            }}
                                                        >
                                                            <span className="material-symbols-rounded text-base">redeem</span>
                                                            <span className="truncate">Paket</span>
                                                            <span
                                                                className="ml-auto inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums leading-none"
                                                                style={{
                                                                    backgroundColor: activeCategory === '__packages' ? c.primary : `${c.primary}0c`,
                                                                    color: activeCategory === '__packages' ? '#fff' : c.text_muted,
                                                                }}
                                                            >
                                                                {packagesList.length}
                                                            </span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Order Summary inside sidebar on lg+ */}
                                            <div className="hidden lg:block mt-4">
                                                {renderOrderSummary()}
                                            </div>
                                        </div>

                                        {/* ── Content ── */}
                                        <div className="flex-1 min-w-0 mt-6 lg:mt-0">
                                            {/* Search */}
                                            <div className="glass-card rounded-2xl flex items-center gap-3 px-4 py-2.5 mb-4">
                                                <span className="material-symbols-rounded text-base" style={{ color: c.text_muted }}>search</span>
                                                <input
                                                    ref={searchInputRef}
                                                    type="text"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    placeholder="Cari layanan..."
                                                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400"
                                                    style={{ color: c.text }}
                                                />
                                                {searchQuery && (
                                                    <button type="button" onClick={() => setSearchQuery('')} className="text-xs" style={{ color: c.text_muted }}>
                                                        <span className="material-symbols-rounded text-sm">close</span>
                                                    </button>
                                                )}
                                            </div>

                                            {activeCategory === '__packages' ? (
                                                packagesList.length === 0 ? (
                                                    <div className="glass-card rounded-2xl px-8 py-8 text-center">
                                                        <span className="material-symbols-rounded text-3xl" style={{ color: c.text_muted }}>inventory_2</span>
                                                        <p className="mt-3 text-sm font-medium" style={{ color: c.text }}>Belum ada paket tersedia</p>
                                                        <p className="mt-1 text-xs" style={{ color: c.text_muted }}>Paket akan muncul setelah ditambahkan oleh admin.</p>
                                                    </div>
                                                ) : (
                                                    <div className="grid gap-4 sm:grid-cols-2">
                                                        {packagesList.map((pkg) => {
                                                            const isActive = selectedPackage?.id === pkg.id;
                                                            return (
                                                                <button
                                                                    key={pkg.id}
                                                                    type="button"
                                                                    onClick={() => selectPackage(pkg)}
                                                                    className={cn(
                                                                        'group relative flex flex-col gap-3 rounded-2xl p-5 text-left transition-all duration-300',
                                                                        isActive ? 'glass-card-strong bloom-shadow' : 'glass-card hover:glass-card-strong',
                                                                    )}
                                                                    style={{ borderColor: isActive ? c.primary : 'rgba(255,255,255,0.5)', borderWidth: isActive ? 2 : 1 }}
                                                                >
                                                                    {isActive && (
                                                                        <span className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full text-white text-xs" style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.secondary || c.primary})` }}>
                                                                            <span className="material-symbols-rounded text-sm">check</span>
                                                                        </span>
                                                                    )}
                                                                    <div className="flex items-center justify-between gap-2">
                                                                        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
                                                                            style={{ backgroundColor: `${c.primary}0c`, color: c.primary }}
                                                                        >
                                                                            <span className="material-symbols-rounded text-xs">redeem</span>
                                                                            Paket
                                                                        </span>
                                                                        {settings.show_prices && (
                                                                            <span className="shrink-0 text-sm font-bold" style={{ color: c.primary }}>
                                                                                {formatPrice(pkg.price)}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <h3 className="text-sm font-bold" style={{ color: c.text }}>{pkg.name}</h3>
                                                                    {pkg.description && (
                                                                        <p className="text-xs leading-relaxed" style={{ color: c.text_muted }}>{pkg.description}</p>
                                                                    )}
                                                                    {pkg.services.length > 0 && (
                                                                        <div className="rounded-xl px-3 py-2.5" style={{ backgroundColor: `${c.primary}04` }}>
                                                                            <div className="mb-1.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: c.text_muted }}>
                                                                                <span className="material-symbols-rounded text-xs">checklist</span>
                                                                                Termasuk
                                                                            </div>
                                                                            <div className="space-y-0.5">
                                                                                {pkg.services.map((ps) => (
                                                                                    <div key={ps.id} className="flex items-center gap-2 text-xs" style={{ color: c.text_muted }}>
                                                                                        <span className="material-symbols-rounded text-xs" style={{ color: c.secondary }}>check</span>
                                                                                        {ps.quantity > 1 && <span className="font-semibold tabular-nums" style={{ color: c.text }}>{ps.quantity}x</span>}
                                                                                        <span>{ps.name}</span>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium" style={{ color: c.text_muted }}>
                                                                        <span className="material-symbols-rounded text-xs">schedule</span>
                                                                        {pkg.duration} menit
                                                                    </span>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                )
                                            ) : filteredServices.length === 0 && !showPackagesInline ? (
                                                <div className="glass-card rounded-2xl px-8 py-8 text-center">
                                                    <span className="material-symbols-rounded text-3xl" style={{ color: c.text_muted }}>spa</span>
                                                    <p className="mt-3 text-sm font-medium" style={{ color: c.text }}>Belum ada layanan tersedia</p>
                                                    <p className="mt-1 text-xs" style={{ color: c.text_muted }}>Layanan akan muncul setelah ditambahkan oleh admin.</p>
                                                </div>
                                            ) : (
                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    {filteredServices.map((s) => {
                                                        const isActive = enableMultiService
                                                            ? !!selectedServices.find((x) => x.id === s.id)
                                                            : selectedServices[0]?.id === s.id;
                                                        return (
                                                            <button
                                                                key={s.id}
                                                                type="button"
                                                                onClick={() => toggleService(s)}
                                                                className={cn(
                                                                    'group relative flex flex-col gap-3 rounded-2xl p-5 text-left transition-all duration-300',
                                                                    isActive ? 'glass-card-strong bloom-shadow' : 'glass-card hover:glass-card-strong',
                                                                )}
                                                                style={{ borderColor: isActive ? c.primary : 'rgba(255,255,255,0.5)', borderWidth: isActive ? 2 : 1 }}
                                                            >
                                                                {isActive && (
                                                                    <span className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full text-white text-xs" style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.secondary || c.primary})` }}>
                                                                        <span className="material-symbols-rounded text-sm fill">check</span>
                                                                    </span>
                                                                )}
                                                                <div className="flex items-start justify-between gap-3">
                                                                    <div className="min-w-0 flex-1">
                                                                        <div className="flex items-center gap-3">
                                                                            <div
                                                                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm transition-all"
                                                                                style={{
                                                                                    background: isActive ? `linear-gradient(135deg, ${c.primary}, ${c.secondary || c.primary})` : `${c.primary}0c`,
                                                                                    color: isActive ? '#fff' : c.primary,
                                                                                }}
                                                                            >
                                                                                <span className="material-symbols-rounded text-base">spa</span>
                                                                            </div>
                                                                            <span className="text-sm font-bold" style={{ color: c.text }}>{s.name}</span>
                                                                        </div>
                                                                        {s.description && (
                                                                            <p className="mt-2 text-xs leading-relaxed line-clamp-2" style={{ color: c.text_muted }}>{s.description}</p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center justify-between mt-1 pl-14">
                                                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium" style={{ color: c.text_muted }}>
                                                                        <span className="material-symbols-rounded text-xs">schedule</span>
                                                                        {s.duration} menit
                                                                    </span>
                                                                    {settings.show_prices && (
                                                                        <span className="text-sm font-bold" style={{ color: c.primary }}>{formatPrice(s.price)}</span>
                                                                    )}
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                    {showPackagesInline && packagesList.map((pkg) => {
                                                        const isActive = selectedPackage?.id === pkg.id;
                                                        return (
                                                            <button
                                                                key={`pkg-${pkg.id}`}
                                                                type="button"
                                                                onClick={() => selectPackage(pkg)}
                                                                className={cn(
                                                                    'group relative flex flex-col gap-3 rounded-2xl p-5 text-left transition-all duration-300',
                                                                    isActive ? 'glass-card-strong bloom-shadow' : 'glass-card hover:glass-card-strong',
                                                                )}
                                                                style={{ borderColor: isActive ? c.primary : 'rgba(255,255,255,0.5)', borderWidth: isActive ? 2 : 1 }}
                                                            >
                                                                {isActive && (
                                                                    <span className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full text-white text-xs" style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.secondary || c.primary})` }}>
                                                                        <span className="material-symbols-rounded text-sm">check</span>
                                                                    </span>
                                                                )}
                                                                <div className="flex items-center justify-between gap-2">
                                                                    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
                                                                        style={{ backgroundColor: `${c.primary}0c`, color: c.primary }}>
                                                                        <span className="material-symbols-rounded text-xs">redeem</span>
                                                                        Paket
                                                                    </span>
                                                                    {settings.show_prices && (
                                                                        <span className="shrink-0 text-sm font-bold" style={{ color: c.primary }}>
                                                                            {formatPrice(pkg.price)}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <h3 className="text-sm font-bold" style={{ color: c.text }}>{pkg.name}</h3>
                                                                {pkg.description && (
                                                                    <p className="text-xs leading-relaxed" style={{ color: c.text_muted }}>{pkg.description}</p>
                                                                )}
                                                                {pkg.services.length > 0 && (
                                                                    <div className="rounded-xl px-3 py-2.5" style={{ backgroundColor: `${c.primary}04` }}>
                                                                        <div className="mb-1.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: c.text_muted }}>
                                                                            <span className="material-symbols-rounded text-xs">checklist</span>
                                                                            Termasuk
                                                                        </div>
                                                                        <div className="space-y-0.5">
                                                                            {pkg.services.map((ps) => (
                                                                                <div key={ps.id} className="flex items-center gap-2 text-xs" style={{ color: c.text_muted }}>
                                                                                    <span className="material-symbols-rounded text-xs" style={{ color: c.secondary }}>check</span>
                                                                                    {ps.quantity > 1 && <span className="font-semibold tabular-nums" style={{ color: c.text }}>{ps.quantity}x</span>}
                                                                                    <span>{ps.name}</span>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                <span className="inline-flex items-center gap-1 text-[11px] font-medium" style={{ color: c.text_muted }}>
                                                                    <span className="material-symbols-rounded text-xs">schedule</span>
                                                                    {pkg.duration} menit
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {/* Order Summary (mobile/tablet only) */}
                                            <div className="lg:hidden mt-4">
                                                {renderOrderSummary()}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* ═══ Step: Tambahan ═══ */}
                            {step === getStepIndex('Tambahan') && (selectedServices.length > 0 || selectedPackage) && (
                                <motion.div key="step-tambahan" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                                    <div className="text-center mb-8">
                                        <h2 className="text-2xl font-bold" style={{ color: c.text }}>Tambahan (Opsional)</h2>
                                        <p className="mt-1.5 text-sm" style={{ color: c.text_muted }}>Pilih tambahan untuk setiap layanan</p>
                                    </div>

                                    <div className="space-y-5 max-w-2xl mx-auto">
                                        {(selectedPackage ? selectedPackage.services : selectedServices).map((svc) => {
                                            const svcId = 'id' in svc ? svc.id : svc.id;
                                            const svcName = svc.name;
                                            const selected = serviceAddons[svcId] || [];
                                            return (
                                                <div key={svcId} className="glass-card-strong rounded-2xl p-6">
                                                    <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: c.text }}>
                                                        <span className="material-symbols-rounded text-base" style={{ color: c.primary }}>spa</span>
                                                        {svcName}
                                                    </h3>
                                                    {addonsList.length === 0 ? (
                                                        <p className="text-xs" style={{ color: c.text_muted }}>Tidak ada tambahan tersedia</p>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            {addonsList.map((addon) => {
                                                                const isSelected = !!selected.find((a) => a.addon.id === addon.id);
                                                                return (
                                                                    <div
                                                                        key={addon.id}
                                                                        className={cn(
                                                                            'flex items-center justify-between gap-3 rounded-xl px-4 py-3.5 transition-all cursor-pointer',
                                                                            isSelected ? 'glass-card' : 'hover:bg-white/50',
                                                                        )}
                                                                        style={{
                                                                            border: isSelected ? `1.5px solid ${c.primary}` : '1.5px solid transparent',
                                                                            backgroundColor: isSelected ? `${c.primary}06` : 'transparent',
                                                                        }}
                                                                        onClick={() => toggleAddon(svcId, addon)}
                                                                    >
                                                                        <div className="flex items-start gap-3 min-w-0 flex-1">
                                                                            <div
                                                                                className={cn(
                                                                                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all mt-0.5',
                                                                                    isSelected ? 'text-white' : '',
                                                                                )}
                                                                                style={{
                                                                                    borderColor: isSelected ? c.primary : `${c.primary}30`,
                                                                                    backgroundColor: isSelected ? c.primary : 'transparent',
                                                                                }}
                                                                            >
                                                                                {isSelected && <span className="material-symbols-rounded text-xs fill">check</span>}
                                                                            </div>
                                                                            <div>
                                                                                <div className="text-sm font-medium" style={{ color: c.text }}>{addon.name}</div>
                                                                                {addon.description && (
                                                                                    <p className="mt-0.5 text-xs" style={{ color: c.text_muted }}>{addon.description}</p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center gap-3 shrink-0">
                                                                            {settings.show_prices && (
                                                                                <span className="text-sm font-semibold" style={{ color: c.primary }}>{formatPrice(addon.price)}</span>
                                                                            )}
                                                                            {isSelected && (
                                                                                <div className="flex items-center gap-1">
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={(e) => { e.stopPropagation(); updateAddonQty(svcId, addon.id, (selected.find((a) => a.addon.id === addon.id)?.quantity || 1) - 1); }}
                                                                                        className="flex h-7 w-7 items-center justify-center rounded-lg text-sm transition-all"
                                                                                        style={{ backgroundColor: `${c.primary}0c`, color: c.text }}
                                                                                    >
                                                                                        <span className="material-symbols-rounded text-sm">remove</span>
                                                                                    </button>
                                                                                    <span className="w-6 text-center text-sm font-semibold tabular-nums" style={{ color: c.text }}>
                                                                                        {selected.find((a) => a.addon.id === addon.id)?.quantity || 1}
                                                                                    </span>
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={(e) => { e.stopPropagation(); updateAddonQty(svcId, addon.id, (selected.find((a) => a.addon.id === addon.id)?.quantity || 1) + 1); }}
                                                                                        className="flex h-7 w-7 items-center justify-center rounded-lg text-sm transition-all"
                                                                                        style={{ backgroundColor: `${c.primary}0c`, color: c.text }}
                                                                                    >
                                                                                        <span className="material-symbols-rounded text-sm">add</span>
                                                                                    </button>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}

                            {/* ═══ Step: Tamu ═══ */}
                            {step === getStepIndex('Tamu') && (
                                <motion.div key="step-tamu" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                                    <div className="text-center mb-8">
                                        <h2 className="text-2xl font-bold" style={{ color: c.text }}>Jumlah Tamu</h2>
                                        <p className="mt-1.5 text-sm" style={{ color: c.text_muted }}>Berapa orang yang akan datang?</p>
                                    </div>

                                    <div className="glass-card-strong rounded-2xl p-6 max-w-lg mx-auto">
                                        <div className="mb-5">
                                            <label className="mb-3 block text-sm font-medium text-center" style={{ color: c.text }}>Jumlah orang</label>
                                            <div className="flex items-center justify-center gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => handleGuestCountChange(totalGuests - 1)}
                                                    disabled={totalGuests <= 1}
                                                    className="flex h-12 w-12 items-center justify-center rounded-xl text-lg transition-all hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
                                                    style={{ backgroundColor: `${c.primary}0c`, color: c.text }}
                                                >
                                                    <span className="material-symbols-rounded">remove</span>
                                                </button>
                                                <span className="w-14 text-center text-2xl font-extrabold tabular-nums" style={{ color: c.primary }}>{totalGuests}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleGuestCountChange(totalGuests + 1)}
                                                    disabled={totalGuests >= 50}
                                                    className="flex h-12 w-12 items-center justify-center rounded-xl text-lg transition-all hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
                                                    style={{ backgroundColor: `${c.primary}0c`, color: c.text }}
                                                >
                                                    <span className="material-symbols-rounded">add</span>
                                                </button>
                                            </div>
                                        </div>

                                        {totalGuests > 1 && (
                                            <div className="space-y-3">
                                                <label className="block text-sm font-medium" style={{ color: c.text }}>Nama tamu (opsional)</label>
                                                {Array.from({ length: totalGuests }).map((_, i) => (
                                                    <div key={i} className="flex items-center gap-2">
                                                        <span
                                                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                                                            style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.secondary || c.primary})`, color: '#fff' }}
                                                        >
                                                            {i + 1}
                                                        </span>
                                                        <input
                                                            type="text"
                                                            value={guestNames[i] || ''}
                                                            onChange={(e) => updateGuestName(i, e.target.value)}
                                                            placeholder={`Nama tamu ${i + 1}${i === 0 ? ' (Anda)' : ''}`}
                                                            className="block w-full rounded-xl border-2 px-4 py-2.5 text-sm outline-none transition-all placeholder:text-neutral-300"
                                                            style={{
                                                                borderColor: `${c.primary}15`,
                                                                color: c.text,
                                                                backgroundColor: 'rgba(255,255,255,0.6)',
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* ═══ Step: Waktu ═══ */}
                            {step === getStepIndex('Waktu') && (
                                <motion.div key="step-waktu" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                                    <div className="text-center mb-8">
                                        <h2 className="text-2xl font-bold" style={{ color: c.text }}>Pilih Staff & Waktu</h2>
                                        <p className="mt-1.5 text-sm" style={{ color: c.text_muted }}>Total durasi: {totalDuration} menit</p>
                                    </div>

                                    <div className="glass-card-strong rounded-2xl p-6 max-w-2xl mx-auto">
                                        {/* Staff */}
                                        <div className="mb-6">
                                            <label className="mb-2.5 block text-sm font-medium" style={{ color: c.text }}>Staff (opsional)</label>
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedStaff(null)}
                                                    className={cn(
                                                        'inline-flex items-center gap-1.5 rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-all',
                                                    )}
                                                    style={{
                                                        backgroundColor: !selectedStaff ? `${c.primary}12` : 'rgba(255,255,255,0.6)',
                                                        borderColor: !selectedStaff ? c.primary : `${c.primary}15`,
                                                        color: !selectedStaff ? c.primary : c.text_muted,
                                                    }}
                                                >
                                                    <span className="material-symbols-rounded text-base">smart_toy</span>
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
                                                                'inline-flex items-center gap-1.5 rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-all',
                                                            )}
                                                            style={{
                                                                backgroundColor: isActive ? `${c.primary}12` : 'rgba(255,255,255,0.6)',
                                                                borderColor: isActive ? c.primary : `${c.primary}15`,
                                                                color: isActive ? c.primary : c.text_muted,
                                                            }}
                                                        >
                                                            <span className="material-symbols-rounded text-base">badge</span>
                                                            {s.name}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Date */}
                                        <div className="mb-6">
                                            <label className="mb-2.5 block text-sm font-medium" style={{ color: c.text }}>
                                                <span className="inline-flex items-center gap-1.5">
                                                    <span className="material-symbols-rounded text-base">calendar_today</span>
                                                    Tanggal
                                                </span>
                                            </label>
                                            <input
                                                type="date"
                                                value={selectedDate}
                                                onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot(null); }}
                                                min={new Date().toISOString().split('T')[0]}
                                                className="block w-full rounded-xl border-2 px-4 py-2.5 text-sm outline-none transition-all"
                                                style={{
                                                    borderColor: selectedDate ? c.primary : `${c.primary}15`,
                                                    color: c.text,
                                                    backgroundColor: 'rgba(255,255,255,0.6)',
                                                    boxShadow: selectedDate ? `0 0 0 3px ${c.primary}0c` : undefined,
                                                }}
                                            />
                                        </div>

                                        {/* Time Slots */}
                                        {selectedDate && hasSelection && (
                                            <div>
                                                <label className="mb-2.5 block text-sm font-medium" style={{ color: c.text }}>
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <span className="material-symbols-rounded text-base">schedule</span>
                                                        Waktu
                                                    </span>
                                                </label>
                                                {slots.length === 0 ? (
                                                    <div className="rounded-2xl border-2 border-dashed px-6 py-8 text-center glass-card" style={{ borderColor: `${c.primary}15` }}>
                                                        <span className="material-symbols-rounded text-2xl" style={{ color: c.text_muted }}>event_busy</span>
                                                        <p className="mt-2 text-sm" style={{ color: c.text_muted }}>Tidak ada slot tersedia untuk tanggal ini.</p>
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
                                                                    )}
                                                                    style={{
                                                                        backgroundColor: isActive ? `${c.primary}12` : 'rgba(255,255,255,0.6)',
                                                                        borderColor: isActive ? c.primary : `${c.primary}12`,
                                                                        color: isActive ? c.primary : c.text,
                                                                    }}
                                                                >
                                                                    <div className="font-bold">{formatTime(slot.start_time)}</div>
                                                                    {!selectedStaff && slot.staff?.length > 0 && (
                                                                        <div className="mt-0.5 text-[10px] opacity-60" style={{ color: c.text_muted }}>{slot.staff[0].name}</div>
                                                                    )}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* ═══ Step: Data ═══ */}
                            {step === getStepIndex('Data') && (
                                <motion.div key="step-data" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                                    <div className="text-center mb-8">
                                        <h2 className="text-2xl font-bold" style={{ color: c.text }}>Data Diri</h2>
                                        <p className="mt-1.5 text-sm" style={{ color: c.text_muted }}>Lengkapi data diri kamu untuk booking</p>
                                    </div>

                                    <div className="glass-card-strong rounded-2xl p-6 max-w-lg mx-auto space-y-5">
                                        <div>
                                            <label className="mb-1.5 block text-sm font-medium" style={{ color: c.text }}>
                                                Nama <span style={{ color: c.primary }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={customerName}
                                                onChange={(e) => setCustomerName(e.target.value)}
                                                className="block w-full rounded-xl border-2 px-4 py-2.5 text-sm outline-none transition-all placeholder:text-neutral-300"
                                                style={{
                                                    borderColor: customerName ? c.primary : `${c.primary}15`,
                                                    color: c.text,
                                                    backgroundColor: 'rgba(255,255,255,0.6)',
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
                                                className="block w-full rounded-xl border-2 px-4 py-2.5 text-sm outline-none transition-all placeholder:text-neutral-300"
                                                style={{
                                                    borderColor: customerEmail ? c.primary : `${c.primary}15`,
                                                    color: c.text,
                                                    backgroundColor: 'rgba(255,255,255,0.6)',
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
                                                className="block w-full rounded-xl border-2 px-4 py-2.5 text-sm outline-none transition-all placeholder:text-neutral-300"
                                                style={{
                                                    borderColor: customerPhone ? c.primary : `${c.primary}15`,
                                                    color: c.text,
                                                    backgroundColor: 'rgba(255,255,255,0.6)',
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
                                                className="block w-full rounded-xl border-2 px-4 py-2.5 text-sm outline-none transition-all placeholder:text-neutral-300"
                                                style={{
                                                    borderColor: notes ? c.primary : `${c.primary}15`,
                                                    color: c.text,
                                                    backgroundColor: 'rgba(255,255,255,0.6)',
                                                    boxShadow: notes ? `0 0 0 3px ${c.primary}0c` : undefined,
                                                }}
                                                placeholder="Catatan tambahan..."
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* ═══ Step: Konfirmasi ═══ */}
                            {step === getStepIndex('Konfirmasi') && hasSelection && selectedSlot && (
                                <motion.div key="step-konfirmasi" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                                    <div className="text-center mb-8">
                                        <h2 className="text-2xl font-bold" style={{ color: c.text }}>Konfirmasi Booking</h2>
                                        <p className="mt-1.5 text-sm" style={{ color: c.text_muted }}>Periksa kembali detail booking kamu</p>
                                    </div>

                                    <div className="glass-card-strong rounded-2xl p-6 max-w-lg mx-auto">
                                        {/* Services / Package Detail */}
                                        {selectedPackage && (
                                            <div className="mb-4 rounded-xl px-4 py-3" style={{ backgroundColor: `${c.primary}06` }}>
                                                <div className="mb-2 flex items-center justify-between gap-1.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: c.text_muted }}>
                                                    <span className="flex items-center gap-1.5">
                                                        <span className="material-symbols-rounded text-xs">redeem</span>
                                                        {selectedPackage.name}
                                                    </span>
                                                    {settings.show_prices && (
                                                        <span className="text-xs font-bold" style={{ color: c.primary }}>
                                                            {pax > 1 ? formatPrice(selectedPackage.price * pax) : formatPrice(selectedPackage.price)}
                                                        </span>
                                                    )}
                                                </div>
                                                {pax > 1 && (
                                                    <p className="mb-2 text-right text-[10px]" style={{ color: c.text_muted }}>
                                                        {formatPrice(selectedPackage.price)} × {pax} orang
                                                    </p>
                                                )}
                                                <div className="space-y-1">
                                                    {selectedPackage.services.map((ps) => (
                                                        <div key={ps.id} className="flex items-center gap-2 text-xs" style={{ color: c.text_muted }}>
                                                            <span className="material-symbols-rounded text-xs" style={{ color: c.secondary }}>check</span>
                                                            {ps.quantity > 1 && <span className="font-semibold tabular-nums" style={{ color: c.text }}>{ps.quantity}x</span>}
                                                            <span>{ps.name}</span>
                                                            {serviceAddons[ps.id]?.length > 0 && (
                                                                <span className="text-[10px]" style={{ color: c.primary }}>
                                                                    +{serviceAddons[ps.id].reduce((s, a) => s + a.quantity, 0)} tambahan
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {!selectedPackage && selectedServices.length > 0 && (
                                            <div className="mb-4 space-y-2">
                                                {selectedServices.map((svc) => (
                                                    <div key={svc.id} className="rounded-xl px-4 py-3" style={{ backgroundColor: `${c.primary}06` }}>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2 text-sm font-medium" style={{ color: c.text }}>
                                                                <span className="material-symbols-rounded text-sm" style={{ color: c.secondary }}>check</span>
                                                                {svc.name}
                                                            </div>
                                                            {settings.show_prices && (
                                                                <div className="text-right">
                                                                    <span className="text-sm font-bold" style={{ color: c.primary }}>
                                                                        {pax > 1 ? formatPrice(svc.price * pax) : formatPrice(svc.price)}
                                                                    </span>
                                                                    {pax > 1 && (
                                                                        <p className="text-[10px]" style={{ color: c.text_muted }}>
                                                                            {formatPrice(svc.price)} × {pax} orang
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {serviceAddons[svc.id]?.length > 0 && (
                                                            <div className="mt-2 space-y-0.5 pl-6">
                                                                {serviceAddons[svc.id].map((a) => (
                                                                    <div key={a.addon.id} className="flex items-center justify-between text-xs" style={{ color: c.text_muted }}>
                                                                        <span>
                                                                            {a.quantity > 1 && <span className="font-semibold tabular-nums">{a.quantity}x </span>}
                                                                            {a.addon.name}
                                                                        </span>
                                                                        {settings.show_prices && (
                                                                            <span>{formatPrice(a.addon.price * a.quantity)}</span>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="space-y-2.5 text-sm">
                                            {selectedStaff && (
                                                <div className="flex items-center justify-between">
                                                    <span className="flex items-center gap-1.5" style={{ color: c.text_muted }}>
                                                        <span className="material-symbols-rounded text-sm">badge</span>
                                                        Staff
                                                    </span>
                                                    <span className="font-medium" style={{ color: c.text }}>{selectedStaff.name}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between">
                                                <span className="flex items-center gap-1.5" style={{ color: c.text_muted }}>
                                                    <span className="material-symbols-rounded text-sm">calendar_today</span>
                                                    Tanggal
                                                </span>
                                                <span className="font-medium" style={{ color: c.text }}>{formatDate(selectedSlot)}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="flex items-center gap-1.5" style={{ color: c.text_muted }}>
                                                    <span className="material-symbols-rounded text-sm">schedule</span>
                                                    Waktu
                                                </span>
                                                <span className="font-medium" style={{ color: c.text }}>
                                                    {formatTime(selectedSlot)} - {formatTime(new Date(new Date(selectedSlot).getTime() + (totalDuration * 60_000)).toISOString())}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="flex items-center gap-1.5" style={{ color: c.text_muted }}>
                                                    <span className="material-symbols-rounded text-sm">timer</span>
                                                    Durasi
                                                </span>
                                                <span className="font-medium" style={{ color: c.text }}>{totalDuration} menit</span>
                                            </div>
                                            {enableGuests && (
                                                <div className="flex items-center justify-between">
                                                    <span className="flex items-center gap-1.5" style={{ color: c.text_muted }}>
                                                        <span className="material-symbols-rounded text-sm">group</span>
                                                        Tamu
                                                    </span>
                                                    <span className="font-medium" style={{ color: c.text }}>{totalGuests} orang</span>
                                                </div>
                                            )}
                                            {enableGuests && totalGuests > 1 && guestNames.some(Boolean) && (
                                                <div className="flex items-start justify-between">
                                                    <span style={{ color: c.text_muted }}>Nama Tamu</span>
                                                    <div className="text-right font-medium" style={{ color: c.text }}>
                                                        {guestNames.filter(Boolean).map((n, i) => (
                                                            <div key={i}>{n}</div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            <hr style={{ borderColor: `${c.primary}10` }} />
                                            {settings.show_prices && (
                                                <div className="flex items-center justify-between">
                                                    <span className="flex items-center gap-1.5 font-semibold" style={{ color: c.text_muted }}>
                                                        <span className="material-symbols-rounded text-sm">payments</span>
                                                        Total Harga
                                                    </span>
                                                    <span className="text-lg font-extrabold" style={{ color: c.primary }}>{formatPrice(totalPrice)}</span>
                                                </div>
                                            )}
                                            <hr style={{ borderColor: `${c.primary}10` }} />
                                            <div className="flex items-center justify-between">
                                                <span style={{ color: c.text_muted }}>Nama</span>
                                                <span className="font-medium" style={{ color: c.text }}>{customerName}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span style={{ color: c.text_muted }}>Email</span>
                                                <span className="font-medium" style={{ color: c.text }}>{customerEmail}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span style={{ color: c.text_muted }}>Telepon</span>
                                                <span className="font-medium" style={{ color: c.text }}>{customerPhone}</span>
                                            </div>
                                            {notes && (
                                                <div className="flex items-center justify-between">
                                                    <span style={{ color: c.text_muted }}>Catatan</span>
                                                    <span className="font-medium" style={{ color: c.text }}>{notes}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-6 text-center">
                                        <button
                                            type="button"
                                            onClick={handleSubmit}
                                            disabled={createMutation.isPending}
                                            className="inline-flex items-center gap-2 rounded-2xl px-10 py-3.5 text-base font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
                                            style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.secondary || c.primary})` }}
                                        >
                                            {createMutation.isPending ? (
                                                <>
                                                    <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                    </svg>
                                                    Memproses...
                                                </>
                                            ) : (
                                                <>
                                                    <span className="material-symbols-rounded text-lg">check_circle</span>
                                                    Booking Sekarang
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Sticky Footer Nav */}
                    {renderStickyFooter()}

                    {/* ── Mobile Order Summary (below steps) ── */}
                    {isLayananStep && (
                        <div className="lg:hidden px-4 pb-24">
                            {renderOrderSummary()}
                        </div>
                    )}
        </PublicLayout>
    );
}
