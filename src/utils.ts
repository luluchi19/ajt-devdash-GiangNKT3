// ──────────────────────────────────────────────────────────────
//  utils.ts — Memoize, debounce, and pure helpers
// ──────────────────────────────────────────────────────────────

import type { Product, SortOption, SortRegistry } from "./types";

// ─── Debounce (closure) ──────────────────────────────────────

/**
 * Returns a debounced version of `fn`.
 * Uses a **closure** to capture the timer id.
 */
export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delayMs: number
): (...args: Parameters<T>) => void {
  let timerId: ReturnType<typeof setTimeout> | undefined;

  return (...args: Parameters<T>): void => {
    if (timerId !== undefined) clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), delayMs);
  };
}

// ─── Memoize (closure + generic with constraint) ─────────────

/**
 * Generic memoization cache — a **generic class** with a constraint.
 *
 * `K` must be usable as a Map key (string | number).
 * Stores computed results and returns cached values on subsequent lookups.
 */
export class MemoCache<K extends string | number, V> {
  private readonly cache = new Map<K, V>();

  get(key: K): V | undefined {
    return this.cache.get(key);
  }

  set(key: K, value: V): void {
    this.cache.set(key, value);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }
}

/**
 * Memoize a function with a **string key**.
 * Uses a closure to hold the MemoCache instance.
 */
export function memoize<A extends string, R>(
  fn: (arg: A) => R
): (arg: A) => R {
  const cache = new MemoCache<A, R>();

  return (arg: A): R => {
    if (cache.has(arg)) {
      return cache.get(arg) as R;
    }
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}

// ─── Sort registry (Record utility type) ─────────────────────

export const SORT_OPTIONS: SortRegistry = {
  default: {
    label: "Default",
    compareFn: () => 0,
  },
  "price-asc": {
    label: "Price ↑",
    compareFn: (a: Product, b: Product) => a.price - b.price,
  },
  "price-desc": {
    label: "Price ↓",
    compareFn: (a: Product, b: Product) => b.price - a.price,
  },
  rating: {
    label: "Rating ★",
    compareFn: (a: Product, b: Product) => b.rating - a.rating,
  },
  name: {
    label: "Name A-Z",
    compareFn: (a: Product, b: Product) => a.title.localeCompare(b.title),
  },
};

// ─── Filter / search helpers (HOF: filter + map) ─────────────

/** Filter products by search query (case-insensitive). */
export const filterBySearch = (products: Product[], query: string): Product[] =>
  products.filter(({ title, description, brand }) => {
    const q = query.toLowerCase();
    return (
      title.toLowerCase().includes(q) ||
      description.toLowerCase().includes(q) ||
      (brand ?? "").toLowerCase().includes(q)
    );
  });

/** Memoized version of search filtering (uses the memoize closure). */
export const memoizedFilter = memoize(
  (key: string): string => key // identity — the actual filtering happens outside; this memoizes the cache key check
);

/** Filter products by category. */
export const filterByCategory = (
  products: Product[],
  category: string
): Product[] =>
  category === "" ? products : products.filter((p) => p.category === category);

/** Sort products using the sort registry. */
export const sortProducts = (
  products: Product[],
  sortBy: SortOption
): Product[] => {
  const { compareFn } = SORT_OPTIONS[sortBy];
  return [...products].sort(compareFn);
};

/**
 * Full pipeline: search → filter → sort.
 * Composed from pure higher-order functions.
 */
export const applyFilters = (
  products: Product[],
  query: string,
  category: string,
  sortBy: SortOption
): Product[] => {
  const searched = filterBySearch(products, query);
  const filtered = filterByCategory(searched, category);
  return sortProducts(filtered, sortBy);
};

// ─── Formatting helpers ──────────────────────────────────────

export const formatPrice = (price: number): string =>
  `$${price.toFixed(2)}`;

export const formatRating = (rating: number): string =>
  `${"★".repeat(Math.round(rating))}${"☆".repeat(5 - Math.round(rating))}`;

export const truncate = (text: string, max: number): string =>
  text.length > max ? `${text.slice(0, max)}…` : text;
