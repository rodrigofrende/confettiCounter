import { useState, useEffect, useRef, useCallback } from 'react';

interface UseLazyLoadProps<T> {
  items: T[];
  initialLoadCount?: number;
  loadMoreCount?: number;
  threshold?: number;
}

interface LazyLoadResult<T> {
  visibleItems: T[];
  hasMore: boolean;
  isLoading: boolean;
  loadMore: () => void;
  observerRef: React.RefObject<HTMLDivElement | null>;
}

export function useLazyLoad<T>({
  items,
  initialLoadCount = 10,
  loadMoreCount = 10,
  threshold = 0.1
}: UseLazyLoadProps<T>): LazyLoadResult<T> {
  const [visibleCount, setVisibleCount] = useState(initialLoadCount);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      setIsLoading(true);
      // Simular un pequeño delay para mostrar loading state
      setTimeout(() => {
        setVisibleCount(prev => Math.min(prev + loadMoreCount, items.length));
        setIsLoading(false);
      }, 300);
    }
  }, [hasMore, isLoading, loadMoreCount, items.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold }
    );

    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, isLoading, loadMore, threshold]);

  // Reset visible count when items change significantly
  useEffect(() => {
    if (items.length === 0) {
      setVisibleCount(0);
    } else if (visibleCount > items.length) {
      setVisibleCount(Math.min(initialLoadCount, items.length));
    }
  }, [items.length, initialLoadCount, visibleCount]);

  return {
    visibleItems,
    hasMore,
    isLoading,
    loadMore,
    observerRef
  };
}
