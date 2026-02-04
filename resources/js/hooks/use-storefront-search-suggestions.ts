import { useEffect, useState } from 'react';

type SuggestionProduct = {
    id: number;
    title: string;
    slug: string;
    brand?: string | null;
    image?: string | null;
};

type SuggestionBrand = {
    id: number;
    title: string;
    slug: string;
};

type SuggestionState = {
    products: SuggestionProduct[];
    brands: SuggestionBrand[];
    isLoading: boolean;
    error: string | null;
};

export function useStorefrontSearchSuggestions(term: string) {
    const [state, setState] = useState<SuggestionState>({
        products: [],
        brands: [],
        isLoading: false,
        error: null,
    });

    useEffect(() => {
        const query = term.trim();

        if (query.length < 2) {
            setState((prev) => ({
                ...prev,
                products: [],
                brands: [],
                isLoading: false,
                error: null,
            }));
            return;
        }

        const controller = new AbortController();
        const timer = setTimeout(async () => {
            try {
                setState((prev) => ({ ...prev, isLoading: true, error: null }));
                const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                    },
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error('Arama önerileri yüklenemedi.');
                }

                const payload = (await response.json()) as {
                    products: SuggestionProduct[];
                    brands: SuggestionBrand[];
                };

                setState({
                    products: payload.products ?? [],
                    brands: payload.brands ?? [],
                    isLoading: false,
                    error: null,
                });
            } catch (error) {
                if (error instanceof DOMException && error.name === 'AbortError') {
                    return;
                }
                setState((prev) => ({
                    ...prev,
                    products: [],
                    brands: [],
                    isLoading: false,
                    error: 'Arama önerileri yüklenemedi.',
                }));
            }
        }, 250);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [term]);

    return state;
}
