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

                    {/* Newsletter */}
                    <div className="lg:col-span-1">
                        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#181113] dark:text-[#f4f0f2]">
                            Stay in the loop
                        </h3>
                        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                            Sign up for 10% off your first order and exclusive
                            access to new drops.
                        </p>
                        <form className="flex flex-col gap-3">
                            <input
                                className="h-10 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-[#181113] outline-none focus:border-[#ec135b] focus:ring-1 focus:ring-[#ec135b] dark:border-white/20 dark:text-[#f4f0f2] placeholder:text-gray-400"
                                placeholder="Enter your email"
                                type="email"
                            />
                            <button
                                className="h-10 w-full rounded-lg bg-[#181113] text-sm font-bold text-white transition-colors hover:bg-[#ec135b] dark:bg-white dark:text-[#181113] dark:hover:bg-gray-200"
                                type="submit"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 flex flex-col items-center justify-between border-t border-gray-100 pt-8 text-xs text-gray-400 dark:border-white/5 sm:flex-row">
                    <p>{footerCopyright}</p>
                    {footerBottomLinks.length > 0 && (
                        <div className="mt-4 flex gap-6 sm:mt-0">
                            {footerBottomLinks.map((item, index) => (
                                <Link key={`footer-bottom-${index}`} href={item.url} className="hover:text-[#ec135b]">
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </footer>
    );
}
