import { Head, Link, router } from '@inertiajs/react';
import { ChevronRight, Eye, FolderTree, Pencil, Plus, Trash2 } from 'lucide-react';

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
import type { BreadcrumbItem, PaginatedData, Category } from '@/types';

interface Props {
    items: PaginatedData<Category>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: admin.dashboard.index(),
    },
    {
        title: 'Kategoriler',
        href: admin.categories.index().url,
    },
];

export default function CategoriesIndex({ items }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kategoriler" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Kategoriler</h1>
                        <p className="text-muted-foreground">
                            Toplam {items.total} kategori bulunmaktadır.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={admin.categories.create().url}>
                            <Plus className="mr-2 h-4 w-4" />
                            Yeni Kategori
                        </Link>
                    </Button>
                </div>

                {/* Empty State */}
                {items.data.length === 0 ? (
                    <Empty className="flex-1 border">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <FolderTree className="h-6 w-6" />
                            </EmptyMedia>
                            <EmptyTitle>Henüz kategori bulunmuyor</EmptyTitle>
                            <EmptyDescription>
                                Ürünlerinizi organize etmek için ilk kategorinizi ekleyin.
                            </EmptyDescription>
                        </EmptyHeader>
                        <Button asChild>
                            <Link href={admin.categories.create().url}>
                                <Plus className="mr-2 h-4 w-4" />
                                Yeni Kategori Ekle
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
                                    <TableHead>Üst Kategori</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead className="hidden md:table-cell">Açıklama</TableHead>
                                    <TableHead className="w-[120px] text-right">İşlemler</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.data.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell className="font-medium">{category.id}</TableCell>
                                        <TableCell>
                                            <span className="font-medium">{category.title}</span>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {category.parent ? (
                                                <div className="flex items-center gap-1">
                                                    <span>{category.parent.title}</span>
                                                    <ChevronRight className="h-3 w-3" />
                                                    <span className="text-foreground">{category.title}</span>
                                                </div>
                                            ) : (
                                                <span className="italic">Ana Kategori</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {category.slug}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-muted-foreground">
                                            {category.description
                                                ? category.description.length > 50
                                                    ? `${category.description.substring(0, 50)}...`
                                                    : category.description
                                                : '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                >
                                                    <Link href={admin.categories.show(category.id).url}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                >
                                                    <Link href={admin.categories.edit(category.id).url}>
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
                                                            <AlertDialogTitle>Kategoriyi sil?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Bu işlem "{category.title}" kategorisini kalıcı olarak silecektir.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel variant="outline">İptal</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                variant="destructive"
                                                                onClick={() => router.delete(admin.categories.destroy(category.id).url)}
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
