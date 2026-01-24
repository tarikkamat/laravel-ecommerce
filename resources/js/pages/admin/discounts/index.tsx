import { Head, Link, router } from '@inertiajs/react';
import { Eye, Pencil, Percent, Plus, Trash2 } from 'lucide-react';

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
import type { BreadcrumbItem, Discount, PaginatedData } from '@/types';

interface Props {
    items: PaginatedData<Discount>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: admin.dashboard.index(),
    },
    {
        title: 'İndirimler',
        href: admin.discounts.index().url,
    },
];

const typeLabels: Record<string, string> = {
    percentage: 'Yüzde',
    fixed_amount: 'Sabit Tutar',
};

export default function DiscountsIndex({ items }: Props) {
    const formatValue = (discount: Discount) => {
        if (discount.type === 'percentage') {
            return `%${discount.value}`;
        }
        return `₺${discount.value.toFixed(2)}`;
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const isActive = (discount: Discount) => {
        const now = new Date();
        const startsAt = discount.starts_at ? new Date(discount.starts_at) : null;
        const endsAt = discount.ends_at ? new Date(discount.ends_at) : null;

        if (startsAt && now < startsAt) return false;
        if (endsAt && now > endsAt) return false;
        return true;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="İndirimler" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">İndirimler</h1>
                        <p className="text-muted-foreground">
                            Toplam {items.total} indirim bulunmaktadır.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={admin.discounts.create().url}>
                            <Plus className="mr-2 h-4 w-4" />
                            Yeni İndirim
                        </Link>
                    </Button>
                </div>

                {/* Empty State */}
                {items.data.length === 0 ? (
                    <Empty className="flex-1 border">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <Percent className="h-6 w-6" />
                            </EmptyMedia>
                            <EmptyTitle>Henüz indirim bulunmuyor</EmptyTitle>
                            <EmptyDescription>
                                Müşterilerinize özel indirimler tanımlayarak başlayın.
                            </EmptyDescription>
                        </EmptyHeader>
                        <Button asChild>
                            <Link href={admin.discounts.create().url}>
                                <Plus className="mr-2 h-4 w-4" />
                                Yeni İndirim Ekle
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
                                    <TableHead>Kod</TableHead>
                                    <TableHead>Tip</TableHead>
                                    <TableHead>Değer</TableHead>
                                    <TableHead className="hidden md:table-cell">Geçerlilik</TableHead>
                                    <TableHead>Durum</TableHead>
                                    <TableHead className="w-[120px] text-right">İşlemler</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.data.map((discount) => (
                                    <TableRow key={discount.id}>
                                        <TableCell className="font-medium">{discount.id}</TableCell>
                                        <TableCell>
                                            <span className="font-medium">{discount.title}</span>
                                        </TableCell>
                                        <TableCell>
                                            {discount.code ? (
                                                <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">
                                                    {discount.code}
                                                </code>
                                            ) : (
                                                <span className="text-muted-foreground italic">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {typeLabels[discount.type] || discount.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {formatValue(discount)}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                                            {formatDate(discount.starts_at)} - {formatDate(discount.ends_at)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={isActive(discount) ? 'default' : 'secondary'}>
                                                {isActive(discount) ? 'Aktif' : 'Pasif'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={admin.discounts.show(discount.id).url}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={admin.discounts.edit(discount.id).url}>
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
                                                            <AlertDialogTitle>İndirimi sil?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Bu işlem "{discount.title}" indirimini kalıcı olarak silecektir.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel variant="outline">İptal</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                variant="destructive"
                                                                onClick={() => router.delete(admin.discounts.destroy(discount.id).url)}
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
