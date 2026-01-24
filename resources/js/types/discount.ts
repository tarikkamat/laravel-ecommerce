export type DiscountType = 'percentage' | 'fixed_amount';

export interface Discount {
    id: number;
    title: string;
    description: string | null;
    type: DiscountType;
    value: number;
    code: string | null;
    usage_limit: number | null;
    starts_at: string | null;
    ends_at: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface DiscountFormData {
    title: string;
    description: string;
    type: DiscountType;
    value: string;
    code: string;
    usage_limit: string;
    starts_at: string;
    ends_at: string;
}

export interface DiscountTypeOption {
    value: DiscountType;
    label: string;
}
