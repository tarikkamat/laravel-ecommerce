export type PageType = 'contract' | 'flat' | 'contact';

export type PageTypeOption = {
    value: PageType;
    label: string;
};

export type Page = {
    id: number;
    title: string;
    slug: string;
    type: PageType;
    content: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    contact_address: string | null;
    seo_title: string | null;
    seo_description: string | null;
    active: boolean;
    created_at?: string | null;
    updated_at?: string | null;
};

export type PageFormData = {
    title: string;
    slug: string;
    type: PageType;
    content: string;
    contact_email?: string | null;
    contact_phone?: string | null;
    contact_address?: string | null;
    seo_title?: string | null;
    seo_description?: string | null;
    active: boolean;
};
