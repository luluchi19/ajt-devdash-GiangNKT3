// ──────────────────────────────────────────────────────────────
//  ui.ts — Render functions for every view / state
// ──────────────────────────────────────────────────────────────

import type {
  Product,
  Category,
  AsyncState,
  SortOption,
} from "./types";
import {
  getState,
  setSearchQuery,
  setSelectedCategory,
  setSortBy,
  setView,
  setSelectedProduct,
  loading,
  success,
  error,
} from "./state";
import { getProductById } from "./api";
import {
  applyFilters,
  formatPrice,
  formatRating,
  truncate,
  SORT_OPTIONS,
  debounce,
} from "./utils";

// ─── DOM helpers ─────────────────────────────────────────────

function $(selector: string): HTMLElement {
  const el = document.querySelector<HTMLElement>(selector);
  if (!el) throw new Error(`Element not found: ${selector}`);
  return el;
}

// ─── Main render dispatcher ──────────────────────────────────

export function render(): void {
  const state = getState();
  const app = $("#app");

  if (state.currentView === "detail" && state.selectedProduct !== null) {
    renderDetailView(app, state.selectedProduct);
    return;
  }

  renderListView(app, state.products, state.categories);
}

// ─── List view ───────────────────────────────────────────────

function renderListView(
  container: HTMLElement,
  productsState: AsyncState<Product[]>,
  categoriesState: AsyncState<Category[]>
): void {
  const state = getState();

  // Exhaustive narrowing of the discriminated union
  switch (productsState.status) {
    case "idle":
    case "loading":
      container.innerHTML = renderLoading();
      return;

    case "error":
      container.innerHTML = renderError(productsState.message);
      return;

    case "success": {
      const allProducts = productsState.data;
      const categories =
        categoriesState.status === "success" ? categoriesState.data : [];

      const filtered = applyFilters(
        allProducts,
        state.searchQuery,
        state.selectedCategory,
        state.sortBy
      );

      container.innerHTML = `
        <header class="header">
          <div class="header-inner">
            <h1 class="logo">
              <span class="logo-icon">⚡</span> DevDash
            </h1>
            <p class="subtitle">Typed Async Product Dashboard</p>
          </div>
        </header>

        <section class="controls" id="controls">
          ${renderControls(categories, state.searchQuery, state.selectedCategory, state.sortBy)}
        </section>

        <p class="result-count">${filtered.length} product${filtered.length !== 1 ? "s" : ""} found</p>

        <section class="product-grid" id="product-grid">
          ${filtered.length > 0
            ? filtered.map((p) => renderProductCard(p)).join("")
            : `<div class="empty-state">
                 <span class="empty-icon">🔍</span>
                 <p>No products match your filters.</p>
               </div>`
          }
        </section>
      `;

      attachListListeners();
      return;
    }
  }
}

// ─── Controls (search, filter, sort) ─────────────────────────

function renderControls(
  categories: Category[],
  query: string,
  selectedCategory: string,
  sortBy: SortOption
): string {
  const categoryOptions = categories
    .map(
      (cat) =>
        `<option value="${cat}" ${cat === selectedCategory ? "selected" : ""}>${cat}</option>`
    )
    .join("");

  const sortOptionEntries = (Object.entries(SORT_OPTIONS) as [SortOption, { label: string }][])
    .map(
      ([key, { label }]) =>
        `<option value="${key}" ${key === sortBy ? "selected" : ""}>${label}</option>`
    )
    .join("");

  return `
    <div class="control-group">
      <div class="search-wrapper">
        <span class="search-icon">🔎</span>
        <input
          type="text"
          id="search-input"
          class="search-input"
          placeholder="Search products…"
          value="${query}"
          autocomplete="off"
        />
      </div>

      <select id="category-select" class="select-input">
        <option value="">All Categories</option>
        ${categoryOptions}
      </select>

      <select id="sort-select" class="select-input">
        ${sortOptionEntries}
      </select>
    </div>
  `;
}

// ─── Product card ────────────────────────────────────────────

function renderProductCard(product: Product): string {
  const { id, title, price, rating, thumbnail, category, brand, discountPercentage } = product;
  const discountedPrice = price * (1 - discountPercentage / 100);

  return `
    <article class="card" data-id="${id}">
      <div class="card-img-wrapper">
        <img
          class="card-img"
          src="${thumbnail}"
          alt="${title}"
          loading="lazy"
        />
        ${discountPercentage > 5
          ? `<span class="badge badge-discount">-${Math.round(discountPercentage)}%</span>`
          : ""
        }
      </div>
      <div class="card-body">
        <span class="card-category">${category}</span>
        <h2 class="card-title">${truncate(title, 45)}</h2>
        <p class="card-brand">${brand ?? "No brand"}</p>
        <div class="card-footer">
          <div class="card-pricing">
            <span class="card-price">${formatPrice(discountedPrice)}</span>
            ${discountPercentage > 5
              ? `<span class="card-price-original">${formatPrice(price)}</span>`
              : ""
            }
          </div>
          <span class="card-rating">${formatRating(rating)} <small>${rating.toFixed(1)}</small></span>
        </div>
      </div>
    </article>
  `;
}

// ─── Detail view ─────────────────────────────────────────────

