// AVELUNE Atelier Central State Store & Currency Handler
const State = {
  // Currencies & Rates relative to USD
  currencies: {
    USD: { symbol: '$', rate: 1.0, name: 'USD ($)' },
    EUR: { symbol: '€', rate: 0.92, name: 'EUR (€)' },
    GBP: { symbol: '£', rate: 0.79, name: 'GBP (£)' },
    EGP: { symbol: 'E£', rate: 49.5, name: 'EGP (E£)' }
  },

  activeCurrency: localStorage.getItem('avelune_currency') || 'USD',

  // Cart
  cart: JSON.parse(localStorage.getItem('avelune_cart') || '[]'),
  appliedCoupon: JSON.parse(localStorage.getItem('avelune_coupon') || 'null'),

  // Wishlist
  wishlist: JSON.parse(localStorage.getItem('avelune_wishlist') || '[]'),

  // User
  user: JSON.parse(localStorage.getItem('avelune_user') || 'null'),
  token: localStorage.getItem('avelune_token') || null,

  // Event listeners
  listeners: {},

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  },

  emit(event, payload) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(payload));
    }
  },

  // Currency Formatter
  formatPrice(usdAmount) {
    const curr = this.currencies[this.activeCurrency] || this.currencies.USD;
    const converted = usdAmount * curr.rate;
    if (this.activeCurrency === 'EGP') {
      return `${curr.symbol} ${Math.round(converted).toLocaleString()}`;
    }
    return `${curr.symbol}${converted.toFixed(2)}`;
  },

  setCurrency(currCode) {
    if (this.currencies[currCode]) {
      this.activeCurrency = currCode;
      localStorage.setItem('avelune_currency', currCode);
      this.emit('currency:changed', currCode);
    }
  },

  // Cart Methods
  getCartCount() {
    return this.cart.reduce((total, item) => total + (item.quantity || 1), 0);
  },

  getCartSubtotal() {
    return this.cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  },

  getCartDiscount() {
    const subtotal = this.getCartSubtotal();
    if (!this.appliedCoupon) return 0;
    if (this.appliedCoupon.discountPercent) {
      return (subtotal * (this.appliedCoupon.discountPercent / 100));
    }
    return 0;
  },

  getShippingFee() {
    const subtotal = this.getCartSubtotal();
    if (subtotal === 0) return 0;
    if (this.appliedCoupon && this.appliedCoupon.freeShipping) return 0;
    // Free shipping over $50
    return subtotal >= 50 ? 0 : 4.99;
  },

  getCartTotal() {
    const subtotal = this.getCartSubtotal();
    const discount = this.getCartDiscount();
    const shipping = this.getShippingFee();
    const tax = (subtotal - discount) > 0 ? (subtotal - discount) * 0.08 : 0;
    return Math.max(0, subtotal - discount + shipping + tax);
  },

  addToCart(product, quantity = 1) {
    const requestedQuantity = Math.max(1, Math.floor(Number(quantity) || 1));
    const stockCount = Number.isFinite(Number(product.stockCount))
      ? Math.max(0, Math.floor(Number(product.stockCount)))
      : Infinity;
    if (stockCount === 0) return false;

    const existingIndex = this.cart.findIndex(i => i.id === product.id);
    if (existingIndex > -1) {
      const currentQuantity = this.cart[existingIndex].quantity || 1;
      this.cart[existingIndex].quantity = Math.min(stockCount, currentQuantity + requestedQuantity);
      if (Number.isFinite(stockCount)) this.cart[existingIndex].stockCount = stockCount;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: Math.min(stockCount, requestedQuantity),
        ...(Number.isFinite(stockCount) ? { stockCount } : {})
      });
    }
    this.saveCart();
    this.emit('cart:updated', this.cart);
    return true;
  },

  updateCartQuantity(productId, quantity) {
    const idx = this.cart.findIndex(i => i.id === productId);
    if (idx > -1) {
      if (quantity <= 0) {
        this.cart.splice(idx, 1);
      } else {
        const normalizedQuantity = Math.max(1, Math.floor(Number(quantity) || 1));
        const stockCount = Number.isFinite(Number(this.cart[idx].stockCount))
          ? Math.max(0, Math.floor(Number(this.cart[idx].stockCount)))
          : Infinity;
        if (stockCount === 0) {
          this.cart.splice(idx, 1);
        } else {
          this.cart[idx].quantity = Math.min(stockCount, normalizedQuantity);
        }
      }
      this.saveCart();
      this.emit('cart:updated', this.cart);
    }
  },

  removeFromCart(productId) {
    this.cart = this.cart.filter(i => i.id !== productId);
    this.saveCart();
    this.emit('cart:updated', this.cart);
  },

  clearCart() {
    this.cart = [];
    this.appliedCoupon = null;
    this.saveCart();
    localStorage.removeItem('avelune_coupon');
    this.emit('cart:updated', this.cart);
  },

  applyCoupon(coupon) {
    this.appliedCoupon = coupon;
    localStorage.setItem('avelune_coupon', JSON.stringify(coupon));
    this.emit('cart:updated', this.cart);
  },

  removeCoupon() {
    this.appliedCoupon = null;
    localStorage.removeItem('avelune_coupon');
    this.emit('cart:updated', this.cart);
  },

  saveCart() {
    localStorage.setItem('avelune_cart', JSON.stringify(this.cart));
  },

  // Wishlist Methods
  toggleWishlist(productId) {
    const idx = this.wishlist.indexOf(productId);
    let added = false;
    if (idx > -1) {
      this.wishlist.splice(idx, 1);
    } else {
      this.wishlist.push(productId);
      added = true;
    }
    localStorage.setItem('avelune_wishlist', JSON.stringify(this.wishlist));
    this.emit('wishlist:updated', { productId, wishlist: this.wishlist, added });
    return added;
  },

  isInWishlist(productId) {
    return this.wishlist.includes(productId);
  },

  // User Auth Methods
  setUser(user, token) {
    this.user = user;
    this.token = token;
    if (user && token) {
      localStorage.setItem('avelune_user', JSON.stringify(user));
      localStorage.setItem('avelune_token', token);
    } else {
      localStorage.removeItem('avelune_user');
      localStorage.removeItem('avelune_token');
    }
    this.emit('auth:changed', this.user);
  },

  logout() {
    this.setUser(null, null);
  }
};

window.State = State;

