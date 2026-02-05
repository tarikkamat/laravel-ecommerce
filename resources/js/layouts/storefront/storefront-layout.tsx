import { Head, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { StorefrontNav } from '@/layouts/storefront/storefront-nav';
import { StorefrontFooter } from '@/layouts/storefront/storefront-footer';
import type { SharedData } from '@/types';

type Props = {
    children: ReactNode;
    title?: string;
};

export default function StorefrontLayout({ children, title }: Props) {
    const { storefrontSettings } = usePage<SharedData>().props;
    const siteTitle = storefrontSettings?.site?.title ?? 'Site';
    const resolvedTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const metaDescription = storefrontSettings?.site?.meta_description ?? '';
    const metaKeywords = storefrontSettings?.site?.meta_keywords ?? '';
    const whatsappEnabled = storefrontSettings?.site?.whatsapp_enabled ?? false;
    const whatsappPhone = storefrontSettings?.site?.whatsapp_phone ?? '';
    const whatsappMessage = storefrontSettings?.site?.whatsapp_message ?? '';
    const announcementEnabled = storefrontSettings?.site?.announcement_enabled ?? false;
    const announcementText = storefrontSettings?.site?.announcement_text ?? '';
    const announcementTexts = storefrontSettings?.site?.announcement_texts ?? [];
    const announcementSpeedSeconds = storefrontSettings?.site?.announcement_speed_seconds ?? 18;
    const announcementBackground = storefrontSettings?.site?.announcement_background ?? '#181113';
    const announcementTextColor = storefrontSettings?.site?.announcement_text_color ?? '#ffffff';
    const announcementItems =
        announcementTexts.length > 0 ? announcementTexts : announcementText ? [announcementText] : [];
    const tickerItems =
        announcementItems.length > 1 ? announcementItems : [...announcementItems, ...announcementItems];
    const whatsappUrl = whatsappEnabled && whatsappPhone
        ? `https://api.whatsapp.com/send?phone=${encodeURIComponent(whatsappPhone)}&text=${encodeURIComponent(whatsappMessage)}`
        : '';

    return (
        <>
            <Head title={resolvedTitle}>
                {metaDescription && <meta name="description" content={metaDescription} />}
                {metaKeywords && <meta name="keywords" content={metaKeywords} />}
            </Head>
            <div className="relative flex min-h-screen w-full flex-col">
                <StorefrontNav />
                {announcementEnabled && announcementItems.length > 0 && (
                    <div
                        className="relative z-40 w-full overflow-hidden"
                        style={{ backgroundColor: announcementBackground, color: announcementTextColor }}
                    >
                        <div className="mx-auto flex max-w-[1440px] items-center px-6 py-2 lg:px-12">
                            <div className="relative w-full overflow-hidden">
                                <div
                                    className="flex w-max items-center gap-8 whitespace-nowrap text-sm font-semibold uppercase tracking-[0.2em] will-change-transform"
                                    style={{
                                        animation: `ticker ${announcementSpeedSeconds}s linear infinite`,
                                    }}
                                >
                                    {[...tickerItems, ...tickerItems].map((text, index) => (
                                        <span key={`t-${index}`} className="flex items-center gap-3 pr-6">
                                            {text}
                                            <span className="text-[#ec135b]">•</span>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <style>{`
                            @keyframes ticker {
                                0% { transform: translateX(0); }
                                100% { transform: translateX(-50%); }
                            }
                        `}</style>
                    </div>
                )}
                <main className="flex-1 pt-36">{children}</main>
                {whatsappEnabled && whatsappPhone && (
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-transform hover:scale-105"
                        aria-label="WhatsApp ile iletişim"
                    >
                        <svg
                            viewBox="0 0 32 32"
                            aria-hidden="true"
                            className="h-7 w-7"
                            fill="currentColor"
                        >
                            <path d="M19.11 17.35c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.62.14-.18.27-.71.88-.88 1.06-.16.18-.32.2-.59.07-.27-.14-1.13-.42-2.15-1.34-.79-.7-1.33-1.56-1.48-1.83-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.48.14-.16.18-.27.27-.46.09-.18.05-.35-.02-.49-.07-.14-.62-1.49-.85-2.05-.23-.55-.46-.47-.62-.48-.16-.01-.35-.01-.53-.01-.18 0-.49.07-.75.35-.25.27-.98.96-.98 2.33 0 1.37 1 2.7 1.14 2.89.14.18 1.97 3.01 4.77 4.22.67.29 1.19.46 1.6.59.67.21 1.28.18 1.76.11.54-.08 1.6-.65 1.83-1.28.23-.62.23-1.16.16-1.28-.07-.12-.25-.2-.52-.34M16.04 5.33c-5.87 0-10.64 4.77-10.64 10.64 0 1.88.49 3.71 1.42 5.31L5 27l5.88-1.54a10.6 10.6 0 0 0 5.16 1.33h.01c5.87 0 10.64-4.77 10.64-10.64 0-2.83-1.1-5.5-3.1-7.5a10.57 10.57 0 0 0-7.55-3.12m0 19.46h-.01a8.8 8.8 0 0 1-4.48-1.22l-.32-.19-3.49.91.93-3.4-.21-.35a8.78 8.78 0 0 1-1.35-4.68c0-4.86 3.95-8.8 8.81-8.8 2.35 0 4.55.92 6.21 2.58a8.73 8.73 0 0 1 2.57 6.22c0 4.86-3.95 8.8-8.66 8.8" />
                        </svg>
                    </a>
                )}
                <StorefrontFooter />
            </div>
        </>
    );
}
