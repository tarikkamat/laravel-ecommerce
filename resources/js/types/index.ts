export type * from './auth';
export type * from './navigation';
export type * from './ui';
export type * from './brand';
export type * from './category';
export type * from './discount';
export type * from './image';
export type * from './ingredient';
export type * from './product';
export type * from './tag';
export type * from './user';
export type * from './page';
export type * from './order';

import type { Auth } from './auth';

export type NavSubCategory = {
    id: number;
    title: string;
    slug: string;
};

export type NavCategory = {
    id: number;
    title: string;
    slug: string;
    image: string | null;
    children: (NavSubCategory & { children: NavSubCategory[] })[];
};

export type NavBrand = {
    id: number;
    title: string;
    slug: string;
    image: string | null;
};

export type SharedData = {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    navCategories: NavCategory[];
    navBrands: NavBrand[];
    storefrontSettings?: {
        site: {
            title: string;
            meta_description: string;
            meta_keywords: string;
            header_logo_path: string;
            header_logo_text: string;
            header_logo_tagline: string;
            footer_logo_path: string;
            footer_logo_text: string;
            footer_description: string;
            footer_copyright: string;
            seller_name: string;
            seller_address: string;
            seller_phone: string;
            seller_email: string;
            whatsapp_enabled: boolean;
            whatsapp_phone: string;
            whatsapp_message: string;
            announcement_enabled: boolean;
            announcement_text: string;
            announcement_speed_seconds: number;
            announcement_background: string;
            announcement_text_color: string;
            footer_bottom_links: { label: string; url: string }[];
            footer_socials: { label: string; url: string }[];
            footer_menus: { title: string; items: { label: string; url: string }[] }[];
        };
        navigation: {
            header_menu: { label: string; url: string }[];
            show_home_link: boolean;
            show_brands_menu: boolean;
            show_categories_menu: boolean;
        };
        home: {
            hero_autoplay_ms: number;
            hero_slides: {
                image_path: string;
                eyebrow?: string;
                title?: string;
                subtitle?: string;
                buttons?: { label: string; url: string; variant?: 'primary' | 'secondary' }[];
            }[];
        };
    };
    [key: string]: unknown;
};

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}
