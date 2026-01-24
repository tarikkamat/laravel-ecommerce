export interface ImageModel {
    id: number;
    slug: string;
    path: string;
    title: string | null;
    description: string | null;
    seo_title: string | null;
    seo_description: string | null;
    created_at: string;
    updated_at: string;
}

export interface ImageFormData {
    file?: File;
    preview: string;
    slug: string;
    title: string;
    description: string;
    seo_title: string;
    seo_description: string;
}

export interface Brand {
    id: number;
    image_id: number | null;
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

export interface BrandFormData {
    title: string;
    slug: string;
    description: string;
    seo_title: string;
    seo_description: string;
    logo_file?: File | null;
    image_title?: string;
    image_slug?: string;
    image_description?: string;
    image_seo_title?: string;
    image_seo_description?: string;
    // For UI state only
    _image?: ImageFormData | null;
}
