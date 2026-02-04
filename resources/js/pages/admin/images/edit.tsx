import { Head, Link, useForm } from '@inertiajs/react';
import { Globe, Image as ImageIcon, Info, Lock, Unlock, UploadCloud, X } from 'lucide-react';
import { type FormEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { Button } from '@/components/ui/button';
import { CardContent, CardHeader } from '@/components/ui/card';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { LoadingButton } from '@/components/ui/loading-button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import type { BreadcrumbItem, ImageModel } from '@/types';

type ImageEditPayload = {
    image_file: File | null;
    slug: string;
    title: string;
    description: string;
    seo_title: string;
    seo_description: string;
    path: string;
};

interface Props {
    item: ImageModel;
}

const getImageUrl = (path: string) => {
    if (!path) {
        return '';
    }
    return path.startsWith('http') ? path : `/storage/${path}`;
};

export default function ImagesEdit({ item }: Props) {
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
        {
            title: 'Düzenle',
            href: admin.images.edit(item.id).url,
        },
    ];

    const initialPreviewUrl = useMemo(() => getImageUrl(item.path), [item.path]);
    const [isSlugLocked, setIsSlugLocked] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialPreviewUrl);

    const { data, setData, put, processing, errors } = useForm<ImageEditPayload>({
        image_file: null,
        slug: item.slug,
        title: item.title || '',
        description: item.description || '',
        seo_title: item.seo_title || '',
        seo_description: item.seo_description || '',
        path: item.path || '',
    });

    const generateSlug = (text: string): string => {
        return text
            .toLowerCase()
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            const fileName = file.name.replace(/\.[^/.]+$/, '');
            const slug = generateSlug(fileName);

            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }

            setPreviewUrl(objectUrl);
            setData(prev => ({
                ...prev,
                image_file: file,
                title: isSlugLocked || !prev.title ? fileName : prev.title,
                slug: isSlugLocked ? slug : prev.slug,
            }));
        }
    }, [isSlugLocked, previewUrl, setData]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.svg', '.webp'],
        },
        maxFiles: 1,
        multiple: false,
    });

    const removeNewImage = () => {
        if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(initialPreviewUrl);
        setData('image_file', null);
    };

    useEffect(() => {
        if (isSlugLocked && data.title) {
            setData('slug', generateSlug(data.title));
        }
    }, [data.title, isSlugLocked]);

    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(admin.images.update(item.id).url, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${item.title || item.slug} - Düzenle`} />

            <div className="flex w-full flex-col gap-6 p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Görseli Düzenle</h1>
                            <p className="text-muted-foreground">
                                {item.title || item.slug} görselinin bilgilerini güncelleyin.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" asChild>
                            <Link href={admin.images.show(item.id).url}>Vazgeç</Link>
                        </Button>
                        <LoadingButton onClick={submit} loading={processing}>
                            Kaydet
                        </LoadingButton>
                    </div>
                </div>

                <Separator />

                <form onSubmit={submit} className="max-w-2xl">
                    <Tabs defaultValue="general">
                        <CardHeader className="pb-0 px-0">
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
                        <CardContent className="pt-6 px-0">
                            <TabsContent value="general" className="mt-0 space-y-5">
                                <Field>
                                    <FieldLabel>Görseli Değiştir</FieldLabel>
                                    <div
                                        {...getRootProps()}
                                        className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                                            isDragActive
                                                ? 'border-primary bg-primary/5'
                                                : 'border-muted-foreground/25 bg-muted/30 hover:border-primary/50 hover:bg-muted/50'
                                        }`}
                                    >
                                        <input {...getInputProps()} />
                                        <UploadCloud className={`h-8 w-8 mb-3 ${isDragActive ? 'text-primary' : 'text-muted-foreground/50'}`} />
                                        {isDragActive ? (
                                            <p className="text-sm text-primary font-medium">Dosyayı bırakın...</p>
                                        ) : (
                                            <>
                                                <p className="text-sm text-muted-foreground text-center">
                                                    Sürükle-bırak veya <span className="text-primary font-medium">seçin</span>
                                                </p>
                                                <p className="text-xs text-muted-foreground/70 mt-1">
                                                    PNG, JPG, WebP veya SVG (tek dosya)
                                                </p>
                                            </>
                                        )}
                                    </div>
                                    <FieldError>{errors.image_file}</FieldError>
                                </Field>

                                {previewUrl ? (
                                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted">
                                        <img
                                            src={previewUrl}
                                            alt={data.title || 'Önizleme'}
                                            className="h-full w-full object-cover"
                                        />
                                        {data.image_file && (
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute right-2 top-2 h-7 w-7"
                                                onClick={removeNewImage}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <ImageIcon className="h-4 w-4" />
                                        Önizleme bulunamadı.
                                    </div>
                                )}

                                <Field>
                                    <FieldLabel htmlFor="title">Görsel Başlığı</FieldLabel>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        aria-invalid={!!errors.title}
                                    />
                                    <FieldError>{errors.title}</FieldError>
                                </Field>

                                <Field>
                                    <div className="flex items-center justify-between">
                                        <FieldLabel htmlFor="slug">Slug</FieldLabel>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 px-2 text-xs text-muted-foreground"
                                            onClick={() => setIsSlugLocked(!isSlugLocked)}
                                        >
                                            {isSlugLocked ? (
                                                <>
                                                    <Lock className="mr-1 h-3 w-3" /> Kilidi Kaldır
                                                </>
                                            ) : (
                                                <>
                                                    <Unlock className="mr-1 h-3 w-3" /> Kilitle
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                    <Input
                                        id="slug"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        disabled={isSlugLocked}
                                        aria-invalid={!!errors.slug}
                                    />
                                    <FieldDescription>
                                        Görselin benzersiz adres anahtarıdır.
                                    </FieldDescription>
                                    <FieldError>{errors.slug}</FieldError>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="description">Açıklama</FieldLabel>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={4}
                                        className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        aria-invalid={!!errors.description}
                                    />
                                    <FieldError>{errors.description}</FieldError>
                                </Field>
                            </TabsContent>

                            <TabsContent value="seo" className="mt-0 space-y-5">
                                <Field>
                                    <div className="flex items-center justify-between">
                                        <FieldLabel htmlFor="seo_title">SEO Başlığı</FieldLabel>
                                        <span
                                            className={`text-[10px] ${
                                                (data.seo_title || '').length > 60
                                                    ? 'text-destructive'
                                                    : 'text-muted-foreground'
                                            }`}
                                        >
                                            {(data.seo_title || '').length} / 60
                                        </span>
                                    </div>
                                    <Input
                                        id="seo_title"
                                        value={data.seo_title || ''}
                                        onChange={(e) => setData('seo_title', e.target.value)}
                                        aria-invalid={!!errors.seo_title}
                                    />
                                    <FieldError>{errors.seo_title}</FieldError>
                                </Field>

                                <Field>
                                    <div className="flex items-center justify-between">
                                        <FieldLabel htmlFor="seo_description">SEO Açıklaması</FieldLabel>
                                        <span
                                            className={`text-[10px] ${
                                                (data.seo_description || '').length > 160
                                                    ? 'text-destructive'
                                                    : 'text-muted-foreground'
                                            }`}
                                        >
                                            {(data.seo_description || '').length} / 160
                                        </span>
                                    </div>
                                    <textarea
                                        id="seo_description"
                                        value={data.seo_description || ''}
                                        onChange={(e) => setData('seo_description', e.target.value)}
                                        rows={3}
                                        className="flex min-h-[90px] w-full rounded-md border border-input bg-transparent px-3 py-2 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        aria-invalid={!!errors.seo_description}
                                    />
                                    <FieldError>{errors.seo_description}</FieldError>
                                </Field>
                            </TabsContent>
                        </CardContent>
                    </Tabs>
                </form>
            </div>
        </AppLayout>
    );
}
