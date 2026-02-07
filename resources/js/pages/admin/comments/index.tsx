import { Head, Link, router, useForm } from '@inertiajs/react';
import { Check, MessageSquare, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';

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
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import type { BreadcrumbItem, PaginatedData, ProductComment } from '@/types';

interface Props {
    items: PaginatedData<ProductComment>;
    filters: {
        status?: string;
        product_id?: string;
        search?: string;
    };
    products: { value: number; label: string }[];
    statusOptions: { value: string; label: string }[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: admin.dashboard.index(),
    },
    {
        title: 'Yorumlar',
        href: admin.comments.index().url,
    },
];

const statusLabelMap: Record<string, string> = {
    pending: 'Beklemede',
    approved: 'Onaylandı',
    rejected: 'Reddedildi',
};

const statusVariant = (status: string) => {
    if (status === 'approved') return 'default';
    if (status === 'rejected') return 'destructive';
    return 'secondary';
};

const formatDate = (value: string) => {
    return new Date(value).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export default function CommentsIndex({ items, filters, products, statusOptions }: Props) {
    const [form, setForm] = useState({
        status: filters.status || 'all',
        product_id: filters.product_id || 'all',
        search: filters.search || '',
    });
    const [replyingToId, setReplyingToId] = useState<number | null>(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        body: '',
    });

    const productOptions = useMemo(
        () => [{ value: 'all', label: 'Tüm Ürünler' }, ...products.map((product) => ({ value: String(product.value), label: product.label }))],
        [products]
    );

    const statusChoices = useMemo(
        () => [{ value: 'all', label: 'Tümü' }, ...statusOptions],
        [statusOptions]
    );

    const applyFilters = () => {
        router.get(admin.comments.index().url, {
            status: form.status === 'all' ? '' : form.status,
            product_id: form.product_id === 'all' ? '' : form.product_id,
            search: form.search,
        }, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        const cleared = { status: 'all', product_id: 'all', search: '' };
        setForm(cleared);
        router.get(admin.comments.index().url, { status: '', product_id: '', search: '' }, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const startReply = (commentId: number) => {
        setReplyingToId(commentId);
        setData('body', '');
    };

    const submitReply = (commentId: number) => {
        post(admin.comments.reply(commentId).url, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setReplyingToId(null);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Yorumlar" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Yorumlar</h1>
                        <p className="text-muted-foreground">Toplam {items.total} yorum bulunmaktadır.</p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={admin.products.index().url}>Ürünlere Git</Link>
                    </Button>
                </div>

                <div className="rounded-lg border bg-card p-4">
                    <div className="grid gap-3 md:grid-cols-4">
                        <div className="md:col-span-2">
                            <Input
                                placeholder="Yorum, ürün veya e-posta ara"
                                value={form.search}
                                onChange={(event) => setForm((prev) => ({ ...prev, search: event.target.value }))}
                            />
                        </div>
                        <Select value={form.status} onValueChange={(value) => setForm((prev) => ({ ...prev, status: value }))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Durum" />
                            </SelectTrigger>
                            <SelectContent>
                                {statusChoices.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={form.product_id} onValueChange={(value) => setForm((prev) => ({ ...prev, product_id: value }))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Ürün" />
                            </SelectTrigger>
                            <SelectContent>
                                {productOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <Button onClick={applyFilters}>Filtrele</Button>
                        <Button variant="outline" onClick={clearFilters}>Temizle</Button>
                    </div>
                </div>

                {items.data.length === 0 ? (
                    <Empty className="flex-1 border">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <MessageSquare className="h-6 w-6" />
                            </EmptyMedia>
                            <EmptyTitle>Henüz yorum yok</EmptyTitle>
                            <EmptyDescription>Yeni yorumlar geldiğinde burada listelenecek.</EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ürün</TableHead>
                                    <TableHead>Kullanıcı</TableHead>
                                    <TableHead>Yorum</TableHead>
                                    <TableHead>Durum</TableHead>
                                    <TableHead>Tarih</TableHead>
                                    <TableHead className="text-right">İşlemler</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.data.map((comment) => (
                                    <TableRow key={comment.id}>
                                        <TableCell className="font-medium">
                                            {comment.product?.title || '-'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm font-medium">{comment.user?.name || 'Bilinmeyen'}</div>
                                            <div className="text-xs text-muted-foreground">{comment.user?.email}</div>
                                        </TableCell>
                                        <TableCell className="max-w-[360px]">
                                            <div className="space-y-3">
                                                <p className="text-sm">{comment.body}</p>
                                                {comment.replies && comment.replies.length > 0 && (
                                                    <div className="space-y-2 rounded-md border-l border-muted pl-3">
                                                        {comment.replies.map((reply) => (
                                                            <div key={reply.id} className="rounded-md bg-muted/30 p-2">
                                                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                                    <span>{reply.user?.name || reply.user?.email || 'Yönetici'}</span>
                                                                    <span>{formatDate(reply.created_at)}</span>
                                                                </div>
                                                                <p className="mt-1 text-sm text-foreground">{reply.body}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {replyingToId === comment.id && (
                                                    <div className="space-y-2">
                                                        <textarea
                                                            className="min-h-[90px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                            placeholder="Yanıtınızı yazın..."
                                                            value={data.body}
                                                            onChange={(event) => setData('body', event.target.value)}
                                                        />
                                                        {errors.body && (
                                                            <p className="text-xs text-destructive">{errors.body}</p>
                                                        )}
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                size="sm"
                                                                onClick={() => submitReply(comment.id)}
                                                                disabled={processing || data.body.trim() === ''}
                                                            >
                                                                Yanıtla
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => setReplyingToId(null)}
                                                            >
                                                                Vazgeç
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={statusVariant(comment.status)}>
                                                {statusLabelMap[comment.status] || comment.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {formatDate(comment.created_at)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                {comment.status !== 'approved' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => router.patch(admin.comments.approve(comment.id).url)}
                                                    >
                                                        <Check className="h-4 w-4 text-emerald-600" />
                                                    </Button>
                                                )}
                                                {comment.status !== 'rejected' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => router.patch(admin.comments.reject(comment.id).url)}
                                                    >
                                                        <X className="h-4 w-4 text-orange-600" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => startReply(comment.id)}
                                                >
                                                    <MessageSquare className="h-4 w-4" />
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
                                                            <AlertDialogTitle>Yorumu sil?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Bu yorum ve yanıtları kalıcı olarak silinecek.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel variant="outline">İptal</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                variant="destructive"
                                                                onClick={() => router.delete(admin.comments.destroy(comment.id).url)}
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
