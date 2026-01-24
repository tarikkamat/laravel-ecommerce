import { Link } from '@inertiajs/react';
import { useState } from 'react';

type ProductCardProps = {
    id: number;
    name: string;
    slug: string;
    price: string | number;
    description?: string;
    image?: string;
    href: string;
    tag?: string;
};

export function ProductCard({
    name,
    price,
    description,
    image,
    href,
    tag,
}: ProductCardProps) {
    const [isFavorite, setIsFavorite] = useState(false);

    return (
        <div className="product-card group relative flex max-w-sm flex-col gap-3">
            <Link href={href} className="block">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-white/5">
                    {/* Tag/Badge */}
                    {tag && (
                        <span className="absolute left-3 top-3 z-10 rounded border border-[#ec135b]/20 bg-[#ec135b]/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#ec135b]">
                            {tag}
                        </span>
                    )}

                    {/* Favorite Button */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setIsFavorite(!isFavorite);
                        }}
                        className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-full bg-white/80 text-[#181113] opacity-0 transition-opacity group-hover:opacity-100 hover:text-[#ec135b] dark:bg-black/40 dark:text-[#f4f0f2] dark:hover:text-[#ec135b]"
                    >
                        <span
                            className={`material-symbols-outlined text-[18px] ${isFavorite ? 'fill-current' : ''}`}
                        >
                            favorite
                        </span>
                    </button>

                    {/* Product Image */}
                    <img
                        alt={name}
                        className="product-img h-full w-full object-cover object-center transition-transform duration-500"
                        src={
                            image ||
                            'https://lh3.googleusercontent.com/aida-public/AB6AXuC2b32zow8CIBt6yIojnjrtjDSR4R9Mk6vMBpUZ8uNYt4TwL_32RHZYP5Fu8qWDlqxOWfPwOcoSfnyBMu4AZNG4nahXookpU_zxIInRNzAGTJ3R9I08drtjbjrFdlmxS1afwSff6l2d-XAh3tE6zOh2Zm1MJQS5AuqSyVNYxa6LFSppNlgjaTNz5gI5MUmrAl3zROxR3rAR1ZP6R3L4mCk_EiaYqMGDd-_SZG199sEFxuXeHpyLZ5RoYtW5WCBH7zC9kWN2ftyStrI'
                        }
                    />

                    {/* Add to Bag Button */}
                    <div className="add-btn absolute bottom-4 left-0 right-0 px-4">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                // Add to bag logic here
                            }}
                            className="w-full rounded-lg bg-[#ec135b] py-3 text-sm font-bold text-white shadow-lg shadow-[#ec135b]/20 hover:bg-[#ec135b]/90"
                        >
                            Add to Bag
                        </button>
                    </div>
                </div>
            </Link>

            {/* Product Info */}
            <div className="flex flex-col gap-1 px-1">
                <div className="flex items-start justify-between">
                    <Link href={href}>
                        <h3 className="text-base font-bold text-[#181113] hover:text-[#ec135b] dark:text-[#f4f0f2]">
                            {name}
                        </h3>
                    </Link>
                    <p className="text-base font-medium text-[#181113] dark:text-[#f4f0f2]">
                        ${typeof price === 'number' ? price.toFixed(2) : price}
                    </p>
                </div>
                {description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}
