export interface Category {
    id: number;
    parent_id: number | null;
    parent: Category | null;
    children: Category[];
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
}
