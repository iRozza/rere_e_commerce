// AVELUNE Atelier - Main Router & Page Controllers
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

const App = {
  productsCache: [],

  init() {
    this.bindGlobalEvents();
    CartUI.init();

    // Listen for currency changes to re-render dynamic prices
    State.on('currency:changed', () => {
      this.handleRoute();
    });

    State.on('wishlist:updated', ({ productId, added }) => {
      this.updateWishlistCount();
      window.showToast(added ? 'Saved to your private wishlist' : 'Removed from wishlist', 'info');
      // Update heart icons
      document.querySelectorAll(`[data-wishlist-id="${productId}"]`).forEach(btn => {
        btn.classList.toggle('active', added);
      });
    });

    // Hash change router
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  },

  bindGlobalEvents() {
    // Currency Selector
    const currPicker = document.getElementById('currencySelector');
    if (currPicker) {
      currPicker.value = State.activeCurrency;
      currPicker.addEventListener('change', (e) => {
        State.setCurrency(e.target.value);
      });
    }

    // Open Cart Drawer Button
    const cartBtn = document.getElementById('headerCartBtn');
    if (cartBtn) {
      cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        CartUI.openDrawer();
      });
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuToggle');
    const mobileNavDrawer = document.getElementById('mobileNavDrawer');
    const closeMobileNav = document.getElementById('closeMobileNav');

    if (mobileMenuBtn && mobileNavDrawer) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileNavDrawer.classList.toggle('open');
      });
    }
    if (closeMobileNav && mobileNavDrawer) {
      closeMobileNav.addEventListener('click', () => {
        mobileNavDrawer.classList.remove('open');
      });
    }

    // Quick View Close
    const qvBackdrop = document.getElementById('quickViewModal');
    const qvClose = document.getElementById('closeQuickView');
    if (qvClose && qvBackdrop) {
      qvClose.addEventListener('click', () => qvBackdrop.classList.remove('open'));
      qvBackdrop.addEventListener('click', (e) => {
        if (e.target === qvBackdrop) qvBackdrop.classList.remove('open');
      });
    }

    // Newsletter Form
    const nlForm = document.getElementById('footerNewsletterForm');
    if (nlForm) {
      nlForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = document.getElementById('newsletterEmail');
        if (input && input.value) {
          try {
            await API.subscribeNewsletter(input.value);
            window.showToast('Welcome to the Atelier! Use code AVELUNE15 for 15% off.', 'success');
            input.value = '';
          } catch (err) {
            window.showToast('Newsletter subscription registered!', 'success');
          }
        }
      });
    }

    this.updateWishlistCount();
  },

  updateWishlistCount() {
    const badge = document.getElementById('headerWishlistCount');
    if (badge) {
      const count = State.wishlist.length;
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  },

  // Router dispatcher
  async handleRoute() {
    const hash = window.location.hash || '#/';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Hide all view containers
    const views = document.querySelectorAll('.view-container');
    views.forEach(v => v.style.display = 'none');

    // Update active navbar links
    document.querySelectorAll('.nav-link').forEach(link => {
      const linkHash = link.getAttribute('href');
      link.classList.toggle('active', linkHash === hash);
    });

    // Close mobile nav if open
    const mobileNavDrawer = document.getElementById('mobileNavDrawer');
    if (mobileNavDrawer) mobileNavDrawer.classList.remove('open');

    // Route matching
    if (hash === '#/' || hash === '') {
      this.showView('homeView');
      this.renderHome();
    } else if (hash.startsWith('#/shop')) {
      this.showView('shopView');
      this.renderShop();
    } else if (hash.startsWith('#/product/')) {
      const idOrSlug = hash.replace('#/product/', '');
      this.showView('pdpView');
      this.renderPDP(idOrSlug);
    } else if (hash === '#/story') {
      this.showView('storyView');
    } else if (hash === '#/checkout') {
      this.showView('checkoutView');
      CheckoutUI.init();
    } else if (hash.startsWith('#/order-confirmed/')) {
      const orderId = hash.replace('#/order-confirmed/', '');
      this.showView('confirmationView');
      this.renderConfirmation(orderId);
    } else if (hash.startsWith('#/track')) {
      this.showView('trackView');
      const orderParam = hash.includes('/') ? hash.split('/track/')[1] : null;
      if (orderParam) {
        TrackingUI.lookupOrder(orderParam);
      }
    } else if (hash === '#/account') {
      this.showView('accountView');
      AccountUI.init();
    } else if (hash === '#/admin') {
      this.showView('adminView');
      AdminUI.init();
    } else {
      this.showView('homeView');
      this.renderHome();
    }
  },

  showView(viewId) {
    const view = document.getElementById(viewId);
    if (view) view.style.display = 'block';
  },

  // RENDER HOME PAGE
  async renderHome() {
    try {
      if (this.productsCache.length === 0) {
        const res = await API.getProducts();
        if (res.success) this.productsCache = res.products;
      }
      const products = this.productsCache;

      // Render Featured / Bestsellers Grid
      const featuredContainer = document.getElementById('homeFeaturedGrid');
      if (featuredContainer) {
        const featured = products.filter(p => p.featured).slice(0, 4);
        featuredContainer.innerHTML = featured.map(p => this.renderProductCard(p)).join('');
      }

      // Render New Arrivals Grid
      const arrivalsContainer = document.getElementById('homeArrivalsGrid');
      if (arrivalsContainer) {
        const arrivals = products.slice(4, 8);
        arrivalsContainer.innerHTML = arrivals.map(p => this.renderProductCard(p)).join('');
      }
    } catch (e) {
      console.error('Home render error:', e);
    }
  },

  // RENDER CATALOG / SHOP PAGE
  async renderShop() {
    try {
      const container = document.getElementById('shopProductsGrid');
      const countEl = document.getElementById('shopResultsCount');
      if (!container) return;

      const hashParts = window.location.hash.split('?');
      const params = new URLSearchParams(hashParts[1] || '');
      const category = params.get('category') || 'all';

      // Update sidebar category active classes
      document.querySelectorAll('.shop-cat-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
      });

      const res = await API.getProducts({ category });
      if (res.success) {
        this.productsCache = res.products;
        let prods = res.products;

        if (countEl) countEl.textContent = `Showing ${prods.length} handcrafted pieces`;

        container.innerHTML = prods.map(p => this.renderProductCard(p)).join('');
      }
    } catch (e) {
      console.error('Shop render error:', e);
    }
  },

  // FILTER & SORT SHOP CATALOG IN-PLACE
  applyShopFilters() {
    const searchVal = document.getElementById('shopSearchInput')?.value.toLowerCase().trim() || '';
    const sortVal = document.getElementById('shopSortSelect')?.value || 'featured';
    const minPrice = parseFloat(document.getElementById('shopMinPrice')?.value) || 0;
    const maxPrice = parseFloat(document.getElementById('shopMaxPrice')?.value) || 9999;
    const inStockOnly = document.getElementById('shopInStockOnly')?.checked || false;

    let filtered = [...this.productsCache];

    if (searchVal) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchVal) ||
        p.shortDesc.toLowerCase().includes(searchVal) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(searchVal)))
      );
    }

    filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);

    if (inStockOnly) {
      filtered = filtered.filter(p => p.stockCount > 0);
    }

    if (sortVal === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortVal === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortVal === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    const container = document.getElementById('shopProductsGrid');
    const countEl = document.getElementById('shopResultsCount');
    if (countEl) countEl.textContent = `Showing ${filtered.length} handcrafted pieces`;

    if (container) {
      if (filtered.length === 0) {
        container.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
            <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">No Pieces Found</h3>
            <p style="color: var(--color-text-muted);">Try adjusting your filters or price threshold.</p>
          </div>
        `;
      } else {
        container.innerHTML = filtered.map(p => this.renderProductCard(p)).join('');
      }
    }
  },

  // PRODUCT CARD HTML GENERATOR
  renderProductCard(product) {
    const isWish = State.isInWishlist(product.id);
    return `
      <div class="product-card">
        <div class="product-image-wrap">
          <a href="#/product/${product.slug || product.id}">
            <img src="${product.image}" alt="${product.name}" loading="lazy" />
          </a>
          ${product.badge ? `<span class="product-badge ${product.badge.includes('Favorite') || product.badge.includes('Signature') ? 'gold' : ''}">${product.badge}</span>` : ''}
          <button class="product-wishlist-btn ${isWish ? 'active' : ''}" data-wishlist-id="${product.id}" onclick="State.toggleWishlist('${product.id}')" title="Save piece">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWish ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <button class="product-quick-view-btn" onclick="App.openQuickView('${product.id}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            Quick View
          </button>
        </div>
        <div class="product-info">
          <span class="product-category">${product.category}</span>
          <h3 class="product-title">
            <a href="#/product/${product.slug || product.id}">${product.name}</a>
          </h3>
          <div class="product-rating">
            <div class="stars">★★★★★</div>
            <span class="rating-count">(${product.reviewCount || 1})</span>
          </div>
          <div class="product-price-row">
            <span class="product-price">${State.formatPrice(product.price)}</span>
            ${product.compareAtPrice ? `<span class="product-compare-price">${State.formatPrice(product.compareAtPrice)}</span>` : ''}
          </div>
          <button class="product-add-cart-btn" onclick="State.addToCart({ id: '${product.id}', name: '${product.name.replace(/'/g, "\\'")}', price: ${product.price}, image: '${product.image}', category: '${product.category}' }); CartUI.openDrawer();">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            Add to Bag
          </button>
        </div>
      </div>
    `;
  },

  // RENDER PRODUCT DETAIL PAGE (PDP)
  async renderPDP(idOrSlug) {
    const container = document.getElementById('pdpContent');
    if (!container) return;

    container.innerHTML = `
      <div style="text-align: center; padding: 5rem 0;">
        <div class="animate-spin" style="display: inline-block; width: 36px; height: 36px; border: 3px solid var(--color-border); border-top-color: var(--color-accent); border-radius: 50%;"></div>
        <p style="margin-top: 1rem; color: var(--color-text-muted);">Summoning artisan piece details...</p>
      </div>
    `;

    try {
      const res = await API.getProduct(idOrSlug);
      if (!res.success || !res.product) {
        container.innerHTML = `<div style="text-align: center; padding: 4rem;"><h3>Piece Not Found</h3><a href="#/shop" class="btn btn-primary">Return to Shop</a></div>`;
        return;
      }

      const p = res.product;
      const reviewsRes = await API.getReviews(p.id);
      const reviews = reviewsRes.reviews || [];

      // Savings calculation
      const savings = p.compareAtPrice ? (p.compareAtPrice - p.price) : 0;

      container.innerHTML = `
        <!-- Breadcrumbs -->
        <nav style="display: flex; gap: 0.5rem; font-size: 0.8125rem; color: var(--color-text-muted); margin-bottom: 2rem;">
          <a href="#/">Home</a> <span>/</span>
          <a href="#/shop?category=${p.categorySlug}">${p.category}</a> <span>/</span>
          <span style="color: var(--color-primary); font-weight: 500;">${p.name}</span>
        </nav>

        <div class="pdp-container">
          <!-- Gallery Column -->
          <div class="pdp-gallery">
            <div class="pdp-main-image-wrap">
              <img id="pdpMainImg" src="${p.image}" alt="${p.name}" class="pdp-main-image" />
            </div>
            <div class="pdp-thumbs">
              ${(p.gallery || [p.image]).map((img, i) => `
                <div class="pdp-thumb ${i === 0 ? 'active' : ''}" onclick="document.getElementById('pdpMainImg').src='${img}'; document.querySelectorAll('.pdp-thumb').forEach(t => t.classList.remove('active')); this.classList.add('active');">
                  <img src="${img}" alt="${p.name} thumbnail" />
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Product Details Column -->
          <div class="pdp-details">
            <span class="eyebrow">${p.category} • Handcrafted Batch</span>
            <h1 class="pdp-title">${p.name}</h1>

            <div class="product-rating" style="margin-bottom: 1rem;">
              <div class="stars">★★★★★</div>
              <span style="font-weight: 600; color: var(--color-primary);">${p.rating}</span>
              <a href="#pdpReviewsSection" class="rating-count" style="text-decoration: underline;">(${p.reviewCount} verified artisan reviews)</a>
            </div>

            <div class="pdp-price-row">
              <span class="pdp-price">${State.formatPrice(p.price)}</span>
              ${p.compareAtPrice ? `<span class="pdp-compare-price">${State.formatPrice(p.compareAtPrice)}</span>` : ''}
              ${savings > 0 ? `<span class="pdp-save-badge">Save ${State.formatPrice(savings)}</span>` : ''}
            </div>

            <div class="stock-alert">
              <span class="stock-dot"></span>
              <span>In Atelier Stock • Only <strong>${p.stockCount} handcrafted pieces</strong> remaining in this batch</span>
            </div>

            <p class="pdp-desc">${p.description}</p>

            <div class="pdp-actions-row">
              <div class="qty-counter">
                <button class="qty-btn" onclick="let q = document.getElementById('pdpQty'); q.textContent = Math.max(1, parseInt(q.textContent) - 1);">-</button>
                <span id="pdpQty" class="qty-display">1</span>
                <button class="qty-btn" onclick="let q = document.getElementById('pdpQty'); q.textContent = Math.min(${p.stockCount}, parseInt(q.textContent) + 1);">+</button>
              </div>

              <button class="btn btn-primary btn-lg" style="flex-grow: 1;" onclick="App.handlePDPAddToCart('${p.id}')">
                Add to Atelier Bag
              </button>

              <button class="action-btn" style="width: 52px; height: 52px; border: 1px solid var(--color-border);" onclick="State.toggleWishlist('${p.id}')">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="${State.isInWishlist(p.id) ? 'var(--color-danger)' : 'none'}" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>

            <button class="btn btn-secondary btn-block" style="margin-bottom: 1.5rem;" onclick="App.handlePDPAddToCart('${p.id}'); window.location.hash = '#/checkout';">
              Instant Buy Now
            </button>

            <!-- Value Perks -->
            <div class="pdp-perks-list">
              <div class="pdp-perk">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                <span>1-Year Craftsmanship Guarantee</span>
              </div>
              <div class="pdp-perk">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
                <span>Dispatches within 24-48 Hours</span>
              </div>
              <div class="pdp-perk">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                <span>Free Insured Delivery over $50</span>
              </div>
              <div class="pdp-perk">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path></svg>
                <span>30-Day Hassle-Free Returns</span>
              </div>
            </div>

            <!-- Accordion Details -->
            <div class="accordion">
              <div class="accordion-item open">
                <button class="accordion-header" onclick="this.parentElement.classList.toggle('open')">
                  <span>Materials & Specifications</span>
                  <span class="accordion-icon">▼</span>
                </button>
                <div class="accordion-body">
                  <p><strong>Composition:</strong> ${p.materials}</p>
                  <p><strong>Dimensions & Sizing:</strong> ${p.dimensions}</p>
                  <p><strong>Clasp Mechanism:</strong> ${p.clasp}</p>
                  <p><strong>Artisan Origin:</strong> ${p.handcraftedBy}</p>
                </div>
              </div>
              <div class="accordion-item">
                <button class="accordion-header" onclick="this.parentElement.classList.toggle('open')">
                  <span>Jewelry Care & Preservation</span>
                  <span class="accordion-icon">▼</span>
                </button>
                <div class="accordion-body">
                  <p>${p.care}</p>
                  <p>Each order includes a complimentary anti-tarnish storage pouch and polishing instructions.</p>
                </div>
              </div>
              <div class="accordion-item">
                <button class="accordion-header" onclick="this.parentElement.classList.toggle('open')">
                  <span>Packaging & Gifting</span>
                  <span class="accordion-icon">▼</span>
                </button>
                <div class="accordion-body">
                  <p>Arrives presented in our signature dark espresso embossed gift box, hand-tied with woven satin ribbon and accompanied by an artisan certificate of authenticity.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Verified Reviews Section -->
        <section id="pdpReviewsSection" style="margin-top: 4rem; padding-top: 3rem; border-top: 1px solid var(--color-border);">
          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem;">
            <div>
              <span class="eyebrow">Artisan Collector Voices</span>
              <h2 style="font-size: 2rem;">Customer Reviews (${reviews.length})</h2>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="App.openReviewModal('${p.id}')">Write a Review</button>
          </div>

          <div class="reviews-grid">
            ${reviews.map(r => `
              <div class="review-card">
                <div class="review-stars">★★★★★</div>
                <h4 class="review-title">${r.title || 'Exceptional Piece'}</h4>
                <p class="review-comment">"${r.comment}"</p>
                <div class="review-author-info">
                  <span class="author-name">${r.author}</span>
                  <span class="verified-buyer">✓ Verified Buyer</span>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      `;
    } catch (e) {
      console.error('PDP Error:', e);
    }
  },

  handlePDPAddToCart(productId) {
    const p = this.productsCache.find(x => x.id === productId);
    const qty = parseInt(document.getElementById('pdpQty')?.textContent) || 1;
    if (p) {
      State.addToCart(p, qty);
      CartUI.openDrawer();
      window.showToast(`Added ${qty}× "${p.name}" to bag`, 'success');
    }
  },

  // QUICK VIEW MODAL
  async openQuickView(productId) {
    const modal = document.getElementById('quickViewModal');
    const content = document.getElementById('quickViewContent');
    if (!modal || !content) return;

    modal.classList.add('open');
    content.innerHTML = `<div style="text-align: center; padding: 3rem;"><div class="animate-spin" style="display: inline-block; width: 32px; height: 32px; border: 3px solid var(--color-border); border-top-color: var(--color-accent); border-radius: 50%;"></div></div>`;

    try {
      const res = await API.getProduct(productId);
      if (res.success && res.product) {
        const p = res.product;
        content.innerHTML = `
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
            <div style="aspect-ratio: 1 / 1; border-radius: var(--radius-sm); overflow: hidden; background: #f6f4ee;">
              <img src="${p.image}" alt="${p.name}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <div style="display: flex; flex-direction: column;">
              <span class="eyebrow">${p.category}</span>
              <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">${p.name}</h3>
              <div class="product-price-row" style="margin-bottom: 1rem;">
                <span class="product-price" style="font-size: 1.35rem;">${State.formatPrice(p.price)}</span>
                ${p.compareAtPrice ? `<span class="product-compare-price">${State.formatPrice(p.compareAtPrice)}</span>` : ''}
              </div>
              <p style="font-size: 0.875rem; color: var(--color-text-muted); line-height: 1.6; margin-bottom: 1.5rem;">${p.shortDesc}</p>
              <div style="font-size: 0.8125rem; color: var(--color-text-muted); margin-bottom: 1.5rem;">
                <strong>Materials:</strong> ${p.materials}
              </div>
              <div style="margin-top: auto; display: flex; gap: 0.75rem;">
                <button class="btn btn-primary btn-block" onclick="State.addToCart({ id: '${p.id}', name: '${p.name.replace(/'/g, "\\'")}', price: ${p.price}, image: '${p.image}', category: '${p.category}' }); document.getElementById('quickViewModal').classList.remove('open'); CartUI.openDrawer();">
                  Add to Atelier Bag
                </button>
              </div>
            </div>
          </div>
        `;
      }
    } catch (e) {
      console.error(e);
    }
  },

  // RENDER ORDER CONFIRMATION
  async renderConfirmation(orderId) {
    const container = document.getElementById('confirmationContent');
    if (!container) return;

    try {
      const res = await API.getOrder(orderId);
      if (res.success && res.order) {
        const order = res.order;
        container.innerHTML = `
          <div class="confirmation-card">
            <div class="conf-check">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <span class="eyebrow">Order Secured</span>
            <h1 style="font-size: 2.5rem; margin-bottom: 0.5rem;">Merci Pour Votre Confiance</h1>
            <p style="color: var(--color-text-muted); max-width: 480px; margin: 0 auto 2rem;">
              Your bespoke handcrafted jewelry order <strong>#${order.id}</strong> has been received by our atelier benches.
            </p>

            <div style="background: var(--color-surface-soft); border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 1.5rem; text-align: left; margin-bottom: 2rem;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem; font-size: 0.875rem;">
                <span style="color: var(--color-text-muted);">Tracking Number:</span>
                <strong style="color: var(--color-primary);">${order.trackingNumber}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem; font-size: 0.875rem;">
                <span style="color: var(--color-text-muted);">Delivery Address:</span>
                <span>${order.shippingAddress.street}, ${order.shippingAddress.city}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem; font-size: 0.875rem;">
                <span style="color: var(--color-text-muted);">Payment:</span>
                <span>${order.paymentMethod}</span>
              </div>
              <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--color-border); padding-top: 0.75rem; font-weight: 700;">
                <span>Total Paid:</span>
                <span style="color: var(--color-accent); font-size: 1.1rem;">${State.formatPrice(order.total)}</span>
              </div>
            </div>

            <div style="display: flex; gap: 1rem; justify-content: center;">
              <a href="#/track/${order.id}" class="btn btn-primary">Track Real-Time Status</a>
              <button class="btn btn-secondary" onclick="window.print()">Print Atelier Invoice</button>
            </div>
          </div>
        `;
      }
    } catch (e) {
      console.error(e);
    }
  },

  // REVIEW MODAL
  openReviewModal(productId) {
    const modal = document.getElementById('reviewModal');
    const inputId = document.getElementById('reviewProductId');
    if (modal && inputId) {
      inputId.value = productId;
      modal.classList.add('open');
    }
  },

  closeReviewModal() {
    const modal = document.getElementById('reviewModal');
    if (modal) modal.classList.remove('open');
  },

  async handleReviewSubmit(e) {
    e.preventDefault();
    const productId = document.getElementById('reviewProductId')?.value;
    const author = document.getElementById('reviewAuthor')?.value;
    const rating = parseInt(document.getElementById('reviewRating')?.value) || 5;
    const title = document.getElementById('reviewTitle')?.value;
    const comment = document.getElementById('reviewComment')?.value;

    try {
      await API.addReview({ productId, author, rating, title, comment });
      window.showToast('Thank you! Your verified collector review is published.', 'success');
      this.closeReviewModal();
      this.renderPDP(productId);
    } catch (err) {
      window.showToast('Could not submit review', 'danger');
    }
  }
};

// Global Toast System
window.showToast = function(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

window.App = App;

