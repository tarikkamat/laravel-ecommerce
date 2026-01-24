import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import storefront from '@/routes/storefront';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Hesabım',
        href: storefront.accounts.index.url(),
    },
];

export default function Account() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Account" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded-xl border border-sidebar-border/70 p-6 text-sm dark:border-sidebar-border">
                    Welcome to your account page.
                </div>
            </div>
        </AppLayout>
    );
}
