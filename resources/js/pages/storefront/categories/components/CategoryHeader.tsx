import { Link } from '@inertiajs/react';
import type { Category } from '@/types/category';
import categories from '@/routes/storefront/categories';

type CategoryHeaderProps = {
    category: Category;
};

export function CategoryHeader({ category }: CategoryHeaderProps) {
    return (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="mx-auto max-w-[1440px] px-6 py-12 lg:px-12">
                {/* Breadcrumb */}
                <nav className="mb-6 flex items-center gap-2 text-sm">
                    <Link
                        href={categories.index.url()}
                        className="text-gray-500 hover:text-[#ec135b] dark:text-gray-400"
                    >
                        Kategoriler
                    </Link>
                    {category.parent && (
                        <>
                            <span className="material-symbols-outlined text-[14px] text-gray-400">
                                chevron_right
                            </span>
                            <Link
                                href={categories.products.url(category.parent.slug)}
                                className="text-gray-500 hover:text-[#ec135b] dark:text-gray-400"
                            >
                                {category.parent.title}
                            </Link>
                        </>
                    )}
                    <span className="material-symbols-outlined text-[14px] text-gray-400">
                        chevron_right
                    </span>
                    <span className="font-medium text-[#181113] dark:text-[#f4f0f2]">
                        {category.title}
                    </span>
                </nav>

                {/* Category Info */}
                <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
                    {/* Category Image */}
                    {category.image && (
                        <div className="flex size-24 items-center justify-center overflow-hidden rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-800">
                            <img
                                src={`/storage/${category.image.path}`}
                                alt={category.title}
                                className="h-full w-full object-contain"
                            />
                        </div>
                    )}

                    {/* Category Details */}
                    <div className="flex-1">
                        <h1 className="font-display text-3xl font-bold tracking-tight text-[#181113] dark:text-[#f4f0f2] md:text-4xl">
                            {category.title}
                        </h1>
                        {category.description && (
                            <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-300">
                                {category.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Subcategories */}
                {category.children && category.children.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                        {category.children.map((child) => (
                            <Link
                                key={child.id}
                                href={categories.products.url(child.slug)}
                                className="rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-[#ec135b] hover:text-white dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-[#ec135b]"
                            >
                                {child.title}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
