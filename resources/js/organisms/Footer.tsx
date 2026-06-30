const footerLinks = [
    {
        label: 'Product',
        links: ['Features', 'Pricing', 'Integrations', 'Changelog'],
    },
    {
        label: 'Company',
        links: ['About', 'Blog', 'Careers', 'Contact'],
    },
    {
        label: 'Support',
        links: ['Docs', 'API Reference', 'Status', 'FAQ'],
    },
    {
        label: 'Legal',
        links: ['Privacy', 'Terms', 'Cookie Policy'],
    },
];

export default function Footer() {
    return (
        <footer className="border-t border-border bg-neutral-50">
            <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                <div className="flex flex-col items-start gap-12 lg:flex-row">
                    <div className="max-w-sm">
                        <a href="/" className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
                                B
                            </div>
                            <span className="text-base font-semibold text-neutral-900">
                                BookingCRM
                            </span>
                        </a>
                        <p className="mt-4 text-sm leading-relaxed text-neutral-500">
                            The all-in-one booking and CRM platform for service
                            businesses. Manage appointments, customers, and
                            growth in one place.
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
                    &copy; {new Date().getFullYear()} BookingCRM. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
