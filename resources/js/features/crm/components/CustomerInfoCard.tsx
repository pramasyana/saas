import Badge from '@/atoms/Badge';
import FadeIn from '@/atoms/FadeIn';
import type { Customer } from '@/features/crm/types';

interface CustomerInfoCardProps {
    customer: Customer;
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

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

export default function CustomerInfoCard({ customer }: CustomerInfoCardProps) {
    return (
        <FadeIn>
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                <div className="bg-gradient-to-r from-primary to-primary-dark px-6 py-8 sm:px-8">
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                        <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-2xl font-bold shadow-lg ring-4 ring-white/30 ${getAvatarColor(customer.name)}`}>
                            {getInitials(customer.name)}
                        </div>
                        <div className="text-center sm:text-left">
                            <h2 className="text-xl font-bold text-white">{customer.name}</h2>
                            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                                {customer.email && (
                                    <span className="inline-flex items-center gap-1.5 text-sm text-white/80">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                        </svg>
                                        {customer.email}
                                    </span>
                                )}
                                {customer.phone && (
                                    <span className="inline-flex items-center gap-1.5 text-sm text-white/80">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                        </svg>
                                        {customer.phone}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">Perusahaan</p>
                            <p className="mt-1 text-sm font-medium text-neutral-900">{customer.company || '-'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">Alamat</p>
                            <p className="mt-1 text-sm text-neutral-700">{customer.address || '-'}</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">Member Sejak</p>
                            <p className="mt-1 text-sm font-medium text-neutral-900">
                                {customer.membership?.joined_at
                                    ? new Date(customer.membership.joined_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
                                    : '-'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">Membership & Points</p>
                            <div className="mt-1 flex items-center gap-2">
                                {customer.membership?.tier ? (
                                    <Badge variant="default">{customer.membership.tier.name}</Badge>
                                ) : (
                                    <span className="text-sm text-neutral-500">Tidak ada</span>
                                )}
                                {customer.membership && (
                                    <span className="text-sm font-medium text-neutral-700">{customer.membership.points} pts</span>
                                )}
                            </div>
                        </div>
                    </div>
                    {customer.tags && customer.tags.length > 0 && (
                        <div className="sm:col-span-2">
                            <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">Tags</p>
                            <div className="mt-1 flex flex-wrap gap-1.5">
                                {customer.tags.map((tag) => (
                                    <span
                                        key={tag.id}
                                        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                                        style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                                    >
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </FadeIn>
    );
}
