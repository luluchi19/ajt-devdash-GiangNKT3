// ──────────────────────────────────────────────────────────────
//  api.ts — Generic fetch helper + typed API endpoints
// ──────────────────────────────────────────────────────────────

import type {
  Product,
  ProductListResponse,
  CategoryListResponse,
} from "./types";

const BASE_URL = "https://dummyjson.com";

// ─── Generic fetch helper (reusable, typed) ──────────────────

/**
 * fetchJson<T> — a reusable, generic fetch wrapper.
 *
 * - Checks `res.ok` and throws a descriptive error if the request fails.
 * - Returns the parsed JSON typed as `T`.
 * - All callers benefit from compile-time type safety.
 */
export async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status}: ${response.statusText} — ${url}`
    );
  }

  const data: T = await response.json();
  return data;
}

// ─── Typed API endpoints ─────────────────────────────────────

/** Fetch all products (up to `limit`). */
export async function getProducts(limit = 100): Promise<Product[]> {
  const { products } = await fetchJson<ProductListResponse>(
    `${BASE_URL}/products?limit=${limit}`
  );
  return products;
}

/** Fetch a single product by id. */
export async function getProductById(id: number): Promise<Product> {
  return fetchJson<Product>(`${BASE_URL}/products/${id}`);
}

/** Fetch every category slug. */
export async function getCategories(): Promise<CategoryListResponse> {
  return fetchJson<CategoryListResponse>(
    `${BASE_URL}/products/category-list`
  );
}

/**
 * loadInitialData — loads products AND categories **in parallel**
 * using Promise.all.  Both resources are needed before we can
 * render the dashboard.
 */
export async function loadInitialData(): Promise<{
  products: Product[];
  categories: CategoryListResponse;
}> {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);
  return { products, categories };
}
