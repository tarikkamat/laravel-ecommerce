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

import type { Auth } from './auth';

export type SharedData = {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
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
