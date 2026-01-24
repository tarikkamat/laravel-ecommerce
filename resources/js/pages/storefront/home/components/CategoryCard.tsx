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
            className="group flex cursor-pointer flex-col items-center gap-4 text-center"
        >
            <div className="relative aspect-square w-full overflow-hidden rounded-full border border-gray-100 shadow-sm transition-transform duration-500 group-hover:shadow-md dark:border-white/10">
                <div
                    className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{
                        backgroundImage: image
                            ? `url('${image}')`
                            : "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCFmecAfueaK2XXMJNk3_zgprdXK_wWgQ9jpL8b6PBsvJzXVvrjkR44WECVGXf449AjqpuJg3WBvNfnzrV-Dko40W0AYelOO00UuJoeLXJQpJ-xidDkV4c-YMN4_ikr6319yn52-UfxXJRXdwpELjIz5IwrgGdE0ReH890bw0WZWyT4o8O8LFOXbKmYI-fj_4Ibr7PkDFVNIdCyQGbrGzys5FspRKe4eIpLDQBkyStZa6wNP9gNF7ATyfIf0rdY0_AbpXFyGukvOlQ')",
                    }}
                ></div>
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10"></div>
            </div>
            <span className="text-lg font-bold text-[#181113] transition-colors group-hover:text-[#ec135b] dark:text-[#f4f0f2]">
                {name}
            </span>
        </Link>
    );
}
