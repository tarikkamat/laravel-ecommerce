import { Head, Link, router } from '@inertiajs/react';
import { Eye, Pencil, Plus, Tag, Trash2 } from 'lucide-react';

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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import type { BreadcrumbItem, PaginatedData, Brand } from '@/types';

interface Props {
    items: PaginatedData<Brand>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: admin.dashboard.index(),
    },
    {
        title: 'Markalar',
        href: admin.brands.index().url,
    },
];

export default function BrandsIndex({ items }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Markalar" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Markalar</h1>
                        <p className="text-muted-foreground">
                            Toplam {items.total} marka bulunmaktadır.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={admin.brands.create().url}>
                            <Plus className="mr-2 h-4 w-4" />
                            Yeni Marka
                        </Link>
                    </Button>
                </div>

                {/* Empty State */}
                {items.data.length === 0 ? (
                    <Empty className="flex-1 border">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <Tag className="h-6 w-6" />
                            </EmptyMedia>
                            <EmptyTitle>Henüz marka bulunmuyor</EmptyTitle>
                            <EmptyDescription>
                                Ürünlerinizi organize etmek için ilk markanızı ekleyin.
                            </EmptyDescription>
                        </EmptyHeader>
                        <Button asChild>
                            <Link href={admin.brands.create().url}>
                                <Plus className="mr-2 h-4 w-4" />
                                Yeni Marka Ekle
                            </Link>
                        </Button>
                    </Empty>
                ) : (
                    /* Table */
                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">ID</TableHead>
                                    <TableHead>Başlık</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead className="hidden md:table-cell">Açıklama</TableHead>
                                    <TableHead className="w-[120px] text-right">İşlemler</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.data.map((brand) => (
                                    <TableRow key={brand.id}>
                                        <TableCell className="font-medium">{brand.id}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                {brand.image?.path && (
                                                    <img
                                                        src={`/storage/${brand.image.path}`}
                                                        alt={brand.image.title || brand.title}
                                                        className="h-8 w-8 rounded object-cover"
                                                    />
                                                )}
                                                <span className="font-medium">{brand.title}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {brand.slug}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-muted-foreground">
                                            {brand.description
                                                ? brand.description.length > 50
                                                    ? `${brand.description.substring(0, 50)}...`
                                                    : brand.description
                                                : '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                >
                                                    <Link href={admin.brands.show(brand.id).url}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                >
                                                    <Link href={admin.brands.edit(brand.id).url}>
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
                                                            <AlertDialogTitle>Markayı sil?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Bu işlem "{brand.title}" markasını kalıcı olarak silecektir.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel variant="outline">İptal</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                variant="destructive"
                                                                onClick={() => router.delete(admin.brands.destroy(brand.id).url)}
                                                            >
                                                                Sil
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {/* Pagination */}
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
                                    asChild={!!link.url}
                                >
                                    {link.url ? (
                                        <Link
                                            href={link.url}
                                            preserveScroll
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                    )}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
