import { Head, Link, useForm } from '@inertiajs/react';
import { Globe, ImageIcon, Info, Lock, Pencil, Unlock, UploadCloud, X } from 'lucide-react';
import { type FormEventHandler, useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingButton } from '@/components/ui/loading-button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import type { BreadcrumbItem, BrandFormData, ImageFormData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: admin.dashboard.index(),
    },
    {
        title: 'Markalar',
        href: admin.brands.index().url,
    },
    {
        title: 'Yeni Marka',
        href: admin.brands.create().url,
    },
];

export default function BrandsCreate() {
    const [isSlugLocked, setIsSlugLocked] = useState(true);
    const [isImageSlugLocked, setIsImageSlugLocked] = useState(true);
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState<ImageFormData | null>(null);
    const [tempImageData, setTempImageData] = useState<ImageFormData | null>(null);

    const { data, setData, post, processing, errors } = useForm<BrandFormData>({
        title: '',
        slug: '',
        description: '',
        seo_title: '',
        seo_description: '',
        logo_file: null,
        image_title: '',
        image_slug: '',
        image_description: '',
        image_seo_title: '',
        image_seo_description: '',
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

            const newImageData: ImageFormData = {
                file,
                preview: objectUrl,
                slug,
                title: fileName,
                description: '',
                seo_title: '',
                seo_description: '',
            };

            setImagePreview(newImageData);
            setData(prev => ({
                ...prev,
                logo_file: file,
                image_title: fileName,
                image_slug: slug,
                image_description: '',
                image_seo_title: '',
                image_seo_description: '',
            }));
        }
    }, [setData]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.svg', '.webp'],
        },
        maxFiles: 1,
        multiple: false,
    });

    const removeImage = () => {
        if (imagePreview?.preview) {
            URL.revokeObjectURL(imagePreview.preview);
        }
        setImagePreview(null);
        setData(prev => ({
            ...prev,
            logo_file: null,
            image_title: '',
            image_slug: '',
            image_description: '',
            image_seo_title: '',
            image_seo_description: '',
        }));
    };

    const openImageDialog = () => {
        if (imagePreview) {
            setTempImageData({ ...imagePreview });
            setIsImageSlugLocked(true);
            setIsImageDialogOpen(true);
        }
    };

    const saveImageData = () => {
        if (tempImageData) {
            setImagePreview(tempImageData);
            setData(prev => ({
                ...prev,
                image_title: tempImageData.title,
                image_slug: tempImageData.slug,
                image_description: tempImageData.description,
                image_seo_title: tempImageData.seo_title,
                image_seo_description: tempImageData.seo_description,
            }));
        }
        setIsImageDialogOpen(false);
    };

    const updateTempImageData = <K extends keyof ImageFormData>(key: K, value: ImageFormData[K]) => {
        if (tempImageData) {
            if (key === 'title' && isImageSlugLocked && typeof value === 'string') {
                setTempImageData({
                    ...tempImageData,
                    [key]: value,
                    slug: generateSlug(value)
                });
            } else {
                setTempImageData({ ...tempImageData, [key]: value });
            }
        }
    };

    useEffect(() => {
        if (isSlugLocked && data.title) {
            setData('slug', generateSlug(data.title));
        }
    }, [data.title, isSlugLocked]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(admin.brands.store().url, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Yeni Marka Oluştur" />

            <div className="flex w-full flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Yeni Marka Oluştur</h1>
                            <p className="text-muted-foreground ">
                                Katalogunuz için yeni bir marka tanımlayın ve detaylarını girin.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" asChild>
                            <Link href={admin.brands.index().url}>Vazgeç</Link>
                        </Button>
                        <LoadingButton onClick={submit} loading={processing}>
                            Kaydet
                        </LoadingButton>
                    </div>
                </div>

                <Separator />

                {/* Form */}
                <form onSubmit={submit} className="grid gap-6 md:grid-cols-3">
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
                                    <Field>
                                        <FieldLabel htmlFor="title">Marka Adı</FieldLabel>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            autoFocus
                                            aria-invalid={!!errors.title}
                                        />
                                        <FieldError>{errors.title}</FieldError>
                                    </Field>

                                    <Field>
                                        <div className="flex items-center justify-between">
                                            <FieldLabel htmlFor="slug">URL Adresi (Slug)</FieldLabel>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 px-2 text-xs text-muted-foreground"
                                                onClick={() => setIsSlugLocked(!isSlugLocked)}
                                            >
                                                {isSlugLocked ? (
                                                    <><Lock className="mr-1 h-3 w-3" /> Kilidi Kaldır</>
                                                ) : (
                                                    <><Unlock className="mr-1 h-3 w-3" /> Kilitle</>
                                                )}
                                            </Button>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                                <span className="text-sm text-muted-foreground">suug.istanbul/markalar/</span>
                                            </div>
                                            <Input
                                                id="slug"
                                                value={data.slug}
                                                onChange={(e) => setData('slug', e.target.value)}
                                                disabled={isSlugLocked}
                                                className="pl-41"
                                                aria-invalid={!!errors.slug}
                                            />
                                        </div>
                                        <FieldDescription>Bu markanın web sitesindeki benzersiz adresidir.</FieldDescription>
                                        <FieldError>{errors.slug}</FieldError>
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="description">Açıklama</FieldLabel>
                                        <textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows={5}
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
                                            <span className={`text-[10px] ${(data.seo_title || '').length > 60 ? 'text-destructive' : 'text-muted-foreground'}`}>
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
                                            <span className={`text-[10px] ${(data.seo_description || '').length > 160 ? 'text-destructive' : 'text-muted-foreground'}`}>
                                                {(data.seo_description || '').length} / 160
                                            </span>
                                        </div>
                                        <textarea
                                            id="seo_description"
                                            value={data.seo_description || ''}
                                            onChange={(e) => setData('seo_description', e.target.value)}
                                            rows={3}
                                            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                            aria-invalid={!!errors.seo_description}
                                        />
                                        <FieldError>{errors.seo_description}</FieldError>
                                    </Field>
                                </TabsContent>
                            </CardContent>
                        </Tabs>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <ImageIcon className="h-4 w-4 text-primary" />
                            <Label className="font-semibold">Marka Logosu</Label>
                        </div>
                        {imagePreview ? (
                            <div className="relative h-32 group">
                                <img
                                    src={imagePreview.preview}
                                    alt="Logo önizleme"
                                    className="w-full h-full object-contain rounded-lg border bg-muted/30 cursor-pointer"
                                    onClick={openImageDialog}
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        className="h-8"
                                        onClick={openImageDialog}
                                    >
                                        <Pencil className="h-3 w-3 mr-1.5" />
                                        Düzenle
                                    </Button>
                                </div>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-1.5 right-1.5 h-6 w-6"
                                    onClick={removeImage}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                                {imagePreview.title && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1.5 rounded-b-lg truncate">
                                        {imagePreview.title}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div
                                {...getRootProps()}
                                className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors h-32 ${isDragActive
                                    ? 'border-primary bg-primary/5'
                                    : 'border-muted-foreground/25 bg-muted/30 hover:border-primary/50 hover:bg-muted/50'
                                    }`}
                            >
                                <input {...getInputProps()} />
                                <UploadCloud className={`h-6 w-6 mb-2 ${isDragActive ? 'text-primary' : 'text-muted-foreground/50'}`} />
                                {isDragActive ? (
                                    <p className="text-xs text-primary font-medium">Dosyayı bırakın...</p>
                                ) : (
                                    <>
                                        <p className="text-xs text-muted-foreground text-center">
                                            Sürükle-bırak veya <span className="text-primary font-medium">seçin</span>
                                        </p>
                                        <p className="text-[10px] text-muted-foreground/70 mt-1">
                                            PNG, JPG, SVG, WebP (max 5MB)
                                        </p>
                                    </>
                                )}
                            </div>
                        )}
                        <FieldError>{errors.logo_file}</FieldError>
                    </div>
                </form>

                {/* Image Edit Dialog */}
                <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Görsel Bilgilerini Düzenle</DialogTitle>
                            <DialogDescription>
                                Görselin başlık, açıklama ve SEO bilgilerini düzenleyin.
                            </DialogDescription>
                        </DialogHeader>

                        {tempImageData && (
                            <div className="grid gap-4 py-4">
                                {/* Image Preview */}
                                <div className="flex justify-center">
                                    <img
                                        src={tempImageData.preview}
                                        alt="Önizleme"
                                        className="max-h-32 object-contain rounded-lg border bg-muted/30"
                                    />
                                </div>

                                <Tabs defaultValue="general" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="general">
                                            <Info className="mr-1.5 h-3.5 w-3.5" />
                                            Genel
                                        </TabsTrigger>
                                        <TabsTrigger value="seo">
                                            <Globe className="mr-1.5 h-3.5 w-3.5" />
                                            SEO
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="general" className="mt-4 space-y-4">
                                        <Field>
                                            <FieldLabel htmlFor="image_title">Başlık</FieldLabel>
                                            <Input
                                                id="image_title"
                                                value={tempImageData.title}
                                                onChange={(e) => updateTempImageData('title', e.target.value)}
                                                placeholder="Görsel başlığı"
                                            />
                                        </Field>

                                        <Field>
                                            <div className="flex items-center justify-between">
                                                <FieldLabel htmlFor="image_slug">Slug</FieldLabel>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 px-2 text-xs text-muted-foreground"
                                                    onClick={() => setIsImageSlugLocked(!isImageSlugLocked)}
                                                >
                                                    {isImageSlugLocked ? (
                                                        <><Lock className="mr-1 h-3 w-3" /> Kilidi Kaldır</>
                                                    ) : (
                                                        <><Unlock className="mr-1 h-3 w-3" /> Kilitle</>
                                                    )}
                                                </Button>
                                            </div>
                                            <Input
                                                id="image_slug"
                                                value={tempImageData.slug}
                                                onChange={(e) => updateTempImageData('slug', e.target.value)}
                                                disabled={isImageSlugLocked}
                                                placeholder="gorsel-slug"
                                            />
                                            <FieldDescription>Görsel başlığından otomatik oluşturulur.</FieldDescription>
                                        </Field>

                                        <Field>
                                            <FieldLabel htmlFor="image_description">Açıklama</FieldLabel>
                                            <textarea
                                                id="image_description"
                                                value={tempImageData.description}
                                                onChange={(e) => updateTempImageData('description', e.target.value)}
                                                rows={3}
                                                placeholder="Görsel açıklaması (alt text olarak da kullanılır)"
                                                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                            />
                                        </Field>
                                    </TabsContent>

                                    <TabsContent value="seo" className="mt-4 space-y-4">
                                        <Field>
                                            <div className="flex items-center justify-between">
                                                <FieldLabel htmlFor="image_seo_title">SEO Başlığı</FieldLabel>
                                                <span className={`text-[10px] ${tempImageData.seo_title.length > 60 ? 'text-destructive' : 'text-muted-foreground'}`}>
                                                    {tempImageData.seo_title.length} / 60
                                                </span>
                                            </div>
                                            <Input
                                                id="image_seo_title"
                                                value={tempImageData.seo_title}
                                                onChange={(e) => updateTempImageData('seo_title', e.target.value)}
                                                placeholder="SEO başlığı"
                                            />
                                        </Field>

                                        <Field>
                                            <div className="flex items-center justify-between">
                                                <FieldLabel htmlFor="image_seo_description">SEO Açıklaması</FieldLabel>
                                                <span className={`text-[10px] ${tempImageData.seo_description.length > 160 ? 'text-destructive' : 'text-muted-foreground'}`}>
                                                    {tempImageData.seo_description.length} / 160
                                                </span>
                                            </div>
                                            <textarea
                                                id="image_seo_description"
                                                value={tempImageData.seo_description}
                                                onChange={(e) => updateTempImageData('seo_description', e.target.value)}
                                                rows={3}
                                                placeholder="SEO açıklaması"
                                                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                            />
                                        </Field>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        )}

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsImageDialogOpen(false)}>
                                İptal
                            </Button>
                            <Button type="button" onClick={saveImageData}>
                                Kaydet
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
