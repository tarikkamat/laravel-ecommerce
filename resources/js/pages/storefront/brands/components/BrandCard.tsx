import { Link } from '@inertiajs/react';
import type { Brand } from '@/types';
import brands from '@/routes/storefront/brands';

type BrandCardProps = {
    brand: Brand;
};

export function BrandCard({ brand }: BrandCardProps) {
    return (
        <Link
            href={brands.products.url(brand.slug)}
            className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 transition-all duration-500 hover:-translate-y-1 hover:border-[#ec135b]/20 hover:shadow-2xl hover:shadow-[#ec135b]/10 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-[#ec135b]/30"
        >
            {/* Background Accent Gradient */}
            <div className="absolute inset-0 bg-linear-to-br from-[#ec135b]/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Brand Logo Container */}
            <div className="relative mb-3 flex h-28 w-full items-center justify-center rounded-xl bg-gray-50/50 p-4 transition-colors duration-500 group-hover:bg-white dark:bg-gray-800/50 dark:group-hover:bg-gray-800">
                {brand.image ? (
                    <img
                        src={`/storage/${brand.image.path}`}
                        alt={brand.title}
                        className="h-full max-w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110 dark:mix-blend-normal"
                    />
                ) : (
                    <div className="flex size-16 items-center justify-center rounded-full bg-white shadow-sm dark:bg-gray-700">
                        <span className="text-3xl font-black tracking-tighter text-[#ec135b]">
                            {brand.title?.charAt(0).toUpperCase() || '?'}
                        </span>
                    </div>
                )}
            </div>

            {/* Brand Info */}
            <div className="relative z-10 flex flex-col items-center">
                {brand.description && (
                    <p className="line-clamp-2 min-h-[40px] text-center text-sm leading-relaxed text-gray-500 transition-colors group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300">
                        {brand.description}
                    </p>
                )}
            </div>

            {/* Discover Action */}
            <div className="mt-6 flex translate-y-4 items-center gap-2 text-sm font-bold text-[#ec135b] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="uppercase tracking-widest text-[10px]">Keşfet</span>
                <div className="flex size-6 items-center justify-center rounded-full bg-[#ec135b] text-white">
                    <span className="material-symbols-outlined text-[14px]">
                        arrow_forward
                    </span>
                </div>
            </div>
        </Link>
    );
}
