// ──────────────────────────────────────────────────────────────
//  main.ts — Application entry point
// ──────────────────────────────────────────────────────────────

import { loadInitialData } from "./api";
import {
  setProductsLoading,
  setProductsSuccess,
  setProductsError,
  setCategoriesSuccess,
  setCategoriesError,
} from "./state";
import { render } from "./ui";

/**
 * Bootstrap the dashboard:
 * 1. Set the UI to the loading state.
 * 2. Fetch products + categories **in parallel** via Promise.all.
 * 3. On success → update state → render.
 * 4. On failure → update state with error message → render.
 */
async function bootstrap(): Promise<void> {
  setProductsLoading();
  render();

  try {
    const { products, categories } = await loadInitialData();
    setProductsSuccess(products);
    setCategoriesSuccess(categories);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load data";
    setProductsError(message);
    setCategoriesError(message);
  }

  render();
}

// ─── Start ───────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  bootstrap();
});

// Listen for retry events dispatched by the UI error-state button
window.addEventListener("devdash:retry", () => {
  bootstrap();
});
