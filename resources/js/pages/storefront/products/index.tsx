import { Link } from '@inertiajs/react';
import StorefrontLayout from '@/layouts/storefront/storefront-layout';
import type { Product, PaginatedData } from '@/types';
import { StorefrontProductGrid } from '@/components/storefront-product-grid';

type ProductsIndexPageProps = {
    products: PaginatedData<Product>;
    sort?: string;
    filters?: {
        categories?: string[];
        price_min?: string | null;
        price_max?: string | null;
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

export default function ProductsIndexPage({
    products,
    sort,
    filters,
    categories,
    priceRange,
}: ProductsIndexPageProps) {
    return (
        <StorefrontLayout title="Ürünler">
            <div className="w-full">
                {/* Page Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                    <div className="mx-auto max-w-[1440px] px-6 py-12 lg:px-12">
                        {/* Breadcrumb */}
                        <nav className="mb-6 flex items-center gap-2 text-sm">
                            <Link
                                href="/"
                                className="text-gray-500 hover:text-[#ec135b] dark:text-gray-400"
                            >
                                Ana Sayfa
                            </Link>
                            <span className="material-symbols-outlined text-[14px] text-gray-400">
                                chevron_right
                            </span>
                            <span className="font-medium text-[#181113] dark:text-[#f4f0f2]">
                                Ürünler
                            </span>
                        </nav>

                        {/* Title */}
                        <h1 className="font-display text-3xl font-bold tracking-tight text-[#181113] dark:text-[#f4f0f2] md:text-4xl">
                            Tüm Ürünler
                        </h1>
                        <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-300">
                            En yeni ve popüler ürünleri keşfedin
                        </p>
                    </div>
                </div>

                {/* Products Grid Section */}
                <StorefrontProductGrid
                    products={products}
                    sort={sort}
                    filters={filters}
                    categories={categories}
                    priceRange={priceRange}
                />
            </div>
        </StorefrontLayout>
    );
}
