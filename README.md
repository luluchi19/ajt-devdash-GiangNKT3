# ⚡ DevDash — Typed Async Product Dashboard

A single-page TypeScript dashboard that loads product data from [DummyJSON API](https://dummyjson.com/), with search, filtering, sorting, and detail views. Built with **Vite** + **TypeScript** (`strict: true`).

![DevDash Screenshot](https://via.placeholder.com/800x400?text=DevDash+Dashboard)

---

## 🚀 Live Demo

> **[🔗 Live Demo on GitHub Pages](https://luluchi19.github.io/ajt-devdash-GiangNKT3/)**

---

## 📦 Local Setup

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Install & Run

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/ajt-devdash.git
cd ajt-devdash

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview   # preview the production build locally
```

---

## ✨ Features

### Pass Tier (6.0 pts)

| Criterion | Status |
|---|---|
| Project compiles with `"strict": true` and no type errors | ✅ |
| Domain data modelled with `interface` types (no `any` for fetched data) | ✅ |
| Fetches and renders a list using `async/await` | ✅ |
| Functions and parameters are correctly type-annotated | ✅ |
| `try/catch` error handling with a visible error state | ✅ |
| A detail view shows a single item by id | ✅ |

### Good Tier (8.0 pts)

| Criterion | Status |
|---|---|
| Search/filter/sort implemented with higher-order functions (`filter`, `map`, `sort`) | ✅ |
| A reusable **generic** `fetchJson<T>` helper used across the app | ✅ |
| `Promise.all` to load products + categories in parallel | ✅ |
| Application state modelled with a **union/literal type** (idle/loading/success/error) | ✅ |

### Excellent Tier (10.0 pts)

| Criterion | Status |
|---|---|
| A **discriminated union** drives state and is exhaustively narrowed (`assertNever`) | ✅ |
| **Utility types** (`Pick`, `Partial`, `Record`) used meaningfully | ✅ |
| A **generic class** `MemoCache<K, V>` with a constraint (`K extends string \| number`) | ✅ |
| **Debounce** (closure) applied to search input | ✅ |
| Clean module architecture, reusable helpers, and this README | ✅ |

---

## 🗂 Project Structure

```
ajt-devdash/
├── index.html              # HTML entry point
├── package.json
├── tsconfig.json            # "strict": true
├── src/
│   ├── main.ts              # App entry — bootstraps data loading
│   ├── types.ts             # Interfaces, discriminated unions, utility types
│   ├── api.ts               # Generic fetchJson<T> + API endpoints
│   ├── state.ts             # AppState with discriminated union, assertNever
│   ├── ui.ts                # Render functions (list, detail, loading, error)
│   └── utils.ts             # debounce, MemoCache, memoize, filter/sort helpers
├── styles.css               # Dark theme CSS
└── README.md
```

---

## 🔑 Key TypeScript Techniques Used

| Technique | Location |
|---|---|
| `interface` for API data | `types.ts` — `Product`, `ProductListResponse` |
| Discriminated union | `types.ts` — `AsyncState<T>` (idle \| loading \| success \| error) |
| Exhaustive narrowing | `state.ts` — `assertNever()`, `describeAsyncState()` |
| Generic function | `api.ts` — `fetchJson<T>(url): Promise<T>` |
| Generic class with constraint | `utils.ts` — `MemoCache<K extends string \| number, V>` |
| Utility types | `types.ts` — `Pick`, `Partial`, `Record` |
| Higher-order functions | `utils.ts` — `filter`, `map`, `sort` pipelines |
| Closure (debounce) | `utils.ts` — `debounce<T>()` |
| Closure (memoize) | `utils.ts` — `memoize<A, R>()` |
| `Promise.all` | `api.ts` — `loadInitialData()` |
| `async/await` + `try/catch` | `api.ts`, `main.ts`, `ui.ts` |

---

## 📄 License

This project is for educational purposes (FSA — Advanced JavaScript & TypeScript module).
