import type { ImageModel } from './image';

export interface Category {
    id: number;
    parent_id: number | null;
    image_id: number | null;
    parent: Category | null;
    children: Category[];
    image: ImageModel | null;
    title: string;
    description: string | null;
    seo_title: string | null;
    seo_description: string | null;
    slug: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface CategoryFormData {
    parent_id: number | null;
    title: string;
    slug: string;
    description: string;
    seo_title: string;
    seo_description: string;
    image_file: File | null;
    image_title: string;
    image_slug: string;
    image_description: string;
    image_seo_title: string;
    image_seo_description: string;
}
