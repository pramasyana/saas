import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FadeInProps {
    children: ReactNode;
    delay?: number;
    className?: string;
}

export default function FadeIn({
    children,
    delay = 0,
    className,
}: FadeInProps) {
    return (
        <div
            className={cn(
                'animate-[fade-up_0.6s_ease-out_forwards] opacity-0',
                className,
            )}
            style={{
                animationDelay: `${delay}s`,
                animationFillMode: 'forwards',
            }}
        >
            {children}
        </div>
    );
}
