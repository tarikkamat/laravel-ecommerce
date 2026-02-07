import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronDown, ChevronRight, Globe, Info, Lock, Pencil, Unlock, UploadCloud, X } from 'lucide-react';
import { type FormEventHandler, useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { LoadingButton } from '@/components/ui/loading-button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WysiwygEditor } from '@/components/ui/wysiwyg';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import type { BreadcrumbItem, CategoryTreeOption, Product, ProductImageData, ProductOptions } from '@/types';

// Category Tree Component
interface CategoryTreeProps {
    categories: CategoryTreeOption[];
    selectedIds: string[];
    onToggle: (id: string) => void;
    level?: number;
    initialExpanded?: Set<number>;
}

function CategoryTree({ categories, selectedIds, onToggle, level = 0, initialExpanded }: CategoryTreeProps) {
    const [expandedIds, setExpandedIds] = useState<Set<number>>(initialExpanded || new Set());

    const toggleExpand = (id: number) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    return (
        <div className={level > 0 ? 'ml-4 border-l pl-2' : ''}>
            {categories.map((category) => {
                const hasChildren = category.children && category.children.length > 0;
                const isExpanded = expandedIds.has(category.value);

                return (
                    <div key={category.value}>
                        <div className="flex items-center gap-1 py-1">
                            {hasChildren ? (
                                <button
                                    type="button"
                                    onClick={() => toggleExpand(category.value)}
                                    className="p-0.5 hover:bg-muted rounded"
                                >
                                    {isExpanded ? (
                                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                                    ) : (
                                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                                    )}
                                </button>
                            ) : (
                                <span className="w-4.5" />
                            )}
                            <Checkbox
                                id={`category-${category.value}`}
                                checked={selectedIds.includes(String(category.value))}
                                onCheckedChange={() => onToggle(String(category.value))}
                            />
                            <label
                                htmlFor={`category-${category.value}`}
                                className="text-sm leading-none cursor-pointer"
                            >
                                {category.label}
                            </label>
                        </div>
                        {hasChildren && isExpanded && (
                            <CategoryTree
                                categories={category.children}
                                selectedIds={selectedIds}
                                onToggle={onToggle}
                                level={level + 1}
                                initialExpanded={initialExpanded}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

interface Props extends ProductOptions {
    item: Product;
}

interface FormData {
    brand_id: string;
    title: string;
    slug: string;
    description: string;
    seo_title: string;
    seo_description: string;
    sku: string;
    price: string;
    sale_price: string;
    stock: string;
    barcode: string;
    skt: string;
    active: boolean;
    comments_enabled: boolean;
    category_ids: string[];
    tag_ids: string[];
    ingredient_ids: string[];
    existing_image_ids: string[];
    image_files: File[];
    image_titles: string[];
    image_slugs: string[];
    image_descriptions: string[];
    image_seo_titles: string[];
    image_seo_descriptions: string[];
    _method?: string;
}

export default function ProductsEdit({ item, brands, categories, tags, ingredients }: Props) {
    const normalizeDateValue = (value?: string | null): string => {
        if (!value) return '';
        return value.slice(0, 10);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: admin.dashboard.index(),
        },
        {
            title: 'Ürünler',
            href: admin.products.index().url,
        },
        {
            title: item.title,
            href: admin.products.show(item.id).url,
        },
        {
            title: 'Düzenle',
            href: admin.products.edit(item.id).url,
        },
    ];

    // Initialize existing images
    const initialImagePreviews: ProductImageData[] = (item.images || []).map((img) => ({
        id: String(img.id),
        preview: `/storage/${img.path}`,
        slug: img.slug,
        title: img.title || '',
        description: img.description || '',
        seo_title: img.seo_title || '',
        seo_description: img.seo_description || '',
        isExisting: true,
    }));

    const [isSlugLocked, setIsSlugLocked] = useState(false);
    const [imagePreviews, setImagePreviews] = useState<ProductImageData[]>(initialImagePreviews);
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
    const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null);
    const [tempImageData, setTempImageData] = useState<ProductImageData | null>(null);
    const [isImageSlugLocked, setIsImageSlugLocked] = useState(true);

    const { data, setData, post, processing, errors } = useForm<FormData>({
        brand_id: String(item.brand_id),
        title: item.title,
        slug: item.slug,
        description: item.description || '',
        seo_title: item.seo_title || '',
        seo_description: item.seo_description || '',
        sku: item.sku,
        price: String(item.price),
        sale_price: item.sale_price ? String(item.sale_price) : '',
        stock: String(item.stock),
        barcode: item.barcode || '',
        skt: normalizeDateValue(item.skt),
        active: item.active,
        comments_enabled: item.comments_enabled ?? true,
        category_ids: (item.category_ids || []).map(String),
        tag_ids: (item.tag_ids || []).map(String),
        ingredient_ids: (item.ingredient_ids || []).map(String),
        existing_image_ids: (item.images || []).map((img) => String(img.id)),
        image_files: [],
        image_titles: [],
        image_slugs: [],
        image_descriptions: [],
        image_seo_titles: [],
        image_seo_descriptions: [],
        _method: 'PUT',
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

    useEffect(() => {
        if (isSlugLocked && data.title) {
            setData('slug', generateSlug(data.title));
        }
    }, [data.title, isSlugLocked]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newImages: ProductImageData[] = [];
        const newFiles: File[] = [...data.image_files];
        const newTitles: string[] = [...data.image_titles];
        const newSlugs: string[] = [...data.image_slugs];
        const newDescriptions: string[] = [...data.image_descriptions];
        const newSeoTitles: string[] = [...data.image_seo_titles];
        const newSeoDescriptions: string[] = [...data.image_seo_descriptions];

        acceptedFiles.forEach((file) => {
            const objectUrl = URL.createObjectURL(file);
            const fileName = file.name.replace(/\.[^/.]+$/, '');
            const slug = generateSlug(fileName);

            newImages.push({
                file,
                preview: objectUrl,
                slug,
                title: fileName,
                description: '',
                seo_title: '',
                seo_description: '',
                isExisting: false,
            });

            newFiles.push(file);
            newTitles.push(fileName);
            newSlugs.push(slug);
            newDescriptions.push('');
            newSeoTitles.push('');
            newSeoDescriptions.push('');
        });

        setImagePreviews((prev) => [...prev, ...newImages]);
        setData((prev) => ({
            ...prev,
            image_files: newFiles,
            image_titles: newTitles,
            image_slugs: newSlugs,
            image_descriptions: newDescriptions,
            image_seo_titles: newSeoTitles,
            image_seo_descriptions: newSeoDescriptions,
        }));
    }, [data, setData]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
        },
        multiple: true,
    });

    const removeImage = (index: number) => {
        const preview = imagePreviews[index];

        if (preview.isExisting) {
            // Remove existing image from existing_image_ids
            setData((prev) => ({
                ...prev,
                existing_image_ids: prev.existing_image_ids.filter((id) => id !== preview.id),
            }));
        } else {
            // For new images, find the correct index in the new images array
            const newImageIndex = imagePreviews
                .slice(0, index)
                .filter((img) => !img.isExisting).length;

            if (preview.preview?.startsWith('blob:')) {
                URL.revokeObjectURL(preview.preview);
            }

            setData((prev) => ({
                ...prev,
                image_files: prev.image_files.filter((_, i) => i !== newImageIndex),
                image_titles: prev.image_titles.filter((_, i) => i !== newImageIndex),
                image_slugs: prev.image_slugs.filter((_, i) => i !== newImageIndex),
                image_descriptions: prev.image_descriptions.filter((_, i) => i !== newImageIndex),
                image_seo_titles: prev.image_seo_titles.filter((_, i) => i !== newImageIndex),
                image_seo_descriptions: prev.image_seo_descriptions.filter((_, i) => i !== newImageIndex),
            }));
        }

        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const openImageDialog = (index: number) => {
        setEditingImageIndex(index);
        setTempImageData({ ...imagePreviews[index] });
        setIsImageSlugLocked(true);
        setIsImageDialogOpen(true);
    };

    const saveImageData = () => {
        if (tempImageData && editingImageIndex !== null) {
            const preview = imagePreviews[editingImageIndex];

            setImagePreviews((prev) => {
                const updated = [...prev];
                updated[editingImageIndex] = tempImageData;
                return updated;
            });

            // Only update form data arrays for new images
            if (!preview.isExisting) {
                const newImageIndex = imagePreviews
                    .slice(0, editingImageIndex)
                    .filter((img) => !img.isExisting).length;

                setData((prev) => {
                    const newTitles = [...prev.image_titles];
                    const newSlugs = [...prev.image_slugs];
                    const newDescriptions = [...prev.image_descriptions];
                    const newSeoTitles = [...prev.image_seo_titles];
                    const newSeoDescriptions = [...prev.image_seo_descriptions];

                    newTitles[newImageIndex] = tempImageData.title;
                    newSlugs[newImageIndex] = tempImageData.slug;
                    newDescriptions[newImageIndex] = tempImageData.description;
                    newSeoTitles[newImageIndex] = tempImageData.seo_title;
                    newSeoDescriptions[newImageIndex] = tempImageData.seo_description;

                    return {
                        ...prev,
                        image_titles: newTitles,
                        image_slugs: newSlugs,
                        image_descriptions: newDescriptions,
                        image_seo_titles: newSeoTitles,
                        image_seo_descriptions: newSeoDescriptions,
                    };
                });
            }
        }
        setIsImageDialogOpen(false);
        setEditingImageIndex(null);
        setTempImageData(null);
    };

    const updateTempImageData = <K extends keyof ProductImageData>(key: K, value: ProductImageData[K]) => {
        if (tempImageData) {
            if (key === 'title' && isImageSlugLocked && typeof value === 'string') {
                setTempImageData({
                    ...tempImageData,
                    [key]: value,
                    slug: generateSlug(value),
                });
            } else {
                setTempImageData({ ...tempImageData, [key]: value });
            }
        }
    };

    const toggleArrayItem = (
        field: 'category_ids' | 'tag_ids' | 'ingredient_ids',
        value: string
    ) => {
        const current = data[field];
        if (current.includes(value)) {
            setData(field, current.filter((id) => id !== value));
        } else {
            setData(field, [...current, value]);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(admin.products.update(item.id).url, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${item.title} - Düzenle`} />

            <div className="flex w-full flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Ürünü Düzenle</h1>
                        <p className="text-muted-foreground">
                            {item.title} ürününün bilgilerini düzenleyin.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" asChild>
                            <Link href={admin.products.show(item.id).url}>Vazgeç</Link>
                        </Button>
                        <LoadingButton onClick={submit} loading={processing}>
                            Kaydet
                        </LoadingButton>
                    </div>
                </div>

                <Separator />

                {/* Form */}
                <form onSubmit={submit} className="space-y-6 max-w-4xl">
                    {/* Temel Bilgi */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Temel Bilgi</CardTitle>
                            <CardDescription>Ürünün temel bilgilerini girin.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Field>
                                <FieldLabel htmlFor="title">Ürün Adı</FieldLabel>
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
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                        <span className="text-sm text-muted-foreground">
                                            suug.istanbul/urunler/
                                        </span>
                                    </div>
                                    <Input
                                        id="slug"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        disabled={isSlugLocked}
                                        className="pl-38"
                                        aria-invalid={!!errors.slug}
                                    />
                                </div>
                                <FieldError>{errors.slug}</FieldError>
                            </Field>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="price">Satış Fiyatı (TL)</FieldLabel>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        aria-invalid={!!errors.price}
                                    />
                                    <FieldError>{errors.price}</FieldError>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="sale_price">İndirimli Fiyat (TL)</FieldLabel>
                                    <Input
                                        id="sale_price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.sale_price}
                                        onChange={(e) => setData('sale_price', e.target.value)}
                                        placeholder="Opsiyonel"
                                        aria-invalid={!!errors.sale_price}
                                    />
                                    <FieldError>{errors.sale_price}</FieldError>
                                </Field>
                            </div>

                            <Field>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="active"
                                        checked={data.active}
                                        onCheckedChange={(checked) =>
                                            setData('active', checked === true)
                                        }
                                    />
                                    <label
                                        htmlFor="active"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Ürün aktif (satışa açık)
                                    </label>
                                </div>
                                <FieldError>{errors.active}</FieldError>
                            </Field>

                            <Field>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="comments_enabled"
                                        checked={data.comments_enabled}
                                        onCheckedChange={(checked) =>
                                            setData('comments_enabled', checked === true)
                                        }
                                    />
                                    <label
                                        htmlFor="comments_enabled"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Yorumlara Açık
                                    </label>
                                </div>
                                <FieldDescription>
                                    Kapalıysa mağaza ürün sayfasında yorum formu görünmez.
                                </FieldDescription>
                                <FieldError>{errors.comments_enabled}</FieldError>
                            </Field>
                        </CardContent>
                    </Card>

                    {/* Medya */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Medya</CardTitle>
                            <CardDescription>Ürün görsellerini yükleyin.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Dropzone */}
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
                                    <p className="text-sm text-primary font-medium">Dosyaları bırakın...</p>
                                ) : (
                                    <>
                                        <p className="text-sm text-muted-foreground text-center">
                                            Sürükle-bırak veya <span className="text-primary font-medium">seçin</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground/70 mt-1">
                                            PNG, JPG, WebP (birden fazla seçebilirsiniz)
                                        </p>
                                    </>
                                )}
                            </div>

                            {/* Image Grid */}
                            {imagePreviews.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                                    {imagePreviews.map((image, index) => (
                                        <div key={image.id || index} className="relative aspect-square group">
                                            <img
                                                src={image.preview}
                                                alt={image.title}
                                                className="w-full h-full object-cover rounded-lg border cursor-pointer"
                                                onClick={() => openImageDialog(index)}
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="sm"
                                                    className="h-7 text-xs"
                                                    onClick={() => openImageDialog(index)}
                                                >
                                                    <Pencil className="h-3 w-3 mr-1" />
                                                    Düzenle
                                                </Button>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-1 right-1 h-5 w-5"
                                                onClick={() => removeImage(index)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                            {image.isExisting && (
                                                <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded">
                                                    Mevcut
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            <FieldDescription>
                                {imagePreviews.filter((img) => img.isExisting).length} mevcut, {imagePreviews.filter((img) => !img.isExisting).length} yeni görsel
                            </FieldDescription>
                        </CardContent>
                    </Card>

                    {/* Ürün Detay */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Ürün Detay</CardTitle>
                            <CardDescription>Ürün detay bilgilerini girin.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Field>
                                <FieldLabel htmlFor="brand_id">Marka</FieldLabel>
                                <Select
                                    value={data.brand_id}
                                    onValueChange={(value) => setData('brand_id', value)}
                                >
                                    <SelectTrigger id="brand_id" aria-invalid={!!errors.brand_id}>
                                        <SelectValue placeholder="Marka seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {brands.map((brand) => (
                                            <SelectItem key={brand.value} value={String(brand.value)}>
                                                {brand.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FieldError>{errors.brand_id}</FieldError>
                            </Field>

                            <Field>
                                <FieldLabel>Etiketler</FieldLabel>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto rounded-md border p-3">
                                    {tags.map((tag) => (
                                        <div key={tag.value} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`tag-${tag.value}`}
                                                checked={data.tag_ids.includes(String(tag.value))}
                                                onCheckedChange={() =>
                                                    toggleArrayItem('tag_ids', String(tag.value))
                                                }
                                            />
                                            <label
                                                htmlFor={`tag-${tag.value}`}
                                                className="text-sm leading-none"
                                            >
                                                {tag.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <FieldDescription>
                                    {data.tag_ids.length} etiket seçildi
                                </FieldDescription>
                                <FieldError>{errors.tag_ids}</FieldError>
                            </Field>

                            <Field>
                                <FieldLabel>Kategoriler</FieldLabel>
                                <div className="max-h-48 overflow-y-auto rounded-md border p-3">
                                    <CategoryTree
                                        categories={categories}
                                        selectedIds={data.category_ids}
                                        onToggle={(id) => toggleArrayItem('category_ids', id)}
                                    />
                                </div>
                                <FieldDescription>
                                    {data.category_ids.length} kategori seçildi
                                </FieldDescription>
                                <FieldError>{errors.category_ids}</FieldError>
                            </Field>

                            <Field>
                                <FieldLabel>İçerikler</FieldLabel>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto rounded-md border p-3">
                                    {ingredients.map((ingredient) => (
                                        <div key={ingredient.value} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`ingredient-${ingredient.value}`}
                                                checked={data.ingredient_ids.includes(String(ingredient.value))}
                                                onCheckedChange={() =>
                                                    toggleArrayItem('ingredient_ids', String(ingredient.value))
                                                }
                                            />
                                            <label
                                                htmlFor={`ingredient-${ingredient.value}`}
                                                className="text-sm leading-none"
                                            >
                                                {ingredient.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <FieldDescription>
                                    {data.ingredient_ids.length} içerik seçildi
                                </FieldDescription>
                                <FieldError>{errors.ingredient_ids}</FieldError>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="description">Ürün Açıklaması</FieldLabel>
                                <WysiwygEditor
                                    value={data.description}
                                    onChange={(value) => setData('description', value)}
                                    placeholder="Ürün açıklamasını HTML olarak yazabilirsiniz."
                                    disabled={processing}
                                />
                                <FieldError>{errors.description}</FieldError>
                            </Field>
                        </CardContent>
                    </Card>

                    {/* Envanter */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Envanter</CardTitle>
                            <CardDescription>Stok ve envanter bilgilerini girin.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-3">
                                <Field>
                                    <FieldLabel htmlFor="sku">SKU</FieldLabel>
                                    <Input
                                        id="sku"
                                        value={data.sku}
                                        onChange={(e) => setData('sku', e.target.value)}
                                        placeholder="URUN-001"
                                        aria-invalid={!!errors.sku}
                                    />
                                    <FieldDescription>Benzersiz stok kodu</FieldDescription>
                                    <FieldError>{errors.sku}</FieldError>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="barcode">Barkod</FieldLabel>
                                    <Input
                                        id="barcode"
                                        value={data.barcode}
                                        onChange={(e) => setData('barcode', e.target.value)}
                                        placeholder="8690000000000"
                                        aria-invalid={!!errors.barcode}
                                    />
                                    <FieldError>{errors.barcode}</FieldError>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="stock">Stok Adedi</FieldLabel>
                                    <Input
                                        id="stock"
                                        type="number"
                                        min="0"
                                        value={data.stock}
                                        onChange={(e) => setData('stock', e.target.value)}
                                        aria-invalid={!!errors.stock}
                                    />
                                    <FieldError>{errors.stock}</FieldError>
                                </Field>
                            </div>
                            <Field>
                                <FieldLabel htmlFor="skt">SKT (Son Kullanım Tarihi)</FieldLabel>
                                <Input
                                    id="skt"
                                    type="text"
                                    value={data.skt}
                                    onChange={(e) => setData('skt', e.target.value)}
                                    placeholder="DD-MM-YYYY"
                                    aria-invalid={!!errors.skt}
                                />
                                <FieldDescription>Boş bırakabilirsiniz.</FieldDescription>
                                <FieldError>{errors.skt}</FieldError>
                            </Field>
                        </CardContent>
                    </Card>

                    {/* SEO */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Arama Motoru Optimizasyonu (SEO)</CardTitle>
                            <CardDescription>Arama motorları için meta bilgilerini girin.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
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
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    aria-invalid={!!errors.seo_description}
                                />
                                <FieldError>{errors.seo_description}</FieldError>
                            </Field>
                        </CardContent>
                    </Card>

                    {/* Sticky Footer */}
                    <div className="flex items-center justify-end gap-2 pt-4 border-t">
                        <Button variant="ghost" asChild>
                            <Link href={admin.products.show(item.id).url}>Vazgeç</Link>
                        </Button>
                        <LoadingButton onClick={submit} loading={processing}>
                            Kaydet
                        </LoadingButton>
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
                                                disabled={tempImageData.isExisting}
                                            />
                                            {tempImageData.isExisting && (
                                                <FieldDescription>Mevcut görsellerin bilgileri düzenlenemez.</FieldDescription>
                                            )}
                                        </Field>

                                        <Field>
                                            <div className="flex items-center justify-between">
                                                <FieldLabel htmlFor="image_slug">Slug</FieldLabel>
                                                {!tempImageData.isExisting && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 px-2 text-xs text-muted-foreground"
                                                        onClick={() => setIsImageSlugLocked(!isImageSlugLocked)}
                                                    >
                                                        {isImageSlugLocked ? (
                                                            <>
                                                                <Lock className="mr-1 h-3 w-3" /> Kilidi Kaldır
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Unlock className="mr-1 h-3 w-3" /> Kilitle
                                                            </>
                                                        )}
                                                    </Button>
                                                )}
                                            </div>
                                            <Input
                                                id="image_slug"
                                                value={tempImageData.slug}
                                                onChange={(e) => updateTempImageData('slug', e.target.value)}
                                                disabled={isImageSlugLocked || tempImageData.isExisting}
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
                                                disabled={tempImageData.isExisting}
                                                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                            />
                                        </Field>
                                    </TabsContent>

                                    <TabsContent value="seo" className="mt-4 space-y-4">
                                        <Field>
                                            <div className="flex items-center justify-between">
                                                <FieldLabel htmlFor="image_seo_title">SEO Başlığı</FieldLabel>
                                                <span
                                                    className={`text-[10px] ${
                                                        tempImageData.seo_title.length > 60
                                                            ? 'text-destructive'
                                                            : 'text-muted-foreground'
                                                    }`}
                                                >
                                                    {tempImageData.seo_title.length} / 60
                                                </span>
                                            </div>
                                            <Input
                                                id="image_seo_title"
                                                value={tempImageData.seo_title}
                                                onChange={(e) => updateTempImageData('seo_title', e.target.value)}
                                                placeholder="SEO başlığı"
                                                disabled={tempImageData.isExisting}
                                            />
                                        </Field>

                                        <Field>
                                            <div className="flex items-center justify-between">
                                                <FieldLabel htmlFor="image_seo_description">SEO Açıklaması</FieldLabel>
                                                <span
                                                    className={`text-[10px] ${
                                                        tempImageData.seo_description.length > 160
                                                            ? 'text-destructive'
                                                            : 'text-muted-foreground'
                                                    }`}
                                                >
                                                    {tempImageData.seo_description.length} / 160
                                                </span>
                                            </div>
                                            <textarea
                                                id="image_seo_description"
                                                value={tempImageData.seo_description}
                                                onChange={(e) => updateTempImageData('seo_description', e.target.value)}
                                                rows={3}
                                                placeholder="SEO açıklaması"
                                                disabled={tempImageData.isExisting}
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