function renderDetailView(
  container: HTMLElement,
  productState: AsyncState<Product>
): void {
  // Exhaustive narrowing
  switch (productState.status) {
    case "idle":
    case "loading":
      container.innerHTML = `
        <header class="header">
          <div class="header-inner">
            <h1 class="logo"><span class="logo-icon">⚡</span> DevDash</h1>
          </div>
        </header>
        ${renderLoading()}
      `;
      return;

    case "error":
      container.innerHTML = `
        <header class="header">
          <div class="header-inner">
            <h1 class="logo"><span class="logo-icon">⚡</span> DevDash</h1>
          </div>
        </header>
        ${renderError(productState.message)}
        <button class="btn btn-back" id="back-btn">← Back to list</button>
      `;
      attachBackButton();
      return;

    case "success": {
      const p = productState.data;
      const discountedPrice = p.price * (1 - p.discountPercentage / 100);

      container.innerHTML = `
        <header class="header">
          <div class="header-inner">
            <button class="btn btn-back" id="back-btn">← Back</button>
            <h1 class="logo"><span class="logo-icon">⚡</span> DevDash</h1>
          </div>
        </header>

        <section class="detail">
          <div class="detail-gallery">
            <img class="detail-hero" src="${p.images[0] ?? p.thumbnail}" alt="${p.title}" id="detail-hero" />
            <div class="detail-thumbs">
              ${p.images
                .map(
                  (img, i) =>
                    `<img class="detail-thumb ${i === 0 ? "active" : ""}" src="${img}" alt="Image ${i + 1}" data-src="${img}" />`
                )
                .join("")}
            </div>
          </div>

          <div class="detail-info">
            <span class="card-category">${p.category}</span>
            <h2 class="detail-title">${p.title}</h2>
            <p class="detail-brand">by ${p.brand ?? "Unknown"}</p>

            <div class="detail-rating">
              ${formatRating(p.rating)}
              <span>${p.rating.toFixed(1)} / 5</span>
            </div>

            <div class="detail-pricing">
              <span class="detail-price">${formatPrice(discountedPrice)}</span>
              ${p.discountPercentage > 5
                ? `<span class="detail-price-original">${formatPrice(p.price)}</span>
                   <span class="badge badge-discount">-${Math.round(p.discountPercentage)}%</span>`
                : ""
              }
            </div>

            <p class="detail-description">${p.description}</p>

            <div class="detail-meta">
              <div class="meta-item">
                <span class="meta-label">Stock</span>
                <span class="meta-value ${p.stock < 10 ? "low-stock" : ""}">${p.stock} units</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Tags</span>
                <span class="meta-value">${p.tags.map((t) => `<span class="tag">${t}</span>`).join(" ")}</span>
              </div>
            </div>
          </div>
        </section>
      `;

      attachBackButton();
      attachThumbnailListeners();
      return;
    }
  }
}

// ─── Loading / error states ──────────────────────────────────

function renderLoading(): string {
  return `
    <div class="state-container">
      <div class="spinner"></div>
      <p class="state-text">Loading data…</p>
    </div>
  `;
}

function renderError(message: string): string {
  return `
    <div class="state-container state-error">
      <span class="error-icon">⚠️</span>
      <p class="state-text">Something went wrong</p>
      <p class="error-detail">${message}</p>
      <button class="btn btn-retry" id="retry-btn">Try again</button>
    </div>
  `;
}

// ─── Event listeners ─────────────────────────────────────────

function attachListListeners(): void {
  // Search (debounced)
  const searchInput = document.getElementById("search-input") as HTMLInputElement | null;
  if (searchInput) {
    const debouncedSearch = debounce((value: string) => {
      setSearchQuery(value);
      render();
    }, 300);

    searchInput.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      debouncedSearch(target.value);
    });
  }

  // Category filter
  const categorySelect = document.getElementById("category-select") as HTMLSelectElement | null;
  if (categorySelect) {
    categorySelect.addEventListener("change", (e: Event) => {
      const target = e.target as HTMLSelectElement;
      setSelectedCategory(target.value);
      render();
    });
  }

  // Sort
  const sortSelect = document.getElementById("sort-select") as HTMLSelectElement | null;
  if (sortSelect) {
    sortSelect.addEventListener("change", (e: Event) => {
      const target = e.target as HTMLSelectElement;
      setSortBy(target.value as SortOption);
      render();
    });
  }

  // Card clicks → detail view
  const cards = document.querySelectorAll<HTMLElement>(".card");
  cards.forEach((card) => {
    card.addEventListener("click", async () => {
      const id = Number(card.dataset.id);
      if (isNaN(id)) return;

      setView("detail");
      setSelectedProduct(loading<Product>());
      render();

      try {
        const product = await getProductById(id);
        setSelectedProduct(success(product));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setSelectedProduct(error<Product>(message));
      }
      render();
    });
  });

  // Retry button (if error)
  attachRetryButton();
}

function attachBackButton(): void {
  const backBtn = document.getElementById("back-btn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      setView("list");
      setSelectedProduct(null);
      render();
    });
  }
}

function attachRetryButton(): void {
  const retryBtn = document.getElementById("retry-btn");
  if (retryBtn) {
    retryBtn.addEventListener("click", () => {
      // Re-trigger the initial load from main.ts
      window.dispatchEvent(new CustomEvent("devdash:retry"));
    });
  }
}

function attachThumbnailListeners(): void {
  const thumbs = document.querySelectorAll<HTMLImageElement>(".detail-thumb");
  const hero = document.getElementById("detail-hero") as HTMLImageElement | null;

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      if (!hero) return;
      hero.src = thumb.dataset.src ?? thumb.src;
      thumbs.forEach((t) => t.classList.remove("active"));
      thumb.classList.add("active");
    });
  });
}
