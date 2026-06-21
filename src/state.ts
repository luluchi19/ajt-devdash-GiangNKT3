// ──────────────────────────────────────────────────────────────
//  state.ts — Application state management (discriminated union)
// ──────────────────────────────────────────────────────────────

import type {
  AppState,
  AsyncState,
  Product,
  Category,
  SortOption,
} from "./types";

// ─── State factory helpers ───────────────────────────────────

export const idle = <T>(): AsyncState<T> => ({ status: "idle" });
export const loading = <T>(): AsyncState<T> => ({ status: "loading" });
export const success = <T>(data: T): AsyncState<T> => ({ status: "success", data });
export const error = <T>(message: string): AsyncState<T> => ({ status: "error", message });

// ─── Initial state ───────────────────────────────────────────

export function createInitialState(): AppState {
  return {
    products: idle<Product[]>(),
    categories: idle<Category[]>(),
    selectedProduct: null,
    searchQuery: "",
    selectedCategory: "",
    sortBy: "default",
    currentView: "list",
  };
}

// ─── State singleton ─────────────────────────────────────────

let appState: AppState = createInitialState();

export function getState(): AppState {
  return appState;
}

export function setState(partial: Partial<AppState>): void {
  appState = { ...appState, ...partial };
}

// ─── Exhaustive narrowing helpers ────────────────────────────

/**
 * Exhaustive check — used in `default` branches of switch
 * statements that narrow a discriminated union.
 * If a new variant is added and not handled, TypeScript will
 * raise a compile-time error here.
 */
export function assertNever(value: never): never {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
}

/**
 * Narrows an AsyncState and returns a rendered description string.
 * Demonstrates **exhaustive narrowing** of the discriminated union.
 */
export function describeAsyncState<T>(
  state: AsyncState<T>,
  dataLabel: string
): string {
  switch (state.status) {
    case "idle":
      return `${dataLabel}: waiting to load.`;
    case "loading":
      return `${dataLabel}: loading…`;
    case "success":
      return `${dataLabel}: loaded successfully.`;
    case "error":
      return `${dataLabel}: error — ${state.message}`;
    default:
      return assertNever(state);
  }
}

// ─── Convenience state updaters ──────────────────────────────

export function setProductsLoading(): void {
  setState({ products: loading<Product[]>() });
}

export function setProductsSuccess(data: Product[]): void {
  setState({ products: success(data) });
}

export function setProductsError(msg: string): void {
  setState({ products: error<Product[]>(msg) });
}

export function setCategoriesSuccess(data: Category[]): void {
  setState({ categories: success(data) });
}

export function setCategoriesError(msg: string): void {
  setState({ categories: error<Category[]>(msg) });
}

export function setSelectedProduct(state: AsyncState<Product> | null): void {
  setState({ selectedProduct: state });
}

export function setSearchQuery(query: string): void {
  setState({ searchQuery: query });
}

export function setSelectedCategory(category: string): void {
  setState({ selectedCategory: category });
}

export function setSortBy(sortBy: SortOption): void {
  setState({ sortBy });
}

export function setView(view: "list" | "detail"): void {
  setState({ currentView: view });
}
