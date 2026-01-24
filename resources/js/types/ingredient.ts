export interface IngredientProduct {
    id: number;
    title: string;
    slug: string;
    sku: string | null;
    price: number;
    active: boolean;
}

export interface Ingredient {
    id: number;
    slug: string;
    title: string;
    description: string | null;
    seo_title: string | null;
    seo_description: string | null;
    products: IngredientProduct[];
    products_count?: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface IngredientFormData {
    title: string;
    slug: string;
    description: string;
    seo_title: string;
    seo_description: string;
}
