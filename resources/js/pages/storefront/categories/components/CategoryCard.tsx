import { Link } from '@inertiajs/react';
import type { Category } from '@/types';
import categories from '@/routes/storefront/categories';

type CategoryCardProps = {
    category: Category;
};

export function CategoryCard({ category }: CategoryCardProps) {
    return (
        <Link
            href={categories.products.url(category.slug)}
            className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 transition-all duration-500 hover:-translate-y-1 hover:border-[#ec135b]/20 hover:shadow-2xl hover:shadow-[#ec135b]/10 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-[#ec135b]/30"
        >
            {/* Background Accent Gradient */}
            <div className="absolute inset-0 bg-linear-to-br from-[#ec135b]/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Category Image Container */}
            <div className="relative mb-3 flex h-28 w-full items-center justify-center rounded-xl bg-gray-50/50 p-4 transition-colors duration-500 group-hover:bg-white dark:bg-gray-800/50 dark:group-hover:bg-gray-800">
                {category.image ? (
                    <img
                        src={`/storage/${category.image.path}`}
                        alt={category.title}
                        className="h-full max-w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110 dark:mix-blend-normal"
                    />
                ) : (
                    <div className="flex size-16 items-center justify-center rounded-full bg-white shadow-sm dark:bg-gray-700">
                        <span className="material-symbols-outlined text-3xl text-[#ec135b]">
                            category
                        </span>
                    </div>
                )}
            </div>

            {/* Category Info */}
            <div className="relative z-10 flex flex-col items-center">
                <h3 className="mb-1 text-center text-sm font-bold text-[#181113] dark:text-[#f4f0f2]">
                    {category.title}
                </h3>
                {category.description && (
                    <p className="line-clamp-2 min-h-[40px] text-center text-sm leading-relaxed text-gray-500 transition-colors group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300">
                        {category.description}
                    </p>
                )}
            </div>

            {/* Children Count Badge */}
            {category.children && category.children.length > 0 && (
                <div className="mt-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    {category.children.length} alt kategori
                </div>
            )}

            {/* Discover Action */}
            <div className="mt-6 flex translate-y-4 items-center gap-2 text-sm font-bold text-[#ec135b] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="text-[10px] uppercase tracking-widest">Keşfet</span>
                <div className="flex size-6 items-center justify-center rounded-full bg-[#ec135b] text-white">
                    <span className="material-symbols-outlined text-[14px]">
                        arrow_forward
                    </span>
                </div>
            </div>
        </Link>
    );
}
