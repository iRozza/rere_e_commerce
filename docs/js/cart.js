// AVELUNE Atelier Cart Drawer & Cart Page Component
const CartUI = {
  drawer: null,
  backdrop: null,

  init() {
    this.drawer = document.getElementById('cartDrawer');
    this.backdrop = document.getElementById('cartBackdrop');

    // Subscribe to State events
    State.on('cart:updated', () => {
      this.renderDrawer();
      this.updateHeaderBadge();
    });

    State.on('currency:changed', () => {
      this.renderDrawer();
      this.updateHeaderBadge();
    });

    // Close handlers
    const closeBtn = document.getElementById('closeCartDrawer');
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeDrawer());
    if (this.backdrop) this.backdrop.addEventListener('click', () => this.closeDrawer());

    this.renderDrawer();
    this.updateHeaderBadge();
  },

  openDrawer() {
    if (this.drawer && this.backdrop) {
      this.renderDrawer();
      this.drawer.classList.add('open');
      this.backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  },

  closeDrawer() {
    if (this.drawer && this.backdrop) {
      this.drawer.classList.remove('open');
      this.backdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  },

  updateHeaderBadge() {
    const badge = document.getElementById('headerCartCount');
    if (badge) {
      const count = State.getCartCount();
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  },

  renderDrawer() {
    const itemsContainer = document.getElementById('drawerCartItems');
    const subtotalEl = document.getElementById('drawerSubtotal');
    const countTag = document.getElementById('drawerCountTag');
    const freeShippingProgress = document.getElementById('freeShippingProgress');
    const freeShippingText = document.getElementById('freeShippingText');
    const checkoutBtn = document.getElementById('drawerCheckoutBtn');

    if (!itemsContainer) return;

    const count = State.getCartCount();
    const subtotal = State.getCartSubtotal();
    const freeShippingGoal = 50.0;
    const remainingForFreeShipping = Math.max(0, freeShippingGoal - subtotal);

    if (countTag) countTag.textContent = `${count} ${count === 1 ? 'piece' : 'pieces'}`;

    // Free shipping progress
    if (freeShippingProgress && freeShippingText) {
      if (subtotal >= freeShippingGoal || (State.appliedCoupon && State.appliedCoupon.freeShipping)) {
        freeShippingText.innerHTML = `🎉 <strong>Congratulations!</strong> You've unlocked <strong>Free Insured Shipping</strong>!`;
        freeShippingProgress.style.width = '100%';
      } else {
        const pct = Math.min(100, Math.round((subtotal / freeShippingGoal) * 100));
        freeShippingText.innerHTML = `Add <strong>${State.formatPrice(remainingForFreeShipping)}</strong> more to enjoy <strong>Free Worldwide Shipping</strong>`;
        freeShippingProgress.style.width = `${pct}%`;
      }
    }

    // Render items or empty state
    if (State.cart.length === 0) {
      itemsContainer.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--color-text-muted);">
          <svg style="margin: 0 auto 1rem; color: var(--color-text-light);" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <h4 style="font-family: var(--font-serif); font-size: 1.25rem; margin-bottom: 0.5rem; color: var(--color-primary);">Your Atelier Bag is Empty</h4>
          <p style="font-size: 0.875rem; margin-bottom: 1.5rem;">Explore our curated handcrafted accessories to find your signature piece.</p>
          <a href="#/shop" class="btn btn-primary btn-sm" onclick="CartUI.closeDrawer()">Explore Collections</a>
        </div>
      `;
      if (subtotalEl) subtotalEl.textContent = State.formatPrice(0);
      if (checkoutBtn) {
        checkoutBtn.setAttribute('disabled', 'true');
        checkoutBtn.style.opacity = '0.5';
        checkoutBtn.style.pointerEvents = 'none';
      }
      return;
    }

    if (checkoutBtn) {
      checkoutBtn.removeAttribute('disabled');
      checkoutBtn.style.opacity = '1';
      checkoutBtn.style.pointerEvents = 'auto';
    }

    if (subtotalEl) {
      subtotalEl.textContent = State.formatPrice(subtotal);
    }

    itemsContainer.innerHTML = State.cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${State.formatPrice(item.price)}</div>
          <div class="cart-item-controls">
            <div class="qty-counter" style="scale: 0.85; transform-origin: left center;">
              <button class="qty-btn" aria-label="Decrease quantity of ${item.name.replace(/"/g, '&quot;')}" onclick="State.updateCartQuantity('${item.id}', ${item.quantity - 1})">-</button>
              <span class="qty-display">${item.quantity}</span>
              <button class="qty-btn" aria-label="Increase quantity of ${item.name.replace(/"/g, '&quot;')}" ${item.stockCount && item.quantity >= item.stockCount ? 'disabled' : ''} onclick="State.updateCartQuantity('${item.id}', ${item.quantity + 1})">+</button>
            </div>
            <button class="cart-item-remove" aria-label="Remove ${item.name.replace(/"/g, '&quot;')} from bag" onclick="State.removeFromCart('${item.id}')">Remove</button>
          </div>
        </div>
      </div>
    `).join('');
  }
};

window.CartUI = CartUI;

