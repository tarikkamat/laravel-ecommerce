export interface Tag {
    id: number;
    title: string;
    description: string | null;
    seo_title: string | null;
    seo_description: string | null;
    slug: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface TagFormData {
    title: string;
    slug: string;
    description: string;
    seo_title: string;
    seo_description: string;
}
