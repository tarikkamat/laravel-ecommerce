import { Head, Link, router } from '@inertiajs/react';
import { Calendar, ChevronRight, FolderTree, Globe, ImageIcon, Info, Pencil, Trash2 } from 'lucide-react';

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
import { CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import type { BreadcrumbItem, Category } from '@/types';

interface Props {
    item: Category;
}

export default function CategoriesShow({ item }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: admin.dashboard.index(),
        },
        {
            title: 'Kategoriler',
            href: admin.categories.index().url,
        },
        {
            title: item.title,
            href: admin.categories.show(item.id).url,
        },
    ];

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
                                Kategori detaylarını görüntülüyorsunuz.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" asChild>
                            <Link href={admin.categories.index().url}>Kategori Listesine Dön</Link>
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline">
                                    <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                                    Sil
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent size="sm">
                                <AlertDialogHeader>
                                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                                        <Trash2 />
                                    </AlertDialogMedia>
                                    <AlertDialogTitle>Kategoriyi sil?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Bu işlem "{item.title}" kategorisini kalıcı olarak silecektir.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel variant="outline">İptal</AlertDialogCancel>
                                    <AlertDialogAction
                                        variant="destructive"
                                        onClick={() => router.delete(admin.categories.destroy(item.id).url)}
                                    >
                                        Sil
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <Button asChild>
                            <Link href={admin.categories.edit(item.id).url}>
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
                                        <Label className="text-muted-foreground">Kategori Adı</Label>
                                        <p className="text-sm font-medium">{item.title}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">URL Adresi (Slug)</Label>
                                        <p className="text-sm font-medium">
                                            <span className="text-muted-foreground">
                                                suug.istanbul/kategoriler/
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
                        {/* Category Image */}
                        {item.image && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <ImageIcon className="h-4 w-4 text-primary" />
                                    <Label className="font-semibold">Kategori Görseli</Label>
                                </div>
                                <div className="relative">
                                    <img
                                        src={`/storage/${item.image.path}`}
                                        alt={item.image.title || item.title}
                                        className="w-full h-32 object-contain rounded-lg border bg-muted/30"
                                    />
                                    {item.image.title && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1.5 rounded-b-lg truncate">
                                            {item.image.title}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Parent Category */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <FolderTree className="h-4 w-4 text-primary" />
                                <Label className="font-semibold">Üst Kategori</Label>
                            </div>
                            {item.parent ? (
                                <div className="flex items-center gap-2 text-sm">
                                    <Link
                                        href={admin.categories.show(item.parent.id).url}
                                        className="text-primary hover:underline"
                                    >
                                        {item.parent.title}
                                    </Link>
                                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                    <span className="font-medium">{item.title}</span>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">
                                    Ana Kategori (Üst kategori yok)
                                </p>
                            )}
                        </div>

                        {/* Children Categories */}
                        {item.children && item.children.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <FolderTree className="h-4 w-4 text-primary" />
                                    <Label className="font-semibold">
                                        Alt Kategoriler ({item.children.length})
                                    </Label>
                                </div>
                                <div className="space-y-1">
                                    {item.children.map((child) => (
                                        <Link
                                            key={child.id}
                                            href={admin.categories.show(child.id).url}
                                            className="block text-sm text-primary hover:underline"
                                        >
                                            {child.title}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

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
