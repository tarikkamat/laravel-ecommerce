import { router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

type SubmitOptions = {
    baseUrl: string;
    query?: Record<string, string>;
    preserveScroll?: boolean;
    search?: string;
};

export function useStorefrontSearch(initialSearch = '') {
    const [search, setSearch] = useState(initialSearch);

    const normalizedSearch = useMemo(() => search.trim(), [search]);

    const withSearch = (query: Record<string, string> = {}) => {
        const nextQuery = { ...query };
        if (normalizedSearch) {
            nextQuery.search = normalizedSearch;
        } else {
            delete nextQuery.search;
        }
        return nextQuery;
    };

    const submitSearch = ({ baseUrl, query = {}, preserveScroll = true, search: override }: SubmitOptions) => {
        const value = (override ?? search).trim();
        const nextQuery = { ...query };
        if (value) {
            nextQuery.search = value;
        } else {
            delete nextQuery.search;
        }

        router.get(baseUrl, nextQuery, { preserveScroll });
    };

    return {
        search,
        setSearch,
        normalizedSearch,
        withSearch,
        submitSearch,
    };
}
