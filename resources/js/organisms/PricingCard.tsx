import Badge from '@/atoms/Badge';
import Button from '@/atoms/Button';
import type { PricingPlan } from '@/types/landing';

interface PricingCardProps {
    plan: PricingPlan;
    yearly?: boolean;
}

export default function PricingCard({ plan, yearly = false }: PricingCardProps) {
    const price = yearly ? plan.price.yearly : plan.price.monthly;
    const period = yearly ? '/year' : '/month';

    return (
        <div
            className={`relative flex flex-col rounded-xl border p-7 transition-all duration-200 ${
                plan.popular
                    ? 'border-primary bg-white shadow-lg shadow-primary/10 ring-1 ring-primary'
                    : 'border-border bg-white shadow-sm hover:shadow-md'
            }`}
        >
            {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="new">Most popular</Badge>
                </div>
            )}
            <div>
                <h3 className="text-base font-semibold text-neutral-900">
                    {plan.name}
                </h3>
                <p className="mt-1 text-sm text-neutral-500">
                    {plan.description}
                </p>
                <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-neutral-900">
                        ${price}
                    </span>
                    <span className="text-sm text-neutral-400">{period}</span>
                </div>
            </div>
            <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                        <svg
                            className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        <span className="text-neutral-600">{feature}</span>
                    </li>
                ))}
            </ul>
            <div className="mt-7">
                <Button
                    variant={plan.popular ? 'primary' : 'secondary'}
                    className="w-full"
                >
                    Start Free Trial
                </Button>
            </div>
        </div>
    );
}
