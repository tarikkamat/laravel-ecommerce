import { Link } from '@inertiajs/react';

type CategoryCardProps = {
    name: string;
    slug: string;
    image?: string;
    href: string;
};

export function CategoryCard({ name, image, href }: CategoryCardProps) {
    return (
        <Link
            href={href}
            className="group flex flex-col items-center gap-3 text-center"
        >
            <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-full bg-gray-100 transition-colors group-hover:bg-gray-200 dark:bg-white/10 dark:group-hover:bg-white/15">
                {image ? (
                    <img
                        src={image}
                        alt={name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <span className="text-2xl font-semibold text-gray-400 dark:text-gray-500">
                        {name.charAt(0).toUpperCase()}
                    </span>
                )}
            </div>
            <span className="text-sm font-medium text-[#181113] transition-colors group-hover:text-[#ec135b] dark:text-[#f4f0f2]">
                {name}
            </span>
        </Link>
    );
}
