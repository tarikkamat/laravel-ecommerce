import { Head, Link, router } from '@inertiajs/react';
import { FileText, Plus, Trash2, Pencil, Eye } from 'lucide-react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
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
import type { BreadcrumbItem, PaginatedData, Page } from '@/types';

interface Props {
    items: PaginatedData<Page>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: admin.dashboard.index(),
    },
    {
        title: 'Sayfalar',
        href: admin.pages.index().url,
    },
];

export default function PagesIndex({ items }: Props) {
    const handleDelete = (id: number) => {
        router.delete(admin.pages.destroy(id).url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sayfalar" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Sayfalar</h1>
                        <p className="text-muted-foreground">Toplam {items.total} sayfa bulunmaktadır.</p>
                    </div>
                    <Button asChild>
                        <Link href={admin.pages.create().url}>
                            <Plus className="mr-2 h-4 w-4" />
                            Yeni Sayfa
                        </Link>
                    </Button>
                </div>

                {items.data.length === 0 ? (
                    <Empty className="flex-1 border">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <FileText className="h-6 w-6" />
                            </EmptyMedia>
                            <EmptyTitle>Henüz sayfa bulunmuyor</EmptyTitle>
                            <EmptyDescription>
                                Hakkımızda, sözleşme veya iletişim sayfalarını buradan oluşturun.
                            </EmptyDescription>
                        </EmptyHeader>
                        <Button asChild>
                            <Link href={admin.pages.create().url}>
                                <Plus className="mr-2 h-4 w-4" />
                                Yeni Sayfa Oluştur
                            </Link>
                        </Button>
                    </Empty>
                ) : (
                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">ID</TableHead>
                                    <TableHead>Başlık</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead>Tip</TableHead>
                                    <TableHead>Durum</TableHead>
                                    <TableHead className="w-[140px] text-right">İşlemler</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.data.map((page) => (
                                    <TableRow key={page.id}>
                                        <TableCell className="font-medium">{page.id}</TableCell>
                                        <TableCell className="font-medium">{page.title}</TableCell>
                                        <TableCell className="text-muted-foreground">{page.slug}</TableCell>
                                        <TableCell className="text-muted-foreground">{page.type}</TableCell>
                                        <TableCell>
                                            <span className={`rounded-full px-2 py-1 text-xs ${page.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                                {page.active ? 'Aktif' : 'Pasif'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={admin.pages.show(page.id).url}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={admin.pages.edit(page.id).url}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Sayfayı sil?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Bu işlem geri alınamaz.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Vazgeç</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(page.id)}>
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
            </div>
        </AppLayout>
    );
}
