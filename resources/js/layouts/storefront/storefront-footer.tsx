import { Link, usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';

export function StorefrontFooter() {
    const { storefrontSettings } = usePage<SharedData>().props;
    const siteSettings = storefrontSettings?.site;
    const footerLogoPath = siteSettings?.footer_logo_path ? `/storage/${siteSettings.footer_logo_path}` : '';
    const footerLogoText = siteSettings?.footer_logo_text || 'Suug';
    const footerDescription = siteSettings?.footer_description || '';
    const footerSocials = siteSettings?.footer_socials ?? [];
    const footerMenus = siteSettings?.footer_menus ?? [];
    const footerBottomLinks = siteSettings?.footer_bottom_links ?? [];
    const footerCopyright = siteSettings?.footer_copyright || '© 2024 Suug Cosmetics. All rights reserved.';

    return (
        <footer className="border-t border-gray-100 bg-white py-12 dark:border-white/5 dark:bg-[#1a0c10]">
            <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-12">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8">
                    {/* Brand Section */}
                    <div className="flex flex-col gap-6 lg:col-span-1">
                        <div className="flex items-center gap-2">
                            {footerLogoPath ? (
                                <img
                                    src={footerLogoPath}
                                    alt={footerLogoText}
                                    className="size-8 rounded-lg object-cover"
                                />
                            ) : (
                                <div className="flex size-8 items-center justify-center rounded-lg bg-[#ec135b] text-white">
                                    <span className="material-symbols-outlined !text-[24px]">
                                        spa
                                    </span>
                                </div>
                            )}
                            <h2 className="text-xl font-extrabold tracking-tight text-[#181113] dark:text-[#f4f0f2]">
                                {footerLogoText}
                            </h2>
                        </div>
                        {footerDescription && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {footerDescription}
                            </p>
                        )}
                        {footerSocials.length > 0 && (
                            <div className="flex flex-wrap gap-4">
                                {footerSocials.map((social, index) => (
                                    <a
                                        key={`footer-social-${index}`}
                                        href={social.url}
                                        className="text-sm text-gray-400 transition-colors hover:text-[#ec135b]"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {social.label}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {footerMenus.map((menu, index) => (
                        <div key={`footer-menu-${index}`}>
                            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#181113] dark:text-[#f4f0f2]">
                                {menu.title}
                            </h3>
                            <ul className="flex flex-col gap-3 text-sm text-gray-500 dark:text-gray-400">
                                {menu.items.map((item, itemIndex) => (
                                    <li key={`footer-menu-${index}-item-${itemIndex}`}>
                                        <Link
                                            href={item.url}
                                            className="transition-colors hover:text-[#ec135b]"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {footerBottomLinks.length > 0 && (
                        <div className="lg:col-span-1">
                            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#181113] dark:text-[#f4f0f2]">
                                Sayfalar ve Sözleşmeler
                            </h3>
                            <ul className="flex flex-col gap-3 text-sm text-gray-500 dark:text-gray-400">
                                {footerBottomLinks.map((item, index) => (
                                    <li key={`footer-pages-${index}`}>
                                        <Link href={item.url} className="transition-colors hover:text-[#ec135b]">
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 flex flex-col items-center justify-between border-t border-gray-100 pt-8 text-xs text-gray-400 dark:border-white/5 sm:flex-row">
                    <p>{footerCopyright}</p>
                </div>
            </div>
        </footer>
    );
}
