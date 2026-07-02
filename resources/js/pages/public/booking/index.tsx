import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { usePublicBranches, usePublicServices, usePublicStaff, usePublicAvailability, usePublicCreateBooking } from '@/features/booking/hooks/usePublicBooking';
import PublicLayout from '@/layouts/PublicLayout';

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
    settings: {
        show_prices: boolean;
    };
    tenant: {
        name: string;
        logo: string | null;
    };
}

function formatTime(dateStr: string): string {
    const d = new Date(dateStr);

    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(dateStr: string): string {
    const d = new Date(dateStr);

    return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export default function PublicBookingPage({ branches, services, settings, tenant: tenantInfo }: PageProps) {
    const [step, setStep] = useState(0);
    const [branchId, setBranchId] = useState(branches.length === 1 ? branches[0].id : '');
    const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');

    const { data: servicesData } = usePublicServices({ branch_id: branchId });
    const { data: staffData } = usePublicStaff({ branch_id: branchId });
    const { data: availability } = usePublicAvailability({
        date: selectedDate,
        service_id: selectedService?.id ?? '',
        duration: selectedService?.duration ?? 60,
        branch_id: branchId,
        staff_id: selectedStaff?.id,
    });
    const createMutation = usePublicCreateBooking();

    const multiBranch = branches.length > 1;
    const servicesList = servicesData?.data ?? services;
    const staffList = staffData?.data ?? [];
    const slots = availability?.data?.slots ?? [];

    function canProceed(): boolean {
        switch (step) {
            case 0: return multiBranch ? !!branchId : true;
            case 1: return !!selectedService;
            case 2: return !!selectedSlot;
            case 3: return !!customerName && !!customerEmail && !!customerPhone;
            default: return false;
        }
    }

    function nextStep() {
        if (!canProceed()) {
return;
}

        setError('');

        if (step === 0 && !multiBranch) {
            setStep(2);
        } else {
            setStep(step + 1);
        }
    }

    function prevStep() {
        setError('');

        if (step === 1 && !multiBranch) {
            setStep(0);
        } else {
            setStep(step - 1);
        }
    }

    function handleSubmit() {
        if (!selectedService || !selectedSlot || !branchId) {
return;
}

        setError('');
        createMutation.mutate({
            customer_name: customerName,
            customer_email: customerEmail,
            customer_phone: customerPhone,
            service_id: selectedService.id,
            staff_id: selectedStaff?.id,
            branch_id: branchId,
            start_time: selectedSlot,
            duration_minutes: selectedService.duration,
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
        <PublicLayout tenantName={tenantInfo.name}>
            <Head title="Booking" />

            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Progress Steps */}
                <div className="mb-8 flex items-center justify-center gap-2">
                    {[multiBranch ? 'Cabang' : null, 'Layanan', 'Waktu', 'Data', 'Konfirmasi'].filter(Boolean).map((label, i) => {
                        const actualStep = multiBranch ? i : i + 1;
                        const isActive = actualStep === step;
                        const isDone = actualStep < step;

                        return (
                            <div key={label} className="flex items-center gap-2">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                                    isDone ? 'bg-success text-white' : isActive ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-500'
                                }`}>
                                    {isDone ? '\u2713' : actualStep + 1}
                                </div>
                                <span className={`text-sm ${isActive ? 'font-semibold text-primary' : 'text-neutral-400'}`}>
                                    {label}
                                </span>
                                {i < (multiBranch ? 4 : 3) && <div className="mx-1 h-px w-6 bg-neutral-300" />}
                            </div>
                        );
                    })}
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-lg border border-danger/20 bg-danger-50 p-4 text-sm text-danger">
                        {error}
                    </div>
                )}

                {/* Step 0: Branch Selection */}
                {step === 0 && multiBranch && (
                    <div>
                        <h2 className="mb-6 text-xl font-bold text-neutral-900">Pilih Cabang</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {branches.map((b) => (
                                <button
                                    key={b.id}
                                    type="button"
                                    onClick={() => {
 setBranchId(b.id); setSelectedService(null); setSelectedStaff(null); setSelectedSlot(null); 
}}
                                    className={`rounded-xl border-2 p-4 text-left transition-all ${
                                        branchId === b.id ? 'border-primary bg-primary-50 shadow-sm' : 'border-border bg-white hover:border-primary/40'
                                    }`}
                                >
                                    <div className="font-semibold text-neutral-900">{b.name}</div>
                                    {b.address && <div className="mt-1 text-sm text-neutral-500">{b.address}</div>}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 1: Service Selection */}
                {step === (multiBranch ? 1 : 0) && (
                    <div>
                        <h2 className="mb-6 text-xl font-bold text-neutral-900">Pilih Layanan</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {servicesList.map((s) => (
                                <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => {
 setSelectedService(s); setSelectedStaff(null); setSelectedSlot(null); 
}}
                                    className={`rounded-xl border-2 p-4 text-left transition-all ${
                                        selectedService?.id === s.id ? 'border-primary bg-primary-50 shadow-sm' : 'border-border bg-white hover:border-primary/40'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <div className="font-semibold text-neutral-900">{s.name}</div>
                                            {s.description && <div className="mt-1 text-sm text-neutral-500">{s.description}</div>}
                                            <div className="mt-2 text-sm text-neutral-400">{s.duration} menit</div>
                                        </div>
                                        {settings.show_prices && (
                                            <div className="shrink-0 text-sm font-bold text-primary">
                                                Rp {s.price.toLocaleString('id-ID')}
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Staff & Time */}
                {step === (multiBranch ? 2 : 1) && (
                    <div>
                        <h2 className="mb-4 text-xl font-bold text-neutral-900">Pilih Staff & Waktu</h2>

                        {/* Staff */}
                        <div className="mb-6">
                            <label className="mb-2 block text-sm font-medium text-neutral-700">Staff (opsional)</label>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedStaff(null)}
                                    className={`rounded-lg border px-4 py-2 text-sm transition-all ${
                                        !selectedStaff ? 'border-primary bg-primary-50 font-medium text-primary' : 'border-border bg-white text-neutral-600 hover:border-primary/40'
                                    }`}
                                >
                                    Staff Otomatis
                                </button>
                                {staffList.map((s) => (
                                    <button
                                        key={s.id}
                                        type="button"
                                        onClick={() => setSelectedStaff(s)}
                                        className={`rounded-lg border px-4 py-2 text-sm transition-all ${
                                            selectedStaff?.id === s.id ? 'border-primary bg-primary-50 font-medium text-primary' : 'border-border bg-white text-neutral-600 hover:border-primary/40'
                                        }`}
                                    >
                                        {s.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Date */}
                        <div className="mb-6">
                            <label className="mb-2 block text-sm font-medium text-neutral-700">Tanggal</label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => {
 setSelectedDate(e.target.value); setSelectedSlot(null); 
}}
                                min={new Date().toISOString().split('T')[0]}
                                className="block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>

                        {/* Time Slots */}
                        {selectedDate && selectedService && (
                            <div>
                                <label className="mb-2 block text-sm font-medium text-neutral-700">Waktu</label>
                                {slots.length === 0 ? (
                                    <p className="text-sm text-neutral-400">Tidak ada slot tersedia untuk tanggal ini.</p>
                                ) : (
                                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                                        {slots.map((slot) => (
                                            <button
                                                key={slot.start_time}
                                                type="button"
                                                onClick={() => setSelectedSlot(slot.start_time)}
                                                className={`rounded-lg border px-3 py-2 text-center text-sm transition-all ${
                                                    selectedSlot === slot.start_time
                                                        ? 'border-primary bg-primary-50 font-medium text-primary'
                                                        : 'border-border bg-white text-neutral-600 hover:border-primary/40'
                                                }`}
                                            >
                                                <div>{formatTime(slot.start_time)}</div>
                                                {!selectedStaff && slot.staff.length > 0 && (
                                                    <div className="mt-0.5 text-[10px] text-neutral-400">{slot.staff[0].name}</div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Step 3: Customer Data */}
                {step === (multiBranch ? 3 : 2) && (
                    <div>
                        <h2 className="mb-6 text-xl font-bold text-neutral-900">Data Diri</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-neutral-700">Nama <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Nama lengkap"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-neutral-700">Email <span className="text-danger">*</span></label>
                                <input
                                    type="email"
                                    value={customerEmail}
                                    onChange={(e) => setCustomerEmail(e.target.value)}
                                    className="block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="email@example.com"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-neutral-700">No. Telepon <span className="text-danger">*</span></label>
                                <input
                                    type="tel"
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                    className="block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="08123456789"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-neutral-700">Catatan (opsional)</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                    className="block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Catatan tambahan..."
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Confirmation */}
                {step === (multiBranch ? 4 : 3) && selectedService && selectedSlot && (
                    <div>
                        <h2 className="mb-6 text-xl font-bold text-neutral-900">Konfirmasi Booking</h2>
                        <div className="rounded-xl border border-border bg-white p-6">
                            <table className="w-full text-sm">
                                <tbody>
                                    <tr>
                                        <td className="py-2 pr-4 text-neutral-500">Layanan</td>
                                        <td className="py-2 font-medium text-neutral-900">{selectedService.name}</td>
                                    </tr>
                                    {selectedStaff && (
                                        <tr>
                                            <td className="py-2 pr-4 text-neutral-500">Staff</td>
                                            <td className="py-2 font-medium text-neutral-900">{selectedStaff.name}</td>
                                        </tr>
                                    )}
                                    <tr>
                                        <td className="py-2 pr-4 text-neutral-500">Tanggal</td>
                                        <td className="py-2 font-medium text-neutral-900">{formatDate(selectedSlot)}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 pr-4 text-neutral-500">Waktu</td>
                                        <td className="py-2 font-medium text-neutral-900">
                                            {formatTime(selectedSlot)} - {formatTime(new Date(new Date(selectedSlot).getTime() + (selectedService.duration * 60_000)).toISOString())}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 pr-4 text-neutral-500">Durasi</td>
                                        <td className="py-2 font-medium text-neutral-900">{selectedService.duration} menit</td>
                                    </tr>
                                    {settings.show_prices && (
                                        <tr>
                                            <td className="py-2 pr-4 text-neutral-500">Harga</td>
                                            <td className="py-2 font-bold text-primary">Rp {selectedService.price.toLocaleString('id-ID')}</td>
                                        </tr>
                                    )}
                                    <tr>
                                        <td className="py-2 pr-4 text-neutral-500">Nama</td>
                                        <td className="py-2 font-medium text-neutral-900">{customerName}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 pr-4 text-neutral-500">Email</td>
                                        <td className="py-2 font-medium text-neutral-900">{customerEmail}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 pr-4 text-neutral-500">Telepon</td>
                                        <td className="py-2 font-medium text-neutral-900">{customerPhone}</td>
                                    </tr>
                                    {notes && (
                                        <tr>
                                            <td className="py-2 pr-4 text-neutral-500">Catatan</td>
                                            <td className="py-2 font-medium text-neutral-900">{notes}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={createMutation.isPending}
                            className="mt-6 w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {createMutation.isPending ? 'Memproses...' : 'Booking Sekarang'}
                        </button>
                    </div>
                )}

                {/* Navigation Buttons */}
                {step > 0 && step < (multiBranch ? 4 : 3) && (
                    <div className="mt-8 flex justify-between">
                        <button
                            type="button"
                            onClick={prevStep}
                            className="rounded-lg border border-border bg-white px-6 py-2.5 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50"
                        >
                            Kembali
                        </button>
                        <button
                            type="button"
                            onClick={nextStep}
                            disabled={!canProceed()}
                            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Lanjut
                        </button>
                    </div>
                )}

                {step === 0 && multiBranch && (
                    <div className="mt-8 flex justify-end">
                        <button
                            type="button"
                            onClick={nextStep}
                            disabled={!canProceed()}
                            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Lanjut
                        </button>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
