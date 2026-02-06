import type { AuthLayoutProps, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { storefrontSettings, name } = usePage<SharedData>().props;
    const siteSettings = storefrontSettings?.site;
    const headerLogoPath = siteSettings?.header_logo_path ? `/storage/${siteSettings.header_logo_path}` : '';
    const headerLogoText = siteSettings?.header_logo_text || name;

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-[#fafafa] p-6 dark:bg-black md:p-10">
            <div className="w-full max-w-[400px]">
                <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950 sm:p-10">
                    <div className="mb-8 flex flex-col items-center text-center">
                        {headerLogoPath ? (
                            <img
                                src={headerLogoPath}
                                alt={headerLogoText}
                                className="mb-6 h-12 w-auto object-contain"
                            />
                        ) : (
                            <div className="mb-6 rounded-2xl bg-[#ec135b] px-4 py-2 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-[#ec135b]/20">
                                {headerLogoText}
                            </div>
                        )}
                        <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                            {title}
                        </h1>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
                
                <div className="mt-8 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-600">
                        {headerLogoText}
                    </p>
                </div>
            </div>
        </div>
    );
}
