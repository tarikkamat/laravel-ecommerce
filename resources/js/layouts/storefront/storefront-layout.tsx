import { Head, Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { StorefrontNav } from '@/layouts/storefront/storefront-nav';
import { StorefrontFooter } from '@/layouts/storefront/storefront-footer';

type Props = {
    children: ReactNode;
    title?: string;
};

export default function StorefrontLayout({ children, title }: Props) {
    return (
        <>
            {title && <Head title={title} />}
            <div className="relative flex min-h-screen w-full flex-col">
                <StorefrontNav />
                <main className="flex-1 pt-20">{children}</main>
                <StorefrontFooter />
            </div>
        </>
    );
}
