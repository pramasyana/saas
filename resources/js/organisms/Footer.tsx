const footerProductLinks = [
    'Nusentra Booking',
    'Nusentra CRM',
    'Nusentra Finance',
    'Nusentra Pages',
];

const footerSolutionLinks = [
    'Solusi Startup',
    'Solusi UMKM',
    'Enterprise Solution',
    'Solusi Retail',
];

const footerCompanyLinks = [
    'Tentang Kami',
    'Karir',
    'Blog',
    'Privacy Policy',
];

export default function Footer() {
    return (
        <footer className="bg-neutral-50 border-t border-neutral-200/50">
            <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
                    <div className="col-span-2 space-y-4">
                        <a href="/" className="inline-flex items-center gap-2.5">
                            <img src="/images/logo-nusentra.png" alt="Nusentra" className="h-20 w-auto object-contain" />
                        </a>
                        <p className="text-sm text-neutral-500 leading-relaxed max-w-sm">
                            Nusentra adalah perusahaan Software as a Service (SaaS) yang menyediakan
                            berbagai solusi software berbasis cloud untuk membantu bisnis mengelola
                            operasional lebih efisien.
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-start gap-2 text-xs text-neutral-500">
                                <svg className="h-4 w-4 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                                <span>Jakarta: Mid Plaza 2, Jl. Jenderal Sudirman No.4, Jakarta Pusat</span>
                            </div>
                            <div className="flex items-start gap-2 text-xs text-neutral-500">
                                <svg className="h-4 w-4 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                                <span>Surabaya: Jl. Ngagel Jaya Selatan No.158, Surabaya</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h5 className="font-bold text-sm text-neutral-900 mb-4">Produk</h5>
                        <ul className="space-y-3">
                            {footerProductLinks.map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-sm text-neutral-500 hover:text-primary transition-colors">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h5 className="font-bold text-sm text-neutral-900 mb-4">Solusi</h5>
                        <ul className="space-y-3">
                            {footerSolutionLinks.map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-sm text-neutral-500 hover:text-primary transition-colors">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h5 className="font-bold text-sm text-neutral-900 mb-4">Perusahaan</h5>
                        <ul className="space-y-3">
                            {footerCompanyLinks.map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-sm text-neutral-500 hover:text-primary transition-colors">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-neutral-200/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <span className="text-xs text-neutral-400">
                        &copy; {new Date().getFullYear()} Nusentra. Hak cipta dilindungi. PT Nusentra Digital Nusantara.
                    </span>
                    <div className="flex items-center gap-4">
                        {['Globe', 'MessageCircle', 'Megaphone'].map((icon) => (
                            <a
                                key={icon}
                                href="#"
                                className="text-neutral-400 hover:text-primary transition-colors"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    {icon === 'Globe' && (
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                                    )}
                                    {icon === 'MessageCircle' && (
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                                    )}
                                    {icon === 'Megaphone' && (
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.52-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
                                    )}
                                </svg>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
