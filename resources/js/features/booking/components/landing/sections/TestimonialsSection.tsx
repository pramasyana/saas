import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LandingConfig } from '@/features/booking/hooks/useLandingSettings';

interface Props {
    data: NonNullable<LandingConfig['testimonials']>;
    colors: NonNullable<LandingConfig['colors']>;
}

export default function TestimonialsSection({ data, colors }: Props) {
    const items = data.items;
    const n = items?.length ?? 0;
    const totalPairs = Math.ceil(n / 2);

    const [pairIdx, setPairIdx] = useState(0);
    const [itemIdx, setItemIdx] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const dragState = useRef({ isDragging: false, startX: 0 });

    // ── helpers ──
    const nextPair = useCallback(() => setPairIdx((p) => (p + 1) % totalPairs), [totalPairs]);
    const nextItem = useCallback(() => setItemIdx((i) => (i + 1) % n), [n]);
    const goItem = useCallback((i: number) => setItemIdx(i), []);

    // Auto-play advances both
    useEffect(() => {
        if (n <= 1) return;
        intervalRef.current = setInterval(() => {
            nextPair();
            nextItem();
        }, 4000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [nextPair, nextItem, n]);

    const resetInterval = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (n > 1) {
            intervalRef.current = setInterval(() => {
                nextPair();
                nextItem();
            }, 4000);
        }
    }, [nextPair, nextItem, n]);

    // ── drag / swipe ──
    const handleDragStart = useCallback((clientX: number) => {
        dragState.current.isDragging = true;
        dragState.current.startX = clientX;
        if (intervalRef.current) clearInterval(intervalRef.current);
    }, []);

    const handleDragEnd = useCallback(() => {
        dragState.current.isDragging = false;
        resetInterval();
    }, [resetInterval]);

    const handleDragMove = useCallback((clientX: number, step: number) => {
        if (!dragState.current.isDragging) return;
        const diff = dragState.current.startX - clientX;
        if (Math.abs(diff) > 60) {
            if (diff > 0) {
                nextPair();
                nextItem();
            } else {
                setPairIdx((p) => (p - 1 + totalPairs) % totalPairs);
                setItemIdx((i) => (i - 1 + n) % n);
            }
            dragState.current.isDragging = false;
        }
    }, [nextPair, nextItem, totalPairs, n]);

    const onMouseDown = (e: React.MouseEvent) => { handleDragStart(e.clientX); e.preventDefault(); };
    const onMouseMove = (e: React.MouseEvent) => handleDragMove(e.clientX, 2);
    const onMouseUp = () => handleDragEnd();
    const onTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX);
    const onTouchMove = (e: React.TouchEvent) => handleDragMove(e.touches[0].clientX, 1);
    const onTouchEnd = () => handleDragEnd();

    if (!items?.length) return null;

    // Desktop: 2 cards from current pair
    const cardA = items[(pairIdx * 2) % n];
    const cardB = items[(pairIdx * 2 + 1) % n];

    function StarRating({ rating }: { rating: number }) {
        return (
            <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className={`h-4 w-4 ${star <= rating ? '' : 'text-neutral-300'}`}
                        style={star <= rating ? { color: '#855000' } : {}}
                        fill="currentColor" viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
    }

    function TestimonialCard({ item }: { item: typeof items[0] }) {
        return (
            <>
                <div className="absolute -top-4 -right-4 text-8xl opacity-[0.04] font-serif leading-none" style={{ color: colors.primary }}>"</div>
                <StarRating rating={item.rating} />
                <p className="text-sm leading-relaxed italic mb-8 relative z-10" style={{ color: colors.text }}>
                    &ldquo;{item.content}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white"
                        style={{ backgroundColor: colors.primary }}
                    >
                        {item.name.charAt(0)}
                    </div>
                    <div>
                        <p className="text-sm font-semibold" style={{ color: colors.text }}>{item.name}</p>
                        {item.role && <p className="text-xs uppercase tracking-widest" style={{ color: colors.text_muted }}>{item.role}</p>}
                    </div>
                </div>
            </>
        );
    }

    return (
        <section id="testimonials" className="py-16 sm:py-20 lg:py-section-gap-desktop select-none" style={{ backgroundColor: '#F2F3FF' }}>
            <div className="mx-auto max-w-7xl px-gutter">
                <div className="grid lg:grid-cols-3 gap-12 items-center">
                    {/* Heading + Nav */}
                    <div className="lg:col-span-1 space-y-6">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl leading-tight" style={{ color: colors.text }}>
                            {data.title || 'Apa Kata Mereka Yang '}
                            <span className="italic" style={{ color: colors.primary }}>Puas</span>
                        </h2>
                        {data.subtitle && (
                            <p className="text-base leading-relaxed sm:text-lg" style={{ color: colors.text_muted }}>
                                {data.subtitle}
                            </p>
                        )}
                        <div className="flex items-center gap-4 pt-4">
                            <button type="button" onClick={() => { setPairIdx((p) => (p - 1 + totalPairs) % totalPairs); setItemIdx((i) => (i - 1 + n) % n); resetInterval(); }}
                                className="w-12 h-12 rounded-full border flex items-center justify-center transition-all hover:text-white"
                                style={{ borderColor: 'rgba(203,195,215,0.5)', color: colors.text, backgroundColor: 'transparent' }}
                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.primary; e.currentTarget.style.borderColor = colors.primary; }}
                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'rgba(203,195,215,0.5)'; }}
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                </svg>
                            </button>
                            <button type="button" onClick={() => { nextPair(); nextItem(); resetInterval(); }}
                                className="w-12 h-12 rounded-full border flex items-center justify-center transition-all hover:text-white"
                                style={{ borderColor: 'rgba(203,195,215,0.5)', color: colors.text, backgroundColor: 'transparent' }}
                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.primary; e.currentTarget.style.borderColor = colors.primary; }}
                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'rgba(203,195,215,0.5)'; }}
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </button>
                            {/* Desktop dots: per pair */}
                            <div className="hidden lg:flex gap-1.5">
                                {Array.from({ length: totalPairs }).map((_, i) => (
                                    <button key={i} type="button"
                                        onClick={() => { setPairIdx(i); setItemIdx(i * 2); resetInterval(); }}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${i === pairIdx ? 'w-5' : 'w-1.5'}`}
                                        style={{ backgroundColor: i === pairIdx ? colors.primary : colors.primary + '40' }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Desktop: 2 cards per pair */}
                    <div className="hidden lg:grid lg:col-span-2 grid-cols-2 gap-6"
                        onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
                    >
                        <AnimatePresence mode="popLayout">
                            {[cardA, cardB].map((item, i) => (
                                <motion.div
                                    key={`${pairIdx}-${i}`}
                                    variants={{
                                        hidden: { opacity: 0, y: 30 },
                                        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
                                    }}
                                    initial="hidden"
                                    animate="visible"
                                    exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                                    className="relative overflow-hidden rounded-lg p-8 transition-all duration-300"
                                    style={{
                                        backgroundColor: 'rgba(255,255,255,0.7)',
                                        backdropFilter: 'blur(12px)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                    }}
                                >
                                    <TestimonialCard item={item} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Mobile */}
                <div className="mt-14 lg:hidden"
                    onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={itemIdx}
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{ duration: 0.4 }}
                            className="relative rounded-lg p-8"
                            draggable={false}
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.7)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255,255,255,0.2)',
                            }}
                        >
                            <TestimonialCard item={items[itemIdx]} />
                        </motion.div>
                    </AnimatePresence>
                    {/* Mobile dots: per item */}
                    <div className="mt-4 flex justify-center gap-2">
                        {items.map((_, i) => (
                            <button key={i} type="button"
                                onClick={() => { goItem(i); setPairIdx(Math.floor(i / 2)); resetInterval(); }}
                                className={`h-2 rounded-full transition-all duration-300 ${i === itemIdx ? 'w-6' : 'w-2'}`}
                                style={{ backgroundColor: i === itemIdx ? colors.primary : colors.primary + '30' }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
