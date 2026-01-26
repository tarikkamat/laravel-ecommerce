import { Link } from '@inertiajs/react';

interface BrandLogoProps {
    name: string;
    href: string;
    imagePath?: string;
}

export function BrandLogo({ name, href, imagePath }: BrandLogoProps) {
    return (
        <Link
            href={href}
            className="group relative flex h-16 w-32 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-white p-3 shadow-xs transition-all duration-500 hover:-translate-y-1 hover:border-[#ec135b]/20 hover:shadow-lg hover:shadow-[#ec135b]/5 dark:border-white/5 dark:bg-[#181113] md:h-20 md:w-40"
        >
            {/* Hover Background Accent */}
            <div className="absolute inset-0 bg-linear-to-br from-[#ec135b]/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {imagePath ? (
                <img
                    src={`/storage/${imagePath}`}
                    alt={name}
                    className="relative z-10 h-full w-full object-contain opacity-40 grayscale transition-all duration-700 group-hover:scale-110 group-hover:opacity-100 group-hover:grayscale-0 dark:opacity-50"
                />
            ) : (
                <span className="relative z-10 text-center text-xs font-black tracking-widest uppercase text-gray-400 transition-all duration-500 group-hover:text-[#ec135b] dark:text-gray-500 md:text-sm">
                    {name}
                </span>
            )}
        </Link>
    );
}
