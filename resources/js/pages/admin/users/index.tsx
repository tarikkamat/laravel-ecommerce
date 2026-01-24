import { Head, Link, router } from '@inertiajs/react';
import { Eye, Pencil, Plus, Trash2, Users } from 'lucide-react';

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
import type { BreadcrumbItem, PaginatedData, User } from '@/types';

interface Props {
    items: PaginatedData<User>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: admin.dashboard.index(),
    },
    {
        title: 'Kullanıcılar',
        href: admin.users.index().url,
    },
];

const roleLabels: Record<string, string> = {
    admin: 'Yönetici',
    customer: 'Müşteri',
};

export default function UsersIndex({ items }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kullanıcılar" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Kullanıcılar</h1>
                        <p className="text-muted-foreground">
                            Toplam {items.total} kullanıcı bulunmaktadır.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={admin.users.create().url}>
                            <Plus className="mr-2 h-4 w-4" />
                            Yeni Kullanıcı
                        </Link>
                    </Button>
                </div>

                {/* Empty State */}
                {items.data.length === 0 ? (
                    <Empty className="flex-1 border">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <Users className="h-6 w-6" />
                            </EmptyMedia>
                            <EmptyTitle>Henüz kullanıcı bulunmuyor</EmptyTitle>
                            <EmptyDescription>
                                Sisteme yeni kullanıcı ekleyerek başlayın.
                            </EmptyDescription>
                        </EmptyHeader>
                        <Button asChild>
                            <Link href={admin.users.create().url}>
                                <Plus className="mr-2 h-4 w-4" />
                                Yeni Kullanıcı Ekle
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
                                    <TableHead>Ad Soyad</TableHead>
                                    <TableHead>E-posta</TableHead>
                                    <TableHead>Rol</TableHead>
                                    <TableHead className="hidden md:table-cell">Adres Sayısı</TableHead>
                                    <TableHead className="w-[120px] text-right">İşlemler</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.data.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.id}</TableCell>
                                        <TableCell>
                                            <span className="font-medium">{user.name}</span>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {user.email}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                                {roleLabels[user.role] || user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-muted-foreground">
                                            {user.addresses?.length || 0}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={admin.users.show(user.id).url}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={admin.users.edit(user.id).url}>
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
                                                            <AlertDialogTitle>Kullanıcıyı sil?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Bu işlem "{user.name}" kullanıcısını kalıcı olarak silecektir.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel variant="outline">İptal</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                variant="destructive"
                                                                onClick={() => router.delete(admin.users.destroy(user.id).url)}
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
