import { Link } from '@inertiajs/react';
import type { Brand } from '@/types/brand';
import brands from '@/routes/storefront/brands';

type BrandHeaderProps = {
    brand: Brand;
};

export function BrandHeader({ brand }: BrandHeaderProps) {
    return (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="mx-auto max-w-[1440px] px-6 py-12 lg:px-12">
                {/* Breadcrumb */}
                <nav className="mb-6 flex items-center gap-2 text-sm">
                    <Link
                        href={brands.index.url()}
                        className="text-gray-500 hover:text-[#ec135b] dark:text-gray-400"
                    >
                        Markalar
                    </Link>
                    <span className="material-symbols-outlined text-[14px] text-gray-400">
                        chevron_right
                    </span>
                    <span className="font-medium text-[#181113] dark:text-[#f4f0f2]">
                        {brand.title}
                    </span>
                </nav>

                {/* Brand Info */}
                <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
                    {/* Brand Logo */}
                    {brand.image && (
                        <div className="flex size-24 items-center justify-center overflow-hidden rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-800">
                            <img
                                src={`/storage/${brand.image.path}`}
                                alt={brand.title}
                                className="h-full w-full object-contain"
                            />
                        </div>
                    )}

                    {/* Brand Details */}
                    <div className="flex-1">
                        <h1 className="font-display text-3xl font-bold tracking-tight text-[#181113] dark:text-[#f4f0f2] md:text-4xl">
                            {brand.title}
                        </h1>
                        {brand.description && (
                            <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-300">
                                {brand.description}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
