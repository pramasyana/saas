import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import AdminLayout from '@/layouts/AdminLayout';
import { cn, formatPrice } from '@/lib/utils';
import TenantSubNav from '@/molecules/TenantSubNav';
import { useToastStore } from '@/stores/toast';

interface TenantData {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    domains: string[];
    users_count: number;
    subscriptions_count: number;
    created_at: string;
    user: { id: number; name: string; email: string } | null;
}

interface SubscriptionData {
    id: string;
    plan_name: string;
    plan_slug: string;
    price_amount: number;
    billing_interval: 'monthly' | 'yearly';
    status: string;
    starts_at: string | null;
    ends_at: string | null;
}

interface Props {
    title: string;
    tenant: TenantData;
    subscription: SubscriptionData | null;
}

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

function getInitials(name: string | null): string {
    if (!name) {
return '?';
}

    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function ShowTenant({ title, tenant, subscription }: Props) {
    const addToast = useToastStore((s) => s.addToast);
    const { errors } = usePage().props as { errors?: Record<string, string> };
    const [impersonateOpen, setImpersonateOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    function handleImpersonate(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        router.post(
            `/admin/tenants/${tenant.id}/impersonate`,
            { password },
            {
                onSuccess: () => addToast('success', 'Masuk sebagai tenant...'),
                onError: () => setLoading(false),
                onFinish: () => setLoading(false),
            },
        );
    }

    return (
        <AdminLayout>
            <Head title={title} />

            <nav className="mb-6 flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/admin/dashboard" className="transition-colors hover:text-neutral-700">Dashboard</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <Link href="/admin/tenants" className="transition-colors hover:text-neutral-700">Tenants</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="font-medium text-neutral-900">{tenant.name || 'Detail Tenant'}</span>
            </nav>

            <TenantSubNav tenantId={tenant.id} tenantName={tenant.name} tenantEmail={tenant.email} />

            <div className="mt-6 mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-neutral-900">Ringkasan Tenant</h1>
                    <p className="mt-1 text-sm text-neutral-500">Informasi umum dan status tenant.</p>
                </div>
                <Link
                    href={`/admin/tenants/${tenant.id}/edit`}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                    Edit Tenant
                </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <FadeIn delay={0.03}>
                        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    'flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-lg font-bold shadow-sm',
                                    getAvatarColor(tenant.name ?? ''),
                                )}>
                                    {getInitials(tenant.name)}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-lg font-bold text-neutral-900">{tenant.name || 'Tanpa Nama'}</p>
                                    <p className="mt-0.5 text-sm text-neutral-500">{tenant.email || 'Email tidak tersedia'}</p>
                                    <div className="mt-1.5 flex flex-wrap gap-2">
                                        {tenant.domains?.map((d) => (
                                            <span key={d} className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
                                                {d}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 grid gap-4 border-t border-neutral-100 pt-5 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Pemilik</p>
                                    <p className="mt-1 text-sm text-neutral-900">{tenant.user?.name || '-'}</p>
                                    {tenant.user?.email && (
                                        <p className="text-xs text-neutral-500">{tenant.user.email}</p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Telepon</p>
                                    <p className="mt-1 text-sm text-neutral-900">{tenant.phone || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Bergabung</p>
                                    <p className="mt-1 text-sm text-neutral-900">{tenant.created_at || '-'}</p>
                                </div>
                            </div>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.06}>
                        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
                            <h2 className="text-base font-bold text-neutral-900">Subscription</h2>
                            {subscription ? (
                                <div className="mt-4 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-neutral-900">{subscription.plan_name}</p>
                                            <p className="text-xs text-neutral-500 capitalize">{subscription.billing_interval}</p>
                                        </div>
                                        <span className={cn(
                                            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize',
                                            subscription.status === 'active'
                                                ? 'bg-success-light text-success'
                                                : 'bg-neutral-100 text-neutral-600',
                                        )}>
                                            {subscription.status === 'active' ? 'Aktif' : subscription.status}
                                        </span>
                                    </div>
                                    <div className="grid gap-3 sm:grid-cols-3">
                                        <div className="rounded-lg bg-neutral-50 px-4 py-3">
                                            <p className="text-xs text-neutral-400">Harga</p>
                                            <p className="text-sm font-semibold text-neutral-900">{formatPrice(subscription.price_amount)}</p>
                                        </div>
                                        <div className="rounded-lg bg-neutral-50 px-4 py-3">
                                            <p className="text-xs text-neutral-400">Mulai</p>
                                            <p className="text-sm font-semibold text-neutral-900">{subscription.starts_at || '-'}</p>
                                        </div>
                                        <div className="rounded-lg bg-neutral-50 px-4 py-3">
                                            <p className="text-xs text-neutral-400">Berakhir</p>
                                            <p className="text-sm font-semibold text-neutral-900">{subscription.ends_at || '-'}</p>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/admin/tenants/${tenant.id}/subscription`}
                                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary-dark"
                                    >
                                        Kelola Langganan
                                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </Link>
                                </div>
                            ) : (
                                <div className="mt-4 flex items-center gap-3 rounded-lg bg-neutral-50 px-4 py-3">
                                    <svg className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                    </svg>
                                    <p className="text-sm text-neutral-500">Belum ada langganan aktif.</p>
                                </div>
                            )}
                        </div>
                    </FadeIn>
                </div>

                <div className="space-y-6">
                    <FadeIn delay={0.05}>
                        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-base font-bold text-neutral-900">Statistik</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between rounded-lg bg-neutral-50 px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary">
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs text-neutral-400">Pengguna</p>
                                            <p className="text-lg font-bold text-neutral-900">{tenant.users_count}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-neutral-50 px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success-light text-success">
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs text-neutral-400">Langganan</p>
                                            <p className="text-lg font-bold text-neutral-900">{tenant.subscriptions_count}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.08}>
                        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-base font-bold text-neutral-900">Aksi Cepat</h2>
                            <div className="space-y-2">
                                <Link
                                    href={`/admin/tenants/${tenant.id}/subscription`}
                                    className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                                >
                                    <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                                    </svg>
                                    Atur Langganan
                                </Link>
                                <Link
                                    href={`/admin/tenants/${tenant.id}/company/profile`}
                                    className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                                >
                                    <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                                    </svg>
                                    Profil Perusahaan
                                </Link>
                                <Link
                                    href={`/admin/tenants/${tenant.id}/company/branding`}
                                    className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                                >
                                    <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                                    </svg>
                                    Branding
                                </Link>
                                <button
                                    onClick={() => setImpersonateOpen(true)}
                                    className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-amber-50"
                                >
                                    <svg className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                    </svg>
                                    Login sebagai Tenant
                                </button>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>

            {impersonateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setImpersonateOpen(false)}>
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="mb-5">
                            <h2 className="text-lg font-bold text-neutral-900">Konfirmasi Password</h2>
                            <p className="mt-1 text-sm text-neutral-500">
                                Masukkan password admin untuk login sebagai <strong>{tenant.name || 'tenant ini'}</strong>.
                            </p>
                        </div>
                        <form onSubmit={handleImpersonate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700">Password Admin</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Masukkan password Anda"
                                    autoFocus
                                    className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                                {errors?.password && (
                                    <p className="mt-1.5 text-xs text-danger">{errors.password}</p>
                                )}
                            </div>
                            <div className="flex justify-end gap-3">
                                <Button variant="ghost" size="sm" type="button" onClick={() => setImpersonateOpen(false)}>
                                    Batal
                                </Button>
                                <Button variant="primary" size="sm" type="submit" disabled={loading || !password}>
                                    {loading ? 'Memproses...' : 'Login'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
