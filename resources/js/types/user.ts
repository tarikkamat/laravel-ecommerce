export type Role = 'admin' | 'customer';

export type AddressType = 'billing' | 'shipping';

export interface Address {
    id: number;
    user_id: number;
    type: AddressType;
    address: string;
    zip_code: string | null;
    contact_name: string | null;
    city: string | null;
    country: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    role: Role;
    addresses: Address[];
    two_factor_confirmed_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface UserFormData {
    name: string;
    email: string;
    password: string;
    role: Role;
}

export interface RoleOption {
    value: Role;
    label: string;
}
