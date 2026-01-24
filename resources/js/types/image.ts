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
