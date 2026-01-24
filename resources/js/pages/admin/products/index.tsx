import { Head, Link, router } from '@inertiajs/react';
import { Eye, Package, Pencil, Plus, Trash2 } from 'lucide-react';

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
import { Badge } from '@/components/ui/badge';
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
import type { BreadcrumbItem, PaginatedData, Product } from '@/types';

interface Props {
    items: PaginatedData<Product>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: admin.dashboard.index(),
    },
    {
        title: 'Ürünler',
        href: admin.products.index().url,
    },
];

export default function ProductsIndex({ items }: Props) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
        }).format(price);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ürünler" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Ürünler</h1>
                        <p className="text-muted-foreground">
                            Toplam {items.total} ürün bulunmaktadır.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={admin.products.create().url}>
                            <Plus className="mr-2 h-4 w-4" />
                            Yeni Ürün
                        </Link>
                    </Button>
                </div>

                {/* Empty State */}
                {items.data.length === 0 ? (
                    <Empty className="flex-1 border">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <Package className="h-6 w-6" />
                            </EmptyMedia>
                            <EmptyTitle>Henüz ürün bulunmuyor</EmptyTitle>
                            <EmptyDescription>
                                Mağazanıza yeni ürünler ekleyerek başlayın.
                            </EmptyDescription>
                        </EmptyHeader>
                        <Button asChild>
                            <Link href={admin.products.create().url}>
                                <Plus className="mr-2 h-4 w-4" />
                                Yeni Ürün Ekle
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
                                    <TableHead>Ürün</TableHead>
                                    <TableHead>SKU</TableHead>
                                    <TableHead>Fiyat</TableHead>
                                    <TableHead className="hidden md:table-cell">Stok</TableHead>
                                    <TableHead>Durum</TableHead>
                                    <TableHead className="w-[120px] text-right">İşlemler</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.data.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium">{product.id}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                {product.images?.[0]?.path && (
                                                    <img
                                                        src={`/storage/${product.images[0].path}`}
                                                        alt={product.title}
                                                        className="h-10 w-10 rounded object-cover"
                                                    />
                                                )}
                                                <div>
                                                    <p className="font-medium">{product.title}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {product.brand?.title || '-'}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">
                                                {product.sku}
                                            </code>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                {product.sale_price ? (
                                                    <>
                                                        <p className="font-medium text-destructive">
                                                            {formatPrice(product.sale_price)}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground line-through">
                                                            {formatPrice(product.price)}
                                                        </p>
                                                    </>
                                                ) : (
                                                    <p className="font-medium">{formatPrice(product.price)}</p>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <Badge variant={product.stock > 0 ? 'secondary' : 'destructive'}>
                                                {product.stock > 0 ? `${product.stock} adet` : 'Tükendi'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={product.active ? 'default' : 'secondary'}>
                                                {product.active ? 'Aktif' : 'Pasif'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={admin.products.show(product.id).url}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={admin.products.edit(product.id).url}>
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
                                                            <AlertDialogTitle>Ürünü sil?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Bu işlem "{product.title}" ürününü kalıcı olarak silecektir.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel variant="outline">İptal</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                variant="destructive"
                                                                onClick={() => router.delete(admin.products.destroy(product.id).url)}
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
