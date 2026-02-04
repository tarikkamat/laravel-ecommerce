import StorefrontLayout from '@/layouts/storefront/storefront-layout';
import type { Brand, Product, PaginatedData } from '@/types';
import { BrandHeader } from './components/BrandHeader';
import { StorefrontProductGrid } from '@/components/storefront-product-grid';

type BrandProductsPageProps = {
    brand: Brand;
    products: PaginatedData<Product>;
    sort?: string;
    filters?: {
        categories?: string[];
        price_min?: string | null;
        price_max?: string | null;
        search?: string | null;
    };
    categories?: CategoryNode[];
    priceRange?: { min: number; max: number };
};

type CategoryNode = {
    id: number;
    title: string;
    slug: string;
    children: CategoryNode[];
};

export default function BrandProductsPage({
    brand,
    products,
    sort,
    filters,
    categories,
    priceRange,
}: BrandProductsPageProps) {
    return (
        <StorefrontLayout title={`${brand.title} Ürünleri`}>
            <div className="w-full">
                {/* Brand Header */}
                <BrandHeader brand={brand} />

                {/* Products Grid */}
                <StorefrontProductGrid
                    products={products}
                    sort={sort}
                    filters={filters}
                    categories={categories}
                    priceRange={priceRange}
                    emptyDescription="Bu markaya ait ürün bulunamadı."
                />
            </div>
        </StorefrontLayout>
    );
}
