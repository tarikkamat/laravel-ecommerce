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
            className="group flex h-14 w-28 items-center justify-center rounded-lg border border-gray-200 bg-white p-2 shadow-sm transition-all duration-300 hover:border-[#ec135b]/30 hover:shadow-md dark:border-white/10 dark:bg-[#2A161C] md:h-16 md:w-32"
        >
            {imagePath ? (
                <img
                    src={`/storage/${imagePath}`}
                    alt={name}
                    className="h-full w-full object-contain opacity-60 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                />
            ) : (
                <span className="text-center font-serif text-xs font-black tracking-tighter text-[#181113] opacity-60 transition-all duration-300 group-hover:opacity-100 dark:text-white md:text-sm">
                    {name}
                </span>
            )}
        </Link>
    );
}
