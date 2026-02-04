import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Image as ImageIcon, Info, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import type { BreadcrumbItem, ImageModel } from '@/types';

interface Props {
    item: ImageModel;
}

const getImageUrl = (path: string) => {
    if (!path) {
        return '';
    }
    return path.startsWith('http') ? path : `/storage/${path}`;
};

export default function ImagesShow({ item }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: admin.dashboard.index(),
        },
        {
            title: 'Görseller',
            href: admin.images.index().url,
        },
        {
            title: item.title || item.slug,
            href: admin.images.show(item.id).url,
        },
    ];

    const handleDelete = () => {
        if (confirm('Bu görseli silmek istediğinize emin misiniz?')) {
            router.delete(admin.images.destroy(item.id).url);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={item.title || item.slug} />

            <div className="flex w-full flex-col gap-6 p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                {item.title || item.slug}
                            </h1>
                            <p className="text-muted-foreground">
                                Görsel detaylarını görüntülüyorsunuz.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" asChild>
                            <Link href={admin.images.index().url}>Görsellere Dön</Link>
                        </Button>
                        <Button variant="outline" onClick={handleDelete}>
                            <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                            Sil
                        </Button>
                        <Button asChild>
                            <Link href={admin.images.edit(item.id).url}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Düzenle
                            </Link>
                        </Button>
                    </div>
                </div>

                <Separator />

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <Tabs defaultValue="general">
                            <CardHeader className="pb-0">
                                <TabsList>
                                    <TabsTrigger value="general">
                                        <Info className="mr-1.5 h-4 w-4" />
                                        Genel Bilgiler
                                    </TabsTrigger>
                                    <TabsTrigger value="seo">
                                        <ImageIcon className="mr-1.5 h-4 w-4" />
                                        SEO
                                    </TabsTrigger>
                                </TabsList>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <TabsContent value="general" className="mt-0 space-y-5">
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">Slug</Label>
                                        <p className="text-sm font-medium">{item.slug}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">Başlık</Label>
                                        <p className="text-sm font-medium">
                                            {item.title || '-'}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">Açıklama</Label>
                                        <p className="text-sm whitespace-pre-wrap">
                                            {item.description || (
                                                <span className="text-muted-foreground italic">
                                                    Açıklama yok
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </TabsContent>

                                <TabsContent value="seo" className="mt-0 space-y-5">
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">SEO Başlığı</Label>
                                        <p className="text-sm font-medium">
                                            {item.seo_title || (
                                                <span className="text-muted-foreground italic">
                                                    SEO başlığı yok
                                                </span>
                                            )}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">SEO Açıklaması</Label>
                                        <p className="text-sm whitespace-pre-wrap">
                                            {item.seo_description || (
                                                <span className="text-muted-foreground italic">
                                                    SEO açıklaması yok
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </TabsContent>
                            </CardContent>
                        </Tabs>
                    </div>

                    <div className="space-y-6">
                        <div className="overflow-hidden rounded-lg border bg-muted">
                            {item.path ? (
                                <img
                                    src={getImageUrl(item.path)}
                                    alt={item.title || item.slug}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex aspect-[4/3] w-full items-center justify-center text-muted-foreground">
                                    <ImageIcon className="h-8 w-8" />
                                </div>
                            )}
                        </div>

                        <div className="rounded-lg border p-4 space-y-4">
                            <div className="flex items-start gap-3">
                                <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Oluşturulma</p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDate(item.created_at)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Güncellenme</p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDate(item.updated_at)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <ImageIcon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                <div className="min-w-0">
                                    <p className="text-sm font-medium">Dosya Yolu</p>
                                    <p className="truncate text-sm text-muted-foreground">
                                        {item.path}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
