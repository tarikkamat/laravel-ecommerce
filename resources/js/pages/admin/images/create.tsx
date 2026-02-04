import { Head, Link, useForm } from '@inertiajs/react';
import { Globe, Image as ImageIcon, Info, Lock, Unlock, UploadCloud, X } from 'lucide-react';
import { type FormEventHandler, useCallback, useEffect, useRef, useState } from 'react';
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
import type { BreadcrumbItem } from '@/types';

type ImageFormPayload = {
    image_files: File[];
    slug: string;
    title: string;
    description: string;
    seo_title: string;
    seo_description: string;
};

type UploadPreview = {
    file: File;
    preview: string;
    title: string;
    slug: string;
};

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
        title: 'Yeni Görsel',
        href: admin.images.create().url,
    },
];

export default function ImagesCreate() {
    const [isSlugLocked, setIsSlugLocked] = useState(true);
    const [uploads, setUploads] = useState<UploadPreview[]>([]);
    const uploadsRef = useRef<UploadPreview[]>([]);

    const { data, setData, post, processing, errors } = useForm<ImageFormPayload>({
        image_files: [],
        slug: '',
        title: '',
        description: '',
        seo_title: '',
        seo_description: '',
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
        if (!acceptedFiles.length) {
            return;
        }

        const newUploads = acceptedFiles.map((file) => {
            const fileName = file.name.replace(/\.[^/.]+$/, '');
            return {
                file,
                preview: URL.createObjectURL(file),
                title: fileName,
                slug: generateSlug(fileName),
            };
        });

        setUploads((prev) => {
            const next = [...prev, ...newUploads];
            setData('image_files', next.map((item) => item.file));
            if (next.length === 1) {
                setData('title', next[0].title);
                setData('slug', next[0].slug);
            } else {
                setData('title', '');
                setData('slug', '');
            }
            return next;
        });
    }, [setData]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.svg', '.webp'],
        },
        multiple: true,
    });

    const removeImage = (index: number) => {
        setUploads((prev) => {
            const next = [...prev];
            const [removed] = next.splice(index, 1);
            if (removed?.preview) {
                URL.revokeObjectURL(removed.preview);
            }
            setData('image_files', next.map((item) => item.file));
            if (next.length === 1) {
                setData('title', next[0].title);
                setData('slug', next[0].slug);
            } else if (next.length === 0) {
                setData('title', '');
                setData('slug', '');
            }
            return next;
        });
    };

    useEffect(() => {
        if (isSlugLocked && data.title && uploads.length <= 1) {
            setData('slug', generateSlug(data.title));
        }
    }, [data.title, isSlugLocked, uploads.length]);

    useEffect(() => {
        uploadsRef.current = uploads;
    }, [uploads]);

    useEffect(() => {
        return () => {
            uploadsRef.current.forEach((upload) => {
                if (upload.preview) {
                    URL.revokeObjectURL(upload.preview);
                }
            });
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(admin.images.store().url, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Yeni Görsel Yükle" />

            <div className="flex w-full flex-col gap-6 p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Yeni Görsel Yükle</h1>
                            <p className="text-muted-foreground">
                                Galeriye yeni bir görsel ekleyin ve detaylarını girin.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" asChild>
                            <Link href={admin.images.index().url}>Vazgeç</Link>
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
                                    <FieldLabel>Görsel Yükle</FieldLabel>
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
                                                    PNG, JPG, WebP veya SVG (birden fazla seçebilirsiniz)
                                                </p>
                                            </>
                                        )}
                                    </div>
                                    <FieldError>{errors.image_files || errors.image_file}</FieldError>
                                </Field>

                                {uploads.length ? (
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                        {uploads.map((upload, index) => (
                                            <div key={upload.preview} className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted">
                                                <img
                                                    src={upload.preview}
                                                    alt={upload.title}
                                                    className="h-full w-full object-cover"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute right-2 top-2 h-7 w-7"
                                                    onClick={() => removeImage(index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <ImageIcon className="h-4 w-4" />
                                        Önizleme için bir görsel yükleyin.
                                    </div>
                                )}

                                <Field>
                                    <FieldLabel htmlFor="title">Görsel Başlığı</FieldLabel>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        disabled={uploads.length > 1}
                                        aria-invalid={!!errors.title}
                                    />
                                    {uploads.length > 1 && (
                                        <FieldDescription>
                                            Toplu yüklemede başlıklar dosya adına göre otomatik atanır.
                                        </FieldDescription>
                                    )}
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
                                        disabled={isSlugLocked || uploads.length > 1}
                                        aria-invalid={!!errors.slug}
                                    />
                                    <FieldDescription>
                                        {uploads.length > 1
                                            ? 'Toplu yüklemede slug dosya adına göre otomatik atanır.'
                                            : 'Görselin benzersiz adres anahtarıdır.'}
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
