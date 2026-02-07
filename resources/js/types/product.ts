import type { Brand } from './brand';
import type { Category } from './category';
import type { ImageModel } from './image';
import type { Ingredient } from './ingredient';
import type { Tag } from './tag';

export interface Product {
    id: number;
    brand_id: number;
    brand: Brand | null;
    slug: string;
    title: string;
    description: string | null;
    seo_title: string | null;
    seo_description: string | null;
    sku: string;
    price: number;
    sale_price: number | null;
    stock: number;
    barcode: string | null;
    skt: string | null;
    active: boolean;
    views_count?: number;
    categories: Category[];
    tags: Tag[];
    images: ImageModel[];
    ingredients: Ingredient[];
    category_ids?: number[];
    tag_ids?: number[];
    image_ids?: number[];
    ingredient_ids?: number[];
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface ProductImageData {
    id?: string;
    file?: File;
    preview: string;
    slug: string;
    title: string;
    description: string;
    seo_title: string;
    seo_description: string;
    isExisting?: boolean;
}

export interface ProductFormData {
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
    category_ids: string[];
    tag_ids: string[];
    ingredient_ids: string[];
    images: ProductImageData[];
}

export interface SelectOption {
    value: number;
    label: string;
}

export interface CategoryTreeOption {
    value: number;
    label: string;
    children: CategoryTreeOption[];
}

export interface ProductOptions {
    brands: SelectOption[];
    categories: CategoryTreeOption[];
    tags: SelectOption[];
    ingredients: SelectOption[];
}
