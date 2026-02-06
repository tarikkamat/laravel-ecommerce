import type { AuthLayoutProps, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name, storefrontSettings } = usePage<SharedData>().props;
    const siteSettings = storefrontSettings?.site;
    const headerLogoPath = siteSettings?.header_logo_path ? `/storage/${siteSettings.header_logo_path}` : '';
    const headerLogoText = siteSettings?.header_logo_text || name;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-zinc-900" />
                {headerLogoPath ? (
                    <img
                        src={headerLogoPath}
                        alt={headerLogoText}
                        className="relative z-10 h-12 w-auto object-contain"
                    />
                ) : (
                    <div className="relative z-10 rounded-xl bg-[#ec135b] px-4 py-2 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-[#ec135b]/20">
                        {headerLogoText}
                    </div>
                )}
            </div>
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    {headerLogoPath ? (
                        <img
                            src={headerLogoPath}
                            alt={headerLogoText}
                            className="h-12 w-auto object-contain sm:h-14"
                        />
                    ) : (
                        <div className="self-start rounded-xl bg-[#ec135b] px-4 py-2 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-[#ec135b]/20">
                            {headerLogoText}
                        </div>
                    )}
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-medium">{title}</h1>
                        <p className="text-sm text-balance text-muted-foreground">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
