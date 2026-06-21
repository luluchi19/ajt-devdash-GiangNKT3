(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))c(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&c(r)}).observe(document,{childList:!0,subtree:!0});function s(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function c(a){if(a.ep)return;a.ep=!0;const n=s(a);fetch(a.href,n)}})();const h="https://dummyjson.com";async function f(e){const t=await fetch(e);if(!t.ok)throw new Error(`HTTP ${t.status}: ${t.statusText} — ${e}`);return await t.json()}async function k(e=100){const{products:t}=await f(`${h}/products?limit=${e}`);return t}async function I(e){return f(`${h}/products/${e}`)}async function D(){return f(`${h}/products/category-list`)}async function O(){const[e,t]=await Promise.all([k(),D()]);return{products:e,categories:t}}const y=()=>({status:"idle"}),b=()=>({status:"loading"}),m=e=>({status:"success",data:e}),v=e=>({status:"error",message:e});function F(){return{products:y(),categories:y(),selectedProduct:null,searchQuery:"",selectedCategory:"",sortBy:"default",currentView:"list"}}let g=F();function w(){return g}function o(e){g={...g,...e}}function M(){o({products:b()})}function N(e){o({products:m(e)})}function j(e){o({products:v(e)})}function A(e){o({categories:m(e)})}function H(e){o({categories:v(e)})}function u(e){o({selectedProduct:e})}function V(e){o({searchQuery:e})}function q(e){o({selectedCategory:e})}function Q(e){o({sortBy:e})}function L(e){o({currentView:e})}function R(e,t){let s;return(...c)=>{s!==void 0&&clearTimeout(s),s=setTimeout(()=>e(...c),t)}}const E={default:{label:"Default",compareFn:()=>0},"price-asc":{label:"Price ↑",compareFn:(e,t)=>e.price-t.price},"price-desc":{label:"Price ↓",compareFn:(e,t)=>t.price-e.price},rating:{label:"Rating ★",compareFn:(e,t)=>t.rating-e.rating},name:{label:"Name A-Z",compareFn:(e,t)=>e.title.localeCompare(t.title)}},x=(e,t)=>e.filter(({title:s,description:c,brand:a})=>{const n=t.toLowerCase();return s.toLowerCase().includes(n)||c.toLowerCase().includes(n)||(a??"").toLowerCase().includes(n)}),U=(e,t)=>t===""?e:e.filter(s=>s.category===t),_=(e,t)=>{const{compareFn:s}=E[t];return[...e].sort(s)},z=(e,t,s,c)=>{const a=x(e,t),n=U(a,s);return _(n,c)},p=e=>`$${e.toFixed(2)}`,P=e=>`${"★".repeat(Math.round(e))}${"☆".repeat(5-Math.round(e))}`,J=(e,t)=>e.length>t?`${e.slice(0,t)}…`:e;function K(e){const t=document.querySelector(e);if(!t)throw new Error(`Element not found: ${e}`);return t}function i(){const e=w(),t=K("#app");if(e.currentView==="detail"&&e.selectedProduct!==null){X(t,e.selectedProduct);return}Z(t,e.products,e.categories)}function Z(e,t,s){const c=w();switch(t.status){case"idle":case"loading":e.innerHTML=B();return;case"error":e.innerHTML=C(t.message);return;case"success":{const a=t.data,n=s.status==="success"?s.data:[],r=z(a,c.searchQuery,c.selectedCategory,c.sortBy);e.innerHTML=`
        <header class="header">
          <div class="header-inner">
            <h1 class="logo">
              <span class="logo-icon">⚡</span> DevDash
            </h1>
            <p class="subtitle">Typed Async Product Dashboard</p>
          </div>
        </header>

        <section class="controls" id="controls">
          ${G(n,c.searchQuery,c.selectedCategory,c.sortBy)}
        </section>

        <p class="result-count">${r.length} product${r.length!==1?"s":""} found</p>

        <section class="product-grid" id="product-grid">
          ${r.length>0?r.map(d=>W(d)).join(""):`<div class="empty-state">
                 <span class="empty-icon">🔍</span>
                 <p>No products match your filters.</p>
               </div>`}
        </section>
      `,Y();return}}}function G(e,t,s,c){const a=e.map(r=>`<option value="${r}" ${r===s?"selected":""}>${r}</option>`).join(""),n=Object.entries(E).map(([r,{label:d}])=>`<option value="${r}" ${r===c?"selected":""}>${d}</option>`).join("");return`
    <div class="control-group">
      <div class="search-wrapper">
        <span class="search-icon">🔎</span>
        <input
          type="text"
          id="search-input"
          class="search-input"
          placeholder="Search products…"
          value="${t}"
          autocomplete="off"
        />
      </div>

      <select id="category-select" class="select-input">
        <option value="">All Categories</option>
        ${a}
      </select>

      <select id="sort-select" class="select-input">
        ${n}
      </select>
    </div>
  `}function W(e){const{id:t,title:s,price:c,rating:a,thumbnail:n,category:r,brand:d,discountPercentage:l}=e,T=c*(1-l/100);return`
    <article class="card" data-id="${t}">
      <div class="card-img-wrapper">
        <img
          class="card-img"
          src="${n}"
          alt="${s}"
          loading="lazy"
        />
        ${l>5?`<span class="badge badge-discount">-${Math.round(l)}%</span>`:""}
      </div>
      <div class="card-body">
        <span class="card-category">${r}</span>
        <h2 class="card-title">${J(s,45)}</h2>
        <p class="card-brand">${d??"No brand"}</p>
        <div class="card-footer">
          <div class="card-pricing">
            <span class="card-price">${p(T)}</span>
            ${l>5?`<span class="card-price-original">${p(c)}</span>`:""}
          </div>
          <span class="card-rating">${P(a)} <small>${a.toFixed(1)}</small></span>
        </div>
      </div>
    </article>
  `}function X(e,t){switch(t.status){case"idle":case"loading":e.innerHTML=`
        <header class="header">
          <div class="header-inner">
            <h1 class="logo"><span class="logo-icon">⚡</span> DevDash</h1>
          </div>
        </header>
        ${B()}
      `;return;case"error":e.innerHTML=`
        <header class="header">
          <div class="header-inner">
            <h1 class="logo"><span class="logo-icon">⚡</span> DevDash</h1>
          </div>
        </header>
        ${C(t.message)}
        <button class="btn btn-back" id="back-btn">← Back to list</button>
      `,$();return;case"success":{const s=t.data,c=s.price*(1-s.discountPercentage/100);e.innerHTML=`
        <header class="header">
          <div class="header-inner">
            <button class="btn btn-back" id="back-btn">← Back</button>
            <h1 class="logo"><span class="logo-icon">⚡</span> DevDash</h1>
          </div>
        </header>

        <section class="detail">
          <div class="detail-gallery">
            <img class="detail-hero" src="${s.images[0]??s.thumbnail}" alt="${s.title}" id="detail-hero" />
            <div class="detail-thumbs">
              ${s.images.map((a,n)=>`<img class="detail-thumb ${n===0?"active":""}" src="${a}" alt="Image ${n+1}" data-src="${a}" />`).join("")}
            </div>
          </div>

          <div class="detail-info">
            <span class="card-category">${s.category}</span>
            <h2 class="detail-title">${s.title}</h2>
            <p class="detail-brand">by ${s.brand??"Unknown"}</p>

            <div class="detail-rating">
              ${P(s.rating)}
              <span>${s.rating.toFixed(1)} / 5</span>
            </div>

            <div class="detail-pricing">
              <span class="detail-price">${p(c)}</span>
              ${s.discountPercentage>5?`<span class="detail-price-original">${p(s.price)}</span>
                   <span class="badge badge-discount">-${Math.round(s.discountPercentage)}%</span>`:""}
            </div>

            <p class="detail-description">${s.description}</p>

            <div class="detail-meta">
              <div class="meta-item">
                <span class="meta-label">Stock</span>
                <span class="meta-value ${s.stock<10?"low-stock":""}">${s.stock} units</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Tags</span>
                <span class="meta-value">${s.tags.map(a=>`<span class="tag">${a}</span>`).join(" ")}</span>
              </div>
            </div>
          </div>
        </section>
      `,$(),te();return}}}function B(){return`
    <div class="state-container">
      <div class="spinner"></div>
      <p class="state-text">Loading data…</p>
    </div>
  `}function C(e){return`
    <div class="state-container state-error">
      <span class="error-icon">⚠️</span>
      <p class="state-text">Something went wrong</p>
      <p class="error-detail">${e}</p>
      <button class="btn btn-retry" id="retry-btn">Try again</button>
    </div>
  `}function Y(){const e=document.getElementById("search-input");if(e){const a=R(n=>{V(n),i()},300);e.addEventListener("input",n=>{const r=n.target;a(r.value)})}const t=document.getElementById("category-select");t&&t.addEventListener("change",a=>{const n=a.target;q(n.value),i()});const s=document.getElementById("sort-select");s&&s.addEventListener("change",a=>{const n=a.target;Q(n.value),i()}),document.querySelectorAll(".card").forEach(a=>{a.addEventListener("click",async()=>{const n=Number(a.dataset.id);if(!isNaN(n)){L("detail"),u(b()),i();try{const r=await I(n);u(m(r))}catch(r){const d=r instanceof Error?r.message:"Unknown error";u(v(d))}i()}})}),ee()}function $(){const e=document.getElementById("back-btn");e&&e.addEventListener("click",()=>{L("list"),u(null),i()})}function ee(){const e=document.getElementById("retry-btn");e&&e.addEventListener("click",()=>{window.dispatchEvent(new CustomEvent("devdash:retry"))})}function te(){const e=document.querySelectorAll(".detail-thumb"),t=document.getElementById("detail-hero");e.forEach(s=>{s.addEventListener("click",()=>{t&&(t.src=s.dataset.src??s.src,e.forEach(c=>c.classList.remove("active")),s.classList.add("active"))})})}async function S(){M(),i();try{const{products:e,categories:t}=await O();N(e),A(t)}catch(e){const t=e instanceof Error?e.message:"Failed to load data";j(t),H(t)}i()}document.addEventListener("DOMContentLoaded",()=>{S()});window.addEventListener("devdash:retry",()=>{S()});
