const footerLinks = [
    {
        label: 'Produk',
        links: ['Fitur', 'Harga', 'Integrasi', 'Pembaruan'],
    },
    {
        label: 'Perusahaan',
        links: ['Tentang', 'Blog', 'Karir', 'Kontak'],
    },
    {
        label: 'Bantuan',
        links: ['Dokumentasi', 'Referensi API', 'Status', 'FAQ'],
    },
    {
        label: 'Hukum',
        links: ['Privasi', 'Syarat & Ketentuan', 'Kebijakan Cookie'],
    },
];

export default function Footer() {
    return (
        <footer className="border-t border-border bg-neutral-50">
            <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                <div className="flex flex-col items-start gap-12 lg:flex-row">
                    <div className="max-w-sm">
                        <a href="/" className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-light text-sm font-bold text-white shadow-sm">
                                B
                            </div>
                            <span className="text-base font-semibold text-neutral-900">
                                BookCRM
                            </span>
                        </a>
                        <p className="mt-4 text-sm leading-relaxed text-neutral-500">
                            Platform booking dan CRM all-in-one untuk bisnis jasa. Kelola
                            janji temu, pelanggan, dan pertumbuhan bisnis dalam satu tempat.
                        </p>
                    </div>
                    <div className="flex flex-1 flex-wrap gap-12 sm:justify-end">
                        {footerLinks.map((group) => (
                            <div key={group.label}>
                                <h4 className="text-sm font-semibold text-neutral-900">
                                    {group.label}
                                </h4>
                                <ul className="mt-4 space-y-3">
                                    {group.links.map((link) => (
                                        <li key={link}>
                                            <a
                                                href="#"
                                                className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
                                            >
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-16 border-t border-border pt-8 text-center text-sm text-neutral-400">
                    &copy; {new Date().getFullYear()} BookCRM. Hak cipta dilindungi.
                </div>
            </div>
        </footer>
    );
}
