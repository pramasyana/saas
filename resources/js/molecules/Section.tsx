import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
    children: ReactNode;
    id?: string;
    className?: string;
    heading?: string;
    subheading?: string;
    containerClass?: string;
}

export default function Section({
    children,
    id,
    className,
    heading,
    subheading,
    containerClass,
}: SectionProps) {
    return (
        <section id={id} className={cn('py-16 md:py-24', className)}>
            <div className={cn('mx-auto max-w-7xl px-6 lg:px-8', containerClass)}>
                {(heading || subheading) && (
                    <div className="mx-auto mb-14 max-w-2xl text-center">
                        {heading && (
                            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                                {heading}
                            </h2>
                        )}
                        {subheading && (
                            <p className="mt-4 text-lg leading-relaxed text-neutral-500">
                                {subheading}
                            </p>
                        )}
                    </div>
                )}
                {children}
            </div>
        </section>
    );
}
