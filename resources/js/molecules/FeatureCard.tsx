import FadeIn from '@/atoms/FadeIn';
import IconBox from '@/atoms/IconBox';
import Card from '@/molecules/Card';

interface FeatureCardProps {
    icon: string;
    title: string;
    description: string;
    delay?: number;
}

export default function FeatureCard({
    icon,
    title,
    description,
    delay = 0,
}: FeatureCardProps) {
    return (
        <FadeIn delay={delay}>
            <Card className="h-full p-7">
                <IconBox size="md">{icon}</IconBox>
                <h3 className="mt-5 text-base font-semibold text-neutral-900">
                    {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                    {description}
                </p>
            </Card>
        </FadeIn>
    );
}
