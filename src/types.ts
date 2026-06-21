// ──────────────────────────────────────────────────────────────
//  types.ts — All TypeScript interfaces, unions, and utility types
// ──────────────────────────────────────────────────────────────

// ─── API response types (DummyJSON) ──────────────────────────

/** A single product from dummyjson.com/products */
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  tags: string[];
}

/** Paginated list response from dummyjson.com/products */
export interface ProductListResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

/** A product category (just a string slug from the API) */
export type Category = string;

/** Detail-only fields — Utility type (Pick) for the detail view header */
export type ProductSummary = Pick<Product, "id" | "title" | "price" | "thumbnail">;

/** DTO for update payload — Utility type (Partial + Pick) */
export type ProductUpdateDTO = Partial<Pick<Product, "title" | "price" | "description" | "stock">>;

/** Search params — Utility type (Record) */
export type FilterMap = Record<string, string | number | boolean>;

/** Category item shape from the /products/category-list endpoint */
export type CategoryListResponse = Category[];

// ─── Application state (Discriminated Union) ─────────────────

export interface IdleState {
  readonly status: "idle";
}

export interface LoadingState {
  readonly status: "loading";
}

export interface SuccessState<T> {
  readonly status: "success";
  readonly data: T;
}

export interface ErrorState {
  readonly status: "error";
  readonly message: string;
}

/** Discriminated union for any async resource */
export type AsyncState<T> =
  | IdleState
  | LoadingState
  | SuccessState<T>
  | ErrorState;

/** The shape of the full app state */
export interface AppState {
  products: AsyncState<Product[]>;
  categories: AsyncState<Category[]>;
  selectedProduct: AsyncState<Product> | null;
  searchQuery: string;
  selectedCategory: string;
  sortBy: SortOption;
  currentView: "list" | "detail";
}

// ─── Sort / filter helpers ───────────────────────────────────

export type SortOption = "default" | "price-asc" | "price-desc" | "rating" | "name";

export interface SortConfig {
  label: string;
  compareFn: (a: Product, b: Product) => number;
}

/** Maps each SortOption to its config — Utility type (Record) */
export type SortRegistry = Record<SortOption, SortConfig>;
