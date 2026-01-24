import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Globe, Info, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import type { BreadcrumbItem, Tag } from '@/types';

interface Props {
    item: Tag;
}

export default function TagsShow({ item }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: admin.dashboard.index(),
        },
        {
            title: 'Etiketler',
            href: admin.tags.index().url,
        },
        {
            title: item.title,
            href: admin.tags.show(item.id).url,
        },
    ];

    const handleDelete = () => {
        if (confirm('Bu etiketi silmek istediğinize emin misiniz?')) {
            router.delete(admin.tags.destroy(item.id).url);
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
            <Head title={item.title} />

            <div className="flex w-full flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">{item.title}</h1>
                            <p className="text-muted-foreground">
                                Etiket detaylarını görüntülüyorsunuz.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" asChild>
                            <Link href={admin.tags.index().url}>Etiket Listesine Dön</Link>
                        </Button>
                        <Button variant="outline" onClick={handleDelete}>
                            <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                            Sil
                        </Button>
                        <Button asChild>
                            <Link href={admin.tags.edit(item.id).url}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Düzenle
                            </Link>
                        </Button>
                    </div>
                </div>

                <Separator />

                {/* Content */}
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <Tabs defaultValue="general">
                            <CardHeader className="pb-0">
                                <TabsList>
                                    <TabsTrigger value="general">
                                        <Info className="mr-1.5 h-4 w-4" />
                                        Genel Bilgiler
                                    </TabsTrigger>
                                    <TabsTrigger value="seo">
                                        <Globe className="mr-1.5 h-4 w-4" />
                                        SEO
                                    </TabsTrigger>
                                </TabsList>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <TabsContent value="general" className="mt-0 space-y-5">
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">Etiket Adı</Label>
                                        <p className="text-sm font-medium">{item.title}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">URL Adresi (Slug)</Label>
                                        <p className="text-sm font-medium">
                                            <span className="text-muted-foreground">
                                                suug.istanbul/etiketler/
                                            </span>
                                            {item.slug}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">Açıklama</Label>
                                        <p className="text-sm whitespace-pre-wrap">
                                            {item.description || (
                                                <span className="text-muted-foreground italic">
                                                    Açıklama girilmemiş
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </TabsContent>

                                <TabsContent value="seo" className="mt-0 space-y-5">
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">SEO Başlığı</Label>
                                        <p className="text-sm">
                                            {item.seo_title || (
                                                <span className="text-muted-foreground italic">
                                                    SEO başlığı girilmemiş
                                                </span>
                                            )}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">SEO Açıklaması</Label>
                                        <p className="text-sm whitespace-pre-wrap">
                                            {item.seo_description || (
                                                <span className="text-muted-foreground italic">
                                                    SEO açıklaması girilmemiş
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </TabsContent>
                            </CardContent>
                        </Tabs>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Dates */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-primary" />
                                <Label className="font-semibold">Tarih Bilgileri</Label>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Oluşturulma:</span>
                                    <span>{formatDate(item.created_at)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Güncelleme:</span>
                                    <span>{formatDate(item.updated_at)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
