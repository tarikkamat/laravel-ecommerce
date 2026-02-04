import { Head, Link } from '@inertiajs/react';
import { ExternalLink, Pencil } from 'lucide-react';

import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import type { BreadcrumbItem, Page } from '@/types';

interface Props {
    item: Page;
}

export default function PagesShow({ item }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: admin.dashboard.index() },
        { title: 'Sayfalar', href: admin.pages.index().url },
        { title: item.title, href: admin.pages.show(item.id).url },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Sayfa - ${item.title}`} />

            <div className="flex w-full flex-col gap-6 p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{item.title}</h1>
                        <p className="text-muted-foreground">/{item.slug}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <a href={`/sayfa/${item.slug}`} target="_blank" rel="noreferrer">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Sayfayı Gör
                            </a>
                        </Button>
                        <Button asChild>
                            <Link href={admin.pages.edit(item.id).url}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Düzenle
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="rounded border p-6">
                    <div className="grid gap-4 sm:grid-cols-2 text-sm">
                        <div>
                            <div className="text-xs text-muted-foreground">Tip</div>
                            <div className="font-semibold">{item.type}</div>
                        </div>
                        <div>
                            <div className="text-xs text-muted-foreground">Durum</div>
                            <div className="font-semibold">{item.active ? 'Aktif' : 'Pasif'}</div>
                        </div>
                    </div>

                    {item.type === 'contact' ? (
                        <div className="mt-6 grid gap-4 sm:grid-cols-2 text-sm">
                            <div>
                                <div className="text-xs text-muted-foreground">E-posta</div>
                                <div className="font-semibold">{item.contact_email || '-'}</div>
                            </div>
                            <div>
                                <div className="text-xs text-muted-foreground">Telefon</div>
                                <div className="font-semibold">{item.contact_phone || '-'}</div>
                            </div>
                            <div className="sm:col-span-2">
                                <div className="text-xs text-muted-foreground">Adres</div>
                                <div className="font-semibold whitespace-pre-line">{item.contact_address || '-'}</div>
                            </div>
                        </div>
                    ) : null}

                    <div className="mt-6">
                        <div className="text-xs text-muted-foreground">İçerik</div>
                        <div
                            className="prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: item.content ?? '' }}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
