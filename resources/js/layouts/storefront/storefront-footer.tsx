import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';

export function StorefrontFooter() {
    const { storefrontSettings } = usePage<SharedData>().props;
    const siteSettings = storefrontSettings?.site;
    const footerLogoPath = siteSettings?.footer_logo_path ? `/storage/${siteSettings.footer_logo_path}` : '';
    const footerLogoText = siteSettings?.footer_logo_text || 'Suug';
    return (
        <footer className="border-t border-gray-100 bg-white py-10 dark:border-white/5 dark:bg-[#1a0c10]">
            <div className="mx-auto flex w-full max-w-[1440px] items-center justify-center px-6 lg:px-12">
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
            </div>
        </footer>
    );
}
