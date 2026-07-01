import { Head } from '@inertiajs/react';
import Badge from '@/atoms/Badge';
import TenantLayout from '@/layouts/TenantLayout';

interface SubscriptionInfo {
    plan_name: string;
    plan_slug: string;
    status: string;
    price_amount: number;
    billing_interval: string;
    starts_at: string;
    ends_at: string;
    features: Array<{
        key: string;
        label: string;
        type: string;
        value: string;
    }>;
}

interface UserInfo {
    name: string;
    email: string;
    joined_at: string;
}

interface DashboardProps {
    user: UserInfo;
    subscription: SubscriptionInfo | null;
}

function DashboardCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-400">{title}</h3>
            {children}
        </div>
    );
}

export default function TenantDashboard({ user, subscription }: DashboardProps) {
    return (
        <TenantLayout>
            <Head title="Dashboard" />

            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                    Selamat Datang, {user.name}!
                    <span className="ml-2 text-lg font-normal text-neutral-400">&#128075;</span>
                </h1>
                <p className="mt-1 text-sm text-neutral-500">
                    Ini adalah dashboard akun BookCRM Anda.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <DashboardCard title="Akun">
                    <div className="space-y-3">
                        <div>
                            <p className="text-xs text-neutral-400">Nama</p>
                            <p className="text-sm font-medium text-neutral-900">{user.name}</p>
                        </div>
                        <div>
                            <p className="text-xs text-neutral-400">Email</p>
                            <p className="text-sm font-medium text-neutral-900">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-xs text-neutral-400">Bergabung</p>
                            <p className="text-sm font-medium text-neutral-900">
                                {new Date(user.joined_at).toLocaleDateString('id-ID', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>
                    </div>
                </DashboardCard>

                <DashboardCard title="Langganan">
                    {subscription ? (
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-neutral-400">Paket</p>
                                <p className="text-sm font-semibold text-neutral-900">{subscription.plan_name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-neutral-400">Status</p>
                                <Badge
                                    variant={subscription.status === 'active' ? 'success' : 'warning'}
                                >
                                    {subscription.status === 'active' ? 'Aktif' : subscription.status}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-xs text-neutral-400">Tagihan</p>
                                <p className="text-sm font-medium text-neutral-900">
                                    Rp{subscription.price_amount.toLocaleString('id-ID')}/{subscription.billing_interval === 'monthly' ? 'bulan' : 'tahun'}
                                </p>
                            </div>
                            {subscription.ends_at && (
                                <div>
                                    <p className="text-xs text-neutral-400">Berakhir</p>
                                    <p className="text-sm font-medium text-neutral-900">
                                        {new Date(subscription.ends_at).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-neutral-400">Tidak ada langganan aktif.</p>
                    )}
                </DashboardCard>

                <DashboardCard title="Fitur">
                    {subscription?.features && subscription.features.length > 0 ? (
                        <div className="space-y-2">
                            {subscription.features.map((feature) => (
                                <div key={feature.key} className="flex items-center justify-between">
                                    <span className="text-sm text-neutral-600">{feature.label}</span>
                                    {feature.type === 'boolean' ? (
                                        <span className={feature.value === 'true' ? 'text-success' : 'text-neutral-300'}>
                                            {feature.value === 'true' ? (
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                            ) : (
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            )}
                                        </span>
                                    ) : (
                                        <span className="text-sm font-medium text-neutral-900">{feature.value}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-neutral-400">Tidak ada informasi fitur.</p>
                    )}
                </DashboardCard>
            </div>
        </TenantLayout>
    );
}
