import type { SharedData } from '@/types';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    const { storefrontSettings, name } = usePage<SharedData>().props;
    const siteSettings = storefrontSettings?.site;
    const headerLogoPath = siteSettings?.header_logo_path ? `/storage/${siteSettings.header_logo_path}` : '';
    const headerLogoText = siteSettings?.header_logo_text || name;

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="flex w-full max-w-md flex-col gap-6">
                {headerLogoPath ? (
                    <img
                        src={headerLogoPath}
                        alt={headerLogoText}
                        className="h-10 w-auto object-contain"
                    />
                ) : (
                    <div className="self-start rounded-xl bg-[#ec135b] px-4 py-2 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-[#ec135b]/20">
                        {headerLogoText}
                    </div>
                )}
                <div className="flex flex-col gap-6">
                    <Card className="rounded-xl">
                        <CardHeader className="px-10 pt-8 pb-0 text-center">
                            <CardTitle className="text-xl">{title}</CardTitle>
                            <CardDescription>{description}</CardDescription>
                        </CardHeader>
                        <CardContent className="px-10 py-8">
                            {children}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
