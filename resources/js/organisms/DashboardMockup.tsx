export default function DashboardMockup() {
    return (
        <div className="relative mx-auto w-full max-w-[720px]">
            <div className="animate-float overflow-hidden rounded-2xl border border-border bg-white shadow-2xl shadow-primary/5 [box-shadow:0_0_0_1px_rgba(0,0,0,0.02),0_20px_60px_-12px_rgba(0,0,0,0.15)]">
                <div className="flex">
                    <Sidebar />
                    <MainPanel />
                </div>
            </div>
            <FloatingCard />
            <FloatingChart />
        </div>
    );
}

function Sidebar() {
    const items = [
        { icon: 'D', label: 'Dashboard', active: true },
        { icon: 'B', label: 'Appointments', active: false, count: 12 },
        { icon: 'U', label: 'Customers', active: false },
        { icon: 'A', label: 'Analytics', active: false },
        { icon: 'S', label: 'Settings', active: false },
    ];

    return (
        <div className="hidden w-56 shrink-0 bg-neutral-950 p-4 md:block">
            <div className="flex items-center gap-2.5 px-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white">
                    B
                </div>
                <span className="text-sm font-semibold text-white">
                    BookCRM
                </span>
            </div>
            <nav className="mt-6 space-y-0.5">
                {items.map((item) => (
                    <a
                        key={item.label}
                        href="#"
                        className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                            item.active
                                ? 'bg-white/10 text-white'
                                : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200'
                        }`}
                    >
                        <span className="flex items-center gap-3">
                            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/5 text-[11px] font-semibold text-neutral-400">
                                {item.icon}
                            </span>
                            {item.label}
                        </span>
                        {item.count && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/20 px-1.5 text-[11px] font-medium text-primary-light">
                                {item.count}
                            </span>
                        )}
                    </a>
                ))}
            </nav>
            <div className="mx-2 mt-8 rounded-xl bg-white/5 p-4">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary-light" />
                    <div>
                        <p className="text-xs font-medium text-white">
                            Ryan P.
                        </p>
                        <p className="text-[11px] text-neutral-500">
                            Premium Plan
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MainPanel() {
    return (
        <div className="min-w-0 flex-1 bg-neutral-50">
            <TopBar />
            <div className="p-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-neutral-900">
                            Overview
                        </h2>
                        <p className="mt-0.5 text-xs text-neutral-400">
                            Your business at a glance
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="hidden rounded-lg bg-primary/10 px-3 py-1.5 text-[11px] font-medium text-primary md:inline-block">
                            Last 30 days
                        </span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-white">
                            <svg
                                className="h-3.5 w-3.5 text-neutral-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 8.688c0-.864.933-1.406 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.954l-7.108 4.062A1.125 1.125 0 013 16.812V8.688zM12.75 8.688c0-.864.933-1.406 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.954l-7.108 4.062A1.125 1.125 0 0112.75 16.812V8.688z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                    <MetricCard
                        label="Revenue"
                        value="$24,580"
                        change="+12.3%"
                        up
                    />
                    <MetricCard
                        label="Bookings"
                        value="148"
                        change="+8.1%"
                        up
                    />
                    <MetricCard
                        label="Customers"
                        value="892"
                        change="+5.7%"
                        up
                    />
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-5">
                    <div className="col-span-3 rounded-xl border border-border bg-white">
                        <div className="flex items-center justify-between border-b border-border px-4 py-3">
                            <h3 className="text-sm font-semibold text-neutral-900">
                                Recent Appointments
                            </h3>
                            <span className="text-xs font-medium text-primary">
                                View all
                            </span>
                        </div>
                        <div className="divide-y divide-border">
                            {[
                                {
                                    name: 'Sarah Johnson',
                                    service: 'Hair Styling',
                                    time: '09:00 AM',
                                    status: 'confirmed' as const,
                                },
                                {
                                    name: 'Mike Chen',
                                    service: 'Facial Treatment',
                                    time: '10:30 AM',
                                    status: 'in-progress' as const,
                                },
                                {
                                    name: 'Emily Davis',
                                    service: 'Manicure',
                                    time: '11:00 AM',
                                    status: 'confirmed' as const,
                                },
                                {
                                    name: 'James Wilson',
                                    service: 'Massage Therapy',
                                    time: '01:00 PM',
                                    status: 'pending' as const,
                                },
                            ].map((row) => (
                                <div
                                    key={row.name}
                                    className="flex items-center justify-between px-4 py-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                            {row.name
                                                .split(' ')
                                                .map((n) => n[0])
                                                .join('')}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-neutral-900">
                                                {row.name}
                                            </p>
                                            <p className="text-xs text-neutral-400">
                                                {row.service}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs text-neutral-400">
                                            {row.time}
                                        </span>
                                        <span
                                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                                row.status === 'confirmed'
                                                    ? 'bg-success/10 text-success'
                                                    : row.status ===
                                                        'in-progress'
                                                      ? 'bg-warning/10 text-warning'
                                                      : 'bg-neutral-100 text-neutral-500'
                                            }`}
                                        >
                                            <span
                                                className={`h-1.5 w-1.5 rounded-full ${
                                                    row.status === 'confirmed'
                                                        ? 'bg-success'
                                                        : row.status ===
                                                            'in-progress'
                                                          ? 'bg-warning'
                                                          : 'bg-neutral-400'
                                                }`}
                                            />
                                            {row.status === 'confirmed'
                                                ? 'Confirmed'
                                                : row.status === 'in-progress'
                                                  ? 'In Progress'
                                                  : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-2 rounded-xl border border-border bg-white p-4">
                        <h3 className="text-sm font-semibold text-neutral-900">
                            Revenue Breakdown
                        </h3>
                        <div className="mt-4 flex items-center justify-center">
                            <svg
                                width="140"
                                height="140"
                                viewBox="0 0 140 140"
                                className="shrink-0"
                            >
                                <g className="text-neutral-200">
                                    <circle
                                        cx="70"
                                        cy="70"
                                        r="60"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="18"
                                    />
                                </g>
                                <g className="text-primary">
                                    <circle
                                        cx="70"
                                        cy="70"
                                        r="60"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="18"
                                        strokeDasharray={`${(45 / 100) * 377} 377`}
                                        strokeDashoffset="0"
                                        transform="rotate(-90 70 70)"
                                    />
                                </g>
                                <g className="text-primary-light">
                                    <circle
                                        cx="70"
                                        cy="70"
                                        r="60"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="18"
                                        strokeDasharray={`${(30 / 100) * 377} 377`}
                                        strokeDashoffset={`${-(45 / 100) * 377}`}
                                        transform="rotate(-90 70 70)"
                                    />
                                </g>
                                <g className="text-success">
                                    <circle
                                        cx="70"
                                        cy="70"
                                        r="60"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="18"
                                        strokeDasharray={`${(25 / 100) * 377} 377`}
                                        strokeDashoffset={`${-((45 + 30) / 100) * 377}`}
                                        transform="rotate(-90 70 70)"
                                    />
                                </g>
                            </svg>
                        </div>
                        <div className="mt-4 space-y-2.5">
                            <LegendItem
                                color="bg-primary"
                                label="Services"
                                value="45%"
                            />
                            <LegendItem
                                color="bg-primary-light"
                                label="Products"
                                value="30%"
                            />
                            <LegendItem
                                color="bg-success"
                                label="Other"
                                value="25%"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TopBar() {
    return (
        <div className="flex items-center justify-between border-b border-border bg-white px-5 py-3">
            <div className="relative">
                <svg
                    className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                </svg>
                <input
                    type="text"
                    placeholder="Search..."
                    className="h-9 rounded-lg border border-border bg-neutral-50 pl-9 pr-3 text-xs text-neutral-500 outline-none transition-colors focus:border-primary/30 focus:bg-white"
                />
            </div>
            <div className="flex items-center gap-2">
                <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-white text-neutral-400 transition-colors hover:text-neutral-600">
                    <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                        />
                    </svg>
                </button>
                <div className="ml-1 h-7 w-7 rounded-full bg-gradient-to-br from-primary to-primary-light" />
            </div>
        </div>
    );
}

function MetricCard({
    label,
    value,
    change,
    up,
}: {
    label: string;
    value: string;
    change: string;
    up: boolean;
}) {
    return (
        <div className="rounded-xl border border-border bg-white p-4 transition-shadow hover:shadow-sm">
            <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
                {label}
            </p>
            <p className="mt-1.5 text-xl font-bold text-neutral-900">
                {value}
            </p>
            <span
                className={`mt-1 inline-flex items-center gap-0.5 text-xs font-medium ${
                    up ? 'text-success' : 'text-danger'
                }`}
            >
                <svg
                    className={`h-3 w-3 ${up ? '' : 'rotate-180'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
                    />
                </svg>
                {change}
            </span>
        </div>
    );
}

function LegendItem({
    color,
    label,
    value,
}: {
    color: string;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${color}`} />
                <span className="text-neutral-500">{label}</span>
            </div>
            <span className="font-medium text-neutral-900">{value}</span>
        </div>
    );
}

function FloatingCard() {
    return (
        <div className="animate-float-delayed absolute -right-4 -bottom-4 hidden overflow-hidden rounded-xl border border-border bg-white shadow-lg md:block">
            <div className="flex items-center gap-3 bg-success/10 px-4 py-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success text-xs text-white">
                    ✓
                </span>
                <p className="text-xs font-medium text-success">
                    New Booking
                </p>
            </div>
            <div className="px-4 py-3">
                <p className="text-sm font-medium text-neutral-900">
                    Sarah Johnson
                </p>
                <p className="mt-0.5 text-xs text-neutral-400">
                    Hair Styling &middot; Today 2:00 PM
                </p>
                <button className="mt-3 w-full rounded-lg bg-primary py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90">
                    Confirm
                </button>
            </div>
        </div>
    );
}

function FloatingChart() {
    return (
        <div className="animate-float absolute -left-4 -bottom-8 hidden overflow-hidden rounded-xl border border-border bg-white p-3 shadow-lg md:block">
            <p className="text-[11px] font-medium text-neutral-400">
                This Week
            </p>
            <div className="mt-2 flex items-end gap-1">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                    <div
                        key={i}
                        className="w-3 rounded-t-sm bg-gradient-to-t from-primary/40 to-primary/60"
                        style={{ height: `${h}%` }}
                    />
                ))}
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-neutral-300">
                <span>M</span>
                <span>T</span>
                <span>W</span>
                <span>T</span>
                <span>F</span>
                <span>S</span>
                <span>S</span>
            </div>
        </div>
    );
}
