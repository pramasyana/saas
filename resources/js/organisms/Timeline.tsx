import FadeIn from '@/atoms/FadeIn';
import type { TimelineStep } from '@/types/landing';

interface TimelineProps {
    steps: TimelineStep[];
}

export default function Timeline({ steps }: TimelineProps) {
    return (
        <div className="grid gap-8 md:grid-cols-5 md:gap-4">
            {steps.map((step, i) => (
                <FadeIn key={step.step} delay={i * 0.1}>
                    <div className="relative flex flex-col items-center text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary ring-1 ring-inset ring-primary/10">
                            <span className="text-lg">{step.icon}</span>
                        </div>
                        <div className="mt-4">
                            <div className="flex items-center justify-center gap-2">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                                    {step.step}
                                </span>
                                <h3 className="text-sm font-semibold text-neutral-900">
                                    {step.title}
                                </h3>
                            </div>
                            <p className="mt-2 text-xs leading-relaxed text-neutral-500">
                                {step.explanation}
                            </p>
                        </div>
                        {i < steps.length - 1 && (
                            <div className="mt-4 hidden h-px w-full bg-neutral-200 md:block" />
                        )}
                    </div>
                </FadeIn>
            ))}
        </div>
    );
}
