import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';

export function StorefrontFooter() {
    const { storefrontSettings } = usePage<SharedData>().props;
    const siteSettings = storefrontSettings?.site;
    const footerLogoPath = siteSettings?.footer_logo_path ? `/storage/${siteSettings.footer_logo_path}` : '';
    const footerLogoText = siteSettings?.footer_logo_text || 'Suug';
    const footerDescription = siteSettings?.footer_description || '';
    const footerCopyright = siteSettings?.footer_copyright || '';
    const footerMenus = siteSettings?.footer_menus || [];
    const footerBottomLinks = siteSettings?.footer_bottom_links || [];
    const footerSocials = siteSettings?.footer_socials || [];

    return (
        <footer className="border-t border-gray-100 bg-white py-12 dark:border-white/5 dark:bg-[#1a0c10]">
            <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-12">
                <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            {footerLogoPath ? (
                                <img
                                    src={footerLogoPath}
                                    alt={footerLogoText}
                                    className="h-7 w-auto object-contain"
                                />
                            ) : (
                                <div className="flex size-7 items-center justify-center rounded-lg bg-[#ec135b] text-white">
                                    <span className="material-symbols-outlined !text-[20px]">spa</span>
                                </div>
                            )}
                            <span className="text-sm font-semibold tracking-tight text-[#181113] dark:text-[#f4f0f2]">
                                {footerLogoText}
                            </span>
                        </div>
                        {footerDescription && (
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {footerDescription}
                            </p>
                        )}
                        {footerSocials.length > 0 && (
                            <div className="flex flex-wrap gap-3">
                                {footerSocials.map((social) => (
                                    <a
                                        key={`${social.label}-${social.url}`}
                                        href={social.url}
                                        className="text-xs font-semibold uppercase tracking-widest text-gray-500 transition hover:text-[#ec135b] dark:text-gray-400"
                                        rel="noreferrer"
                                        target="_blank"
                                    >
                                        {social.label}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {footerMenus.length > 0 && (
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {footerMenus.map((menu) => (
                                <div key={menu.title} className="space-y-3">
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                                        {menu.title}
                                    </p>
                                    <ul className="space-y-2">
                                        {menu.items.map((item) => (
                                            <li key={`${item.label}-${item.url}`}>
                                                <a
                                                    href={item.url}
                                                    className="text-sm text-gray-600 transition hover:text-[#ec135b] dark:text-gray-300"
                                                >
                                                    {item.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {(footerBottomLinks.length > 0 || footerCopyright) && (
                    <div className="mt-10 border-t border-gray-100 pt-6 text-sm text-gray-500 dark:border-white/5 dark:text-gray-400">
                        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                            {footerCopyright && (
                                <p>{footerCopyright}</p>
                            )}
                            {footerBottomLinks.length > 0 && (
                                <div className="flex flex-wrap gap-4">
                                    {footerBottomLinks.map((link) => (
                                        <a
                                            key={`${link.label}-${link.url}`}
                                            href={link.url}
                                            className="text-xs font-semibold uppercase tracking-widest text-gray-500 transition hover:text-[#ec135b] dark:text-gray-400"
                                        >
                                            {link.label}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </footer>
    );
}
