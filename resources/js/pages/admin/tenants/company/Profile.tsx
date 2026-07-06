import { Head, Link, useForm } from '@inertiajs/react';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import AdminLayout from '@/layouts/AdminLayout';
import TenantSubNav from '@/molecules/TenantSubNav';
import { useToastStore } from '@/stores/toast';

interface ProfileData {
    address: string | null;
    city: string | null;
    province: string | null;
    postal_code: string | null;
    country: string | null;
    phone: string | null;
}

interface Props {
    profile: ProfileData | null;
    tenant_id: string;
    tenant_name?: string | null;
    tenant_email?: string | null;
}

export default function CompanyProfile({ profile, tenant_id, tenant_name, tenant_email }: Props) {
    const addToast = useToastStore((s) => s.addToast);

    const { data, setData, put, errors, processing } = useForm({
        address: profile?.address ?? '',
        city: profile?.city ?? '',
        province: profile?.province ?? '',
        postal_code: profile?.postal_code ?? '',
        country: profile?.country ?? '',
        phone: profile?.phone ?? '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/admin/tenants/${tenant_id}/company/profile`, {
            onSuccess: () => addToast('success', 'Profil perusahaan berhasil diperbarui.'),
        });
    }

    function setField(field: keyof ProfileData, value: string) {
        setData(field as any, value);
    }

    function inputClass(field: string) {
        const hasError = errors[field];
        return [
            'block w-full rounded-lg border px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2',
            hasError
                ? 'border-danger ring-danger/20 focus:border-danger focus:ring-danger/30'
                : 'border-neutral-300 ring-neutral-300 focus:border-primary focus:ring-primary/30',
        ].join(' ');
    }

    function renderField(label: string, field: string, children: React.ReactNode) {
        const fieldErrors = errors[field];

        return (
            <div>
                <label className="block text-sm font-medium text-neutral-700">{label}</label>
                <div className="relative mt-1.5">{children}</div>
                {fieldErrors && (
                    <p className="mt-1.5 text-xs text-danger">{fieldErrors[0]}</p>
                )}
            </div>
        );
    }

    const filledCount = [data.address, data.city, data.province, data.postal_code, data.country, data.phone].filter(Boolean).length;
    const pct = Math.round((filledCount / 6) * 100);

    return (
        <AdminLayout>
            <Head title="Profil Perusahaan" />

            <nav className="mb-6 flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/admin/dashboard" className="transition-colors hover:text-neutral-700">Dashboard</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <Link href="/admin/tenants" className="transition-colors hover:text-neutral-700">Tenants</Link>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="font-medium text-neutral-900">Profil Perusahaan</span>
            </nav>

            <TenantSubNav tenantId={tenant_id} tenantName={tenant_name} tenantEmail={tenant_email} />

            <div className="mt-6 mb-6">
                <h1 className="text-xl font-bold tracking-tight text-neutral-900">Profil Perusahaan</h1>
                <p className="mt-1 text-sm text-neutral-500">
                    Atur informasi profil perusahaan agar pelanggan mudah menemukan Anda.
                </p>
            </div>

            <FadeIn delay={0.03}>
                <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm lg:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {errors._general && (
                            <div className="flex items-center gap-2.5 rounded-lg border border-danger/20 bg-danger-light px-4 py-3 text-sm text-danger">
                                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                                <span>{errors._general[0]}</span>
                            </div>
                        )}

                        {renderField('Alamat Lengkap', 'address', (
                            <textarea
                                value={data.address}
                                onChange={(e) => setField('address', e.target.value)}
                                className={inputClass('address') + ' min-h-[100px]'}
                                placeholder="Masukkan alamat lengkap perusahaan"
                                rows={4}
                            />
                        ))}

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700">Kota / Kabupaten</label>
                                <input
                                    type="text"
                                    value={data.city}
                                    onChange={(e) => setField('city', e.target.value)}
                                    className={inputClass('city')}
                                    placeholder="Contoh: Jakarta Selatan"
                                />
                                {errors.city && <p className="mt-1 text-xs text-danger">{errors.city[0]}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700">Provinsi</label>
                                <input
                                    type="text"
                                    value={data.province}
                                    onChange={(e) => setField('province', e.target.value)}
                                    className={inputClass('province')}
                                    placeholder="Contoh: DKI Jakarta"
                                />
                                {errors.province && <p className="mt-1 text-xs text-danger">{errors.province[0]}</p>}
                            </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-3">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700">Kode Pos</label>
                                <input
                                    type="text"
                                    value={data.postal_code}
                                    onChange={(e) => setField('postal_code', e.target.value)}
                                    className={inputClass('postal_code')}
                                    placeholder="12345"
                                />
                                {errors.postal_code && <p className="mt-1 text-xs text-danger">{errors.postal_code[0]}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700">Negara</label>
                                <input
                                    type="text"
                                    value={data.country}
                                    onChange={(e) => setField('country', e.target.value)}
                                    className={inputClass('country')}
                                    placeholder="Indonesia"
                                />
                                {errors.country && <p className="mt-1 text-xs text-danger">{errors.country[0]}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700">No. Telepon</label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setField('phone', e.target.value)}
                                    className={inputClass('phone')}
                                    placeholder="+62 xxx xxxx"
                                />
                                {errors.phone && <p className="mt-1 text-xs text-danger">{errors.phone[0]}</p>}
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-neutral-200 pt-6">
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-32 overflow-hidden rounded-full bg-neutral-200">
                                    <div
                                        className="h-full rounded-full bg-primary transition-all duration-500"
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                                <span className="text-xs text-neutral-400">{pct}% data profil lengkap</span>
                            </div>
                            <Button type="submit" disabled={processing} className="min-w-[140px]">
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </div>
                    </form>
                </div>
            </FadeIn>
        </AdminLayout>
    );
}
