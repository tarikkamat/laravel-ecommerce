import { useState } from 'react';

type CampaignBanner = {
    id: number;
    image: string;
    title: string;
    link: string;
};

// Placeholder banners - replace with actual data from API
const defaultBanners: CampaignBanner[] = [
    {
        id: 1,
        image: '/images/campaigns/banner-1.jpg',
        title: 'Kampanya 1',
        link: '#',
    },
    {
        id: 2,
        image: '/images/campaigns/banner-2.jpg',
        title: 'Kampanya 2',
        link: '#',
    },
    {
        id: 3,
        image: '/images/campaigns/banner-3.jpg',
        title: 'Kampanya 3',
        link: '#',
    },
];

type CampaignBannersProps = {
    banners?: CampaignBanner[];
};

// Grid class based on banner count
const getGridClass = (count: number): string => {
    switch (count) {
        case 1:
            return 'grid-cols-1';
        case 2:
            return 'grid-cols-1 sm:grid-cols-2';
        default:
            return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
};

// Aspect ratio based on banner count (width/height ratio)
// 3 banners: ~390/180 ≈ 13/6
// 2 banners: ~620/180 ≈ 31/9
// 1 banner: full width, shorter height ~4/1
const getAspectClass = (count: number): string => {
    switch (count) {
        case 1:
            return 'aspect-[4/1]';
        case 2:
            return 'aspect-[31/9]';
        default:
            return 'aspect-[13/6]';
    }
};

export function CampaignBanners({ banners = defaultBanners }: CampaignBannersProps) {
    const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
    const bannerCount = banners.length;

    const handleImageError = (id: number) => {
        setImageErrors((prev) => ({ ...prev, [id]: true }));
    };

    if (bannerCount === 0) return null;

    return (
        <section className="mx-auto w-full max-w-[1440px] px-6 pb-0 pt-6 lg:px-12">
            <div className={`grid ${getGridClass(bannerCount)} gap-1`}>
                {banners.map((banner) => (
                    <a
                        key={banner.id}
                        href={banner.link}
                        className="group relative block overflow-hidden rounded-lg hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className={`${getAspectClass(bannerCount)} bg-gray-200 relative`}>
                            {imageErrors[banner.id] ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                                    <span className="text-white text-lg font-semibold">
                                        {banner.title}
                                    </span>
                                </div>
                            ) : (
                                <img
                                    src={banner.image}
                                    alt={banner.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={() => handleImageError(banner.id)}
                                />
                            )}
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}
