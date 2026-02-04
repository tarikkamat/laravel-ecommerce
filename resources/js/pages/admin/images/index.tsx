import { Head, Link, router } from '@inertiajs/react';
import { Eye, Image as ImageIcon, Pencil, Plus, Trash2 } from 'lucide-react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import type { BreadcrumbItem, ImageModel, PaginatedData } from '@/types';

interface Props {
    items: PaginatedData<ImageModel>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: admin.dashboard.index(),
    },
    {
        title: 'Görseller',
        href: admin.images.index().url,
    },
];

const getImageUrl = (path: string) => {
    if (!path) {
        return '';
    }
    return path.startsWith('http') ? path : `/storage/${path}`;
};

export default function ImagesIndex({ items }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Görseller" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Görseller</h1>
                        <p className="text-muted-foreground">
                            Toplam {items.total} görsel bulunmaktadır.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={admin.images.create().url}>
                            <Plus className="mr-2 h-4 w-4" />
                            Yeni Görsel
                        </Link>
                    </Button>
                </div>

                {items.data.length === 0 ? (
                    <Empty className="flex-1 border">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <ImageIcon className="h-6 w-6" />
                            </EmptyMedia>
                            <EmptyTitle>Henüz görsel bulunmuyor</EmptyTitle>
                            <EmptyDescription>
                                Galeriye ilk görselinizi yükleyin.
                            </EmptyDescription>
                        </EmptyHeader>
                        <Button asChild>
                            <Link href={admin.images.create().url}>
                                <Plus className="mr-2 h-4 w-4" />
                                Görsel Yükle
                            </Link>
                        </Button>
                    </Empty>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {items.data.map((image) => (
                            <div key={image.id} className="overflow-hidden rounded-lg border bg-card">
                                <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
                                    {image.path ? (
                                        <img
                                            src={getImageUrl(image.path)}
                                            alt={image.title || image.slug}
                                            className="h-full w-full object-cover"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                            <ImageIcon className="h-8 w-8" />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2 p-3">
                                    <div className="space-y-1">
                                        <p className="truncate text-sm font-medium">
                                            {image.title || image.slug}
                                        </p>
                                        <p className="truncate text-xs text-muted-foreground">
                                            {image.slug}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={admin.images.show(image.id).url}>
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={admin.images.edit(image.id).url}>
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent size="sm">
                                                    <AlertDialogHeader>
                                                        <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                                                            <Trash2 />
                                                        </AlertDialogMedia>
                                                        <AlertDialogTitle>Görseli sil?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Bu işlem "{image.title || image.slug}" görselini kalıcı olarak silecektir.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel variant="outline">İptal</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            variant="destructive"
                                                            onClick={() => router.delete(admin.images.destroy(image.id).url)}
                                                        >
                                                            Sil
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            #{image.id}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {items.data.length > 0 && items.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {items.from} - {items.to} / {items.total} kayıt gösteriliyor
                        </p>
                        <div className="flex items-center gap-2">
                            {items.links.map((link, index) => (
                                <Button
                                    key={index}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.visit(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
