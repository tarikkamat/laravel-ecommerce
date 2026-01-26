import { Link } from '@inertiajs/react';
import StorefrontLayout from '@/layouts/storefront/storefront-layout';
import type { Brand, PaginatedData } from '@/types';
import { BrandsGrid } from './components/BrandsGrid';

type BrandsIndexPageProps = {
    brands: PaginatedData<Brand>;
};

export default function BrandsIndexPage({ brands }: BrandsIndexPageProps) {
    return (
        <StorefrontLayout title="Markalar">
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
                                Markalar
                            </span>
                        </nav>

                        {/* Title */}
                        <h1 className="font-display text-3xl font-bold tracking-tight text-[#181113] dark:text-[#f4f0f2] md:text-4xl">
                            Tüm Markalar
                        </h1>
                        <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-300">
                            En sevdiğiniz markaların ürünlerini keşfedin
                        </p>
                    </div>
                </div>

                {/* Brands Grid Section */}
                <section className="mx-auto max-w-[1440px] px-6 py-10 lg:px-12">
                    <BrandsGrid brands={brands} />
                </section>
            </div>
        </StorefrontLayout>
    );
}
