// AVELUNE Atelier API Client
const API = {
  baseUrl: '/api',

  async request(endpoint, options = {}) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `HTTP Error ${response.status}`);
      }
      return data;
    } catch (err) {
      console.error(`API Error [${endpoint}]:`, err);
      throw err;
    }
  },

  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/products${query ? '?' + query : ''}`);
  },

  async getProduct(idOrSlug) {
    return this.request(`/products/${encodeURIComponent(idOrSlug)}`);
  },

  async addProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  async updateProduct(id, updates) {
    return this.request(`/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async deleteProduct(id) {
    return this.request(`/products/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  },

  // Orders
  async getOrders() {
    return this.request('/orders');
  },

  async getOrder(id) {
    return this.request(`/orders/${encodeURIComponent(id)}`);
  },

  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  async updateOrderStatus(id, status) {
    return this.request(`/orders/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  // Public Order Tracking
  async trackOrder(queryTerm) {
    return this.request(`/track/${encodeURIComponent(queryTerm)}`);
  },

  // Reviews
  async getReviews(productId) {
    const q = productId ? `?productId=${encodeURIComponent(productId)}` : '';
    return this.request(`/reviews${q}`);
  },

  async addReview(reviewData) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
  },

  // Coupons
  async validateCoupon(code) {
    return this.request(`/coupons/validate?code=${encodeURIComponent(code)}`);
  },

  // Auth
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // Admin Metrics
  async getMetrics() {
    return this.request('/admin/metrics');
  },

  // Newsletter
  async subscribeNewsletter(email) {
    return this.request('/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }
};

window.API = API;
