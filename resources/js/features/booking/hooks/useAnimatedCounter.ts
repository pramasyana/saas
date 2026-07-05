import { useState, useEffect, useRef } from 'react';

interface UseAnimatedCounterOptions {
    end: number;
    duration?: number;
    enabled?: boolean;
}

export function useAnimatedCounter({ end, duration = 2000, enabled = true }: UseAnimatedCounterOptions) {
    const [display, setDisplay] = useState(0);
    const startTime = useRef<number | null>(null);
    const rafId = useRef<number | null>(null);

    useEffect(() => {
        if (!enabled) {
            setDisplay(end);

            return;
        }

        startTime.current = null;
        const animate = (timestamp: number) => {
            if (startTime.current === null) {
startTime.current = timestamp;
}

            const elapsed = timestamp - startTime.current;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * end));

            if (progress < 1) {
                rafId.current = requestAnimationFrame(animate);
            }
        };

        rafId.current = requestAnimationFrame(animate);

        return () => {
            if (rafId.current) {
cancelAnimationFrame(rafId.current);
}
        };
    }, [end, duration, enabled]);

    return display;
}