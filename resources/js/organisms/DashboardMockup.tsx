export default function DashboardMockup() {
    return (
        <div className="relative mx-auto w-full max-w-[600px]">
            <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-2xl shadow-primary/5">
                <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                        <img
                            src="/images/logo-nusentra-n-pw.png"
                            alt="Nusentra"
                            className="h-6 w-6 object-contain"
                        />
                        <span className="text-sm font-semibold text-neutral-900">
                            Nusentra
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <div className="h-2 w-2 rounded-full bg-success" />
                            <div className="absolute inset-0 h-2 w-2 animate-ping rounded-full bg-success/40" />
                        </div>
                        <span className="text-xs text-neutral-400">Online</span>
                        <div className="ml-2 h-6 w-6 rounded-full bg-gradient-to-br from-primary/80 to-primary shadow-sm" />
                    </div>
                </div>

                <div className="p-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-neutral-900">
                            Your Appointments
                        </h2>
                        <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                            Today
                        </span>
                    </div>

                    <div className="mt-4 grid grid-cols-7 gap-1">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                            <div
                                key={`dow-${i}`}
                                className="text-center text-[11px] font-medium text-neutral-300"
                            >
                                {d}
                            </div>
                        ))}
                        {Array.from({ length: 5 }, (_, i) => (
                            <div key={`empty-${i}`} />
                        ))}
                        {Array.from({ length: 30 }, (_, i) => {
                            const day = i + 1;
                            const isToday = day === 15;
                            const hasBooking = [3, 7, 12, 15, 18, 22, 27].includes(day);

                            return (
                                <div
                                    key={day}
                                    className={`flex h-8 items-center justify-center rounded-lg text-xs transition-colors ${
                                        isToday
                                            ? 'bg-gradient-to-br from-primary to-primary-light font-semibold text-white shadow-sm'
                                            : hasBooking
                                              ? 'bg-primary/10 font-medium text-primary'
                                              : 'text-neutral-500 hover:bg-neutral-100'
                                    }`}
                                >
                                    {day}
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-5 space-y-2.5">
                        <div className="flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary-light/20 text-xs font-semibold text-primary">
                                    SJ
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-neutral-900">
                                        Sarah Johnson
                                    </p>
                                    <p className="text-xs text-neutral-400">
                                        Hair Styling &middot; 09:00 AM
                                    </p>
                                </div>
                            </div>
                            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
                                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                                Confirmed
                            </span>
                        </div>
                        <div className="flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-warning/20 to-warning-light/20 text-xs font-semibold text-warning">
                                    MC
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-neutral-900">
                                        Mike Chen
                                    </p>
                                    <p className="text-xs text-neutral-400">
                                        Facial Treatment &middot; 10:30 AM
                                    </p>
                                </div>
                            </div>
                            <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-[11px] font-medium text-warning">
                                <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                                In Progress
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
