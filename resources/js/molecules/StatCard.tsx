import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
    label: string;
    value: string;
    children?: ReactNode;
    className?: string;
}

export default function StatCard({
    label,
    value,
    children,
    className,
}: StatCardProps) {
    return (
        <div className={cn('text-center', className)}>
            <div className="text-5xl font-bold tracking-tight text-neutral-900 sm:text-6xl">
                {value}
            </div>
            <p className="mt-3 text-base text-neutral-500">{label}</p>
            {children}
        </div>
    );
}
