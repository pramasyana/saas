import { useState } from 'react';
import Badge from '@/atoms/Badge';
import Button from '@/atoms/Button';
import FadeIn from '@/atoms/FadeIn';
import Select from '@/atoms/Select';
import { useCustomerMembership, useUpdateMembership } from '@/features/crm/hooks/useCustomerMembership';
import { useMembershipTiers } from '@/features/crm/hooks/useMembershipTiers';
import { useToastStore } from '@/stores/toast';

interface MembershipCardProps {
    customerId: string;
}

export default function MembershipCard({ customerId }: MembershipCardProps) {
    const [editing, setEditing] = useState(false);
    const [selectedTierId, setSelectedTierId] = useState('');

    const { data: membershipData, isLoading, error } = useCustomerMembership(customerId);
    const { data: tiersData } = useMembershipTiers({ per_page: 100 });
    const updateMembership = useUpdateMembership();
    const addToast = useToastStore((s) => s.addToast);

    const membership = membershipData?.data;
    const tiers = (tiersData?.data ?? []).filter((t) => t.is_active).map((t) => ({
        value: t.id,
        label: `${t.name} (${t.min_points} pts, ${t.min_total_spent})`,
    }));

    function handleSave() {
        if (!selectedTierId) {
return;
}

        updateMembership.mutate(
            { customerId, data: { membership_tier_id: selectedTierId } },
            {
                onSuccess: () => {
                    setEditing(false);
                    addToast('success', 'Membership berhasil diperbarui');
                },
            },
        );
    }

    if (error) {
        return (
            <div className="flex items-center gap-3 rounded-2xl border border-danger/20 bg-danger-light px-5 py-4 text-sm text-danger">
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                Gagal memuat data membership
            </div>
        );
    }

    return (
        <FadeIn>
            <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary">
                            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-neutral-900">Membership</h3>
                            <p className="text-xs text-neutral-500">Tier dan poin pelanggan</p>
                        </div>
                    </div>
                    {!editing && (
                        <Button type="button" variant="outline" size="sm" onClick={() => {
 setSelectedTierId(membership?.tier?.id ?? ''); setEditing(true); 
}}>
                            Edit
                        </Button>
                    )}
                </div>

                {isLoading ? (
                    <div className="animate-pulse space-y-4 p-6">
                        <div className="h-6 w-1/3 rounded bg-neutral-200" />
                        <div className="h-4 w-1/2 rounded bg-neutral-100" />
                        <div className="h-2 w-full rounded bg-neutral-200" />
                    </div>
                ) : membership ? (
                    <div className="p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-neutral-500">Tier Saat Ini</p>
                                {membership.tier ? (
                                    <Badge variant="default" className="mt-1">{membership.tier.name}</Badge>
                                ) : (
                                    <p className="mt-1 text-sm text-neutral-400">Tidak ada tier</p>
                                )}
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-neutral-500">Total Belanja</p>
                                <p className="text-lg font-semibold text-neutral-900">
                                    Rp {membership.total_spent.toLocaleString('id-ID')}
                                </p>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-neutral-500">Poin</p>
                                <p className="text-sm font-semibold text-neutral-900">{membership.points} pts</p>
                            </div>
                            {membership.tier && (
                                <div className="h-2 overflow-hidden rounded-full bg-neutral-200">
                                    <div
                                        className="h-full rounded-full bg-primary transition-all duration-500"
                                        style={{
                                            width: `${Math.min(100, (membership.points / membership.tier.min_points) * 100)}%`,
                                        }}
                                    />
                                </div>
                            )}
                            {membership.tier && (
                                <p className="mt-1 text-xs text-neutral-400">
                                    {membership.points.toLocaleString()} / {membership.tier.min_points.toLocaleString()} pts menuju tier selanjutnya
                                </p>
                            )}
                        </div>

                        {editing && (
                            <div className="space-y-3 border-t border-neutral-200 pt-4">
                                <Select
                                    value={selectedTierId}
                                    onChange={setSelectedTierId}
                                    options={tiers}
                                    placeholder="Pilih tier..."
                                />
                                <div className="flex justify-end gap-2">
                                    <Button type="button" variant="secondary" size="sm" onClick={() => setEditing(false)}>
                                        Batal
                                    </Button>
                                    <Button type="button" size="sm" onClick={handleSave} disabled={!selectedTierId || updateMembership.isPending}>
                                        {updateMembership.isPending ? 'Menyimpan...' : 'Simpan'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-3 py-10">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
                            <svg className="h-6 w-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                            </svg>
                        </div>
                        <p className="text-sm text-neutral-500">Belum memiliki membership</p>
                        {!editing && (
                            <Button type="button" variant="outline" size="sm" onClick={() => setEditing(true)}>
                                Tambah Membership
                            </Button>
                        )}
                        {editing && (
                            <div className="w-full max-w-xs space-y-3">
                                <Select
                                    value={selectedTierId}
                                    onChange={setSelectedTierId}
                                    options={tiers}
                                    placeholder="Pilih tier..."
                                />
                                <div className="flex justify-end gap-2">
                                    <Button type="button" variant="secondary" size="sm" onClick={() => setEditing(false)}>
                                        Batal
                                    </Button>
                                    <Button type="button" size="sm" onClick={handleSave} disabled={!selectedTierId || updateMembership.isPending}>
                                        {updateMembership.isPending ? 'Menyimpan...' : 'Simpan'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </FadeIn>
    );
}
