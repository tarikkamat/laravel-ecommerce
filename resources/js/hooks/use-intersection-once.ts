import { useEffect, useRef, useState } from 'react';

type UseIntersectionOnceOptions = IntersectionObserverInit;

export function useIntersectionOnce<T extends Element>(
    options: UseIntersectionOnceOptions = {}
) {
    const ref = useRef<T | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const { root = null, rootMargin = '0px', threshold = 0 } = options;

    useEffect(() => {
        if (isVisible) return;
        if (typeof window === 'undefined') return;
        if (!('IntersectionObserver' in window)) {
            setIsVisible(true);
            return;
        }

        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { root, rootMargin, threshold }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [isVisible, root, rootMargin, threshold]);

    return { ref, isVisible };
}
