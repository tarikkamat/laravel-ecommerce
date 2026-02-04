import StorefrontLayout from '@/layouts/storefront/storefront-layout';
import type { Category, Product, PaginatedData } from '@/types';
import { CategoryHeader } from './components/CategoryHeader';
import { StorefrontProductGrid } from '@/components/storefront-product-grid';

type CategoryProductsPageProps = {
    category: Category;
    products: PaginatedData<Product>;
    sort?: string;
    filters?: {
        brands?: string[];
        price_min?: string | null;
        price_max?: string | null;
        search?: string | null;
    };
    brands?: BrandNode[];
    priceRange?: { min: number; max: number };
};

type BrandNode = {
    id: number;
    title: string;
    slug: string;
};

export default function CategoryProductsPage({
    category,
    products,
    sort,
    filters,
    brands,
    priceRange,
}: CategoryProductsPageProps) {
    return (
        <StorefrontLayout title={`${category.title} Ürünleri`}>
            <div className="w-full">
                {/* Category Header */}
                <CategoryHeader category={category} />

                {/* Products Grid */}
                <StorefrontProductGrid
                    products={products}
                    sort={sort}
                    filters={filters}
                    brands={brands}
                    priceRange={priceRange}
                    emptyDescription="Bu kategoriye ait ürün bulunamadı."
                />
            </div>
        </StorefrontLayout>
    );
}
