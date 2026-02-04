import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { StorefrontNav } from '@/layouts/storefront/storefront-nav';
import { StorefrontFooter } from '@/layouts/storefront/storefront-footer';
import { usePage } from '@inertiajs/react';
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

    return (
        <>
            <Head title={resolvedTitle}>
                {metaDescription && <meta name="description" content={metaDescription} />}
                {metaKeywords && <meta name="keywords" content={metaKeywords} />}
            </Head>
            <div className="relative flex min-h-screen w-full flex-col">
                <StorefrontNav />
                <main className="flex-1 pt-36">{children}</main>
                <StorefrontFooter />
            </div>
        </>
    );
}
