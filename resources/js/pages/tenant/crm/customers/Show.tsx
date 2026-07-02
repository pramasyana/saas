import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import FadeIn from '@/atoms/FadeIn';
import CustomerInfoCard from '@/features/crm/components/CustomerInfoCard';
import LoyaltyCard from '@/features/crm/components/LoyaltyCard';
import MembershipCard from '@/features/crm/components/MembershipCard';
import NoteList from '@/features/crm/components/NoteList';
import ReferralList from '@/features/crm/components/ReferralList';
import ReviewList from '@/features/crm/components/ReviewList';
import TagList from '@/features/crm/components/TagList';
import TimelineList from '@/features/crm/components/TimelineList';
import { useCustomer } from '@/features/crm/hooks/useCustomers';
import type { Customer } from '@/features/crm/types';
import TenantLayout from '@/layouts/TenantLayout';
import { cn } from '@/lib/utils';

interface ShowPageProps {
    title: string;
    customer: Customer;
}

type TabKey = 'informasi' | 'catatan' | 'riwayat' | 'membership' | 'poin' | 'review' | 'referral';

const tabs: { key: TabKey; label: string }[] = [
    { key: 'informasi', label: 'Informasi' },
    { key: 'catatan', label: 'Catatan' },
    { key: 'riwayat', label: 'Riwayat' },
    { key: 'membership', label: 'Membership' },
    { key: 'poin', label: 'Poin' },
    { key: 'review', label: 'Review' },
    { key: 'referral', label: 'Referral' },
];

const avatarColors = [
    'bg-primary text-white',
    'bg-emerald-500 text-white',
    'bg-amber-500 text-white',
    'bg-rose-500 text-white',
    'bg-sky-500 text-white',
    'bg-violet-500 text-white',
];

function getAvatarColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return avatarColors[Math.abs(hash) % avatarColors.length];
}

function getInitials(name: string): string {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function Show({ title, customer }: ShowPageProps) {
    const [activeTab, setActiveTab] = useState<TabKey>('informasi');

    const { data: customerData } = useCustomer(customer.id);
    const currentCustomer = customerData?.data ?? customer;

    return (
        <TenantLayout>
            <Head title={title} />

            <nav className="mb-5 flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/crm/customers" className="transition-colors hover:text-neutral-700">Pelanggan</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="font-medium text-neutral-900">{currentCustomer.name}</span>
            </nav>

            <FadeIn delay={0.03}>
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    <div className="bg-gradient-to-r from-primary via-primary-dark to-primary px-6 py-8 sm:px-8">
                        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                            <div className={cn(
                                'flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-2xl font-bold shadow-lg ring-4 ring-white/30',
                                getAvatarColor(currentCustomer.name),
                            )}>
                                {getInitials(currentCustomer.name)}
                            </div>
                            <div className="text-center sm:text-left">
                                <h2 className="text-xl font-bold text-white">{currentCustomer.name}</h2>
                                <p className="mt-1 text-sm text-white/80">{currentCustomer.email || 'Tidak ada email'}</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-neutral-200 border-t border-neutral-200 sm:grid-cols-4">
                        {[
                            { label: 'ID', value: currentCustomer.id.slice(0, 8) + '...' },
                            { label: 'Status', value: currentCustomer.is_active ? 'Aktif' : 'Nonaktif' },
                            { label: 'Member Since', value: currentCustomer.membership?.joined_at
                                ? new Date(currentCustomer.membership.joined_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })
                                : '-' },
                            { label: 'Tags', value: `${currentCustomer.tags_count ?? 0} tags` },
                        ].map((item) => (
                            <div key={item.label} className="px-5 py-4">
                                <p className="text-xs font-medium text-neutral-400">{item.label}</p>
                                <p className={cn(
                                    'mt-1 text-sm font-semibold',
                                    item.label === 'Status' && currentCustomer.is_active ? 'text-success' : item.label === 'Status' && !currentCustomer.is_active ? 'text-danger' : 'text-neutral-900',
                                )}>
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </FadeIn>

            <div className="mt-6 border-b border-neutral-200">
                <div className="flex gap-0 -mb-px overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={cn(
                                'whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors border-b-2',
                                activeTab === tab.key
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-neutral-500 hover:text-neutral-700',
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-6">
                {activeTab === 'informasi' && (
                    <div className="space-y-6">
                        <CustomerInfoCard customer={currentCustomer} />
                        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                            <p className="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-3">Tags</p>
                            <TagList
                                tags={currentCustomer.tags ?? []}
                                onAddTag={() => {}}
                                onRemoveTag={() => {}}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'catatan' && (
                    <NoteList customerId={currentCustomer.id} />
                )}

                {activeTab === 'riwayat' && (
                    <TimelineList customerId={currentCustomer.id} />
                )}

                {activeTab === 'membership' && (
                    <MembershipCard customerId={currentCustomer.id} />
                )}

                {activeTab === 'poin' && (
                    <LoyaltyCard customerId={currentCustomer.id} />
                )}

                {activeTab === 'review' && (
                    <ReviewList customerId={currentCustomer.id} />
                )}

                {activeTab === 'referral' && (
                    <ReferralList customerId={currentCustomer.id} />
                )}
            </div>
        </TenantLayout>
    );
}
