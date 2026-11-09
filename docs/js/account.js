// AVELUNE Atelier User Account & Authentication Component
const AccountUI = {
  currentTab: 'orders',

  init() {
    this.render();
  },

  setTab(tab) {
    this.currentTab = tab;
    this.render();
  },

  async login(email, password) {
    try {
      const res = await API.login(email, password);
      if (res.success && res.user) {
        State.setUser(res.user, res.token);
        window.showToast(`Welcome back, ${res.user.name}`, 'success');
        this.render();
      }
    } catch (err) {
      window.showToast(err.message || 'Login failed', 'danger');
      const errEl = document.getElementById('authError');
      if (errEl) {
        errEl.textContent = err.message || 'Invalid credentials';
        errEl.style.display = 'block';
      }
    }
  },

  async register(name, email, password, phone) {
    try {
      const res = await API.register({ name, email, password, phone });
      if (res.success && res.user) {
        State.setUser(res.user, res.token);
        window.showToast(`Account created! Welcome to Avelune Atelier, ${res.user.name}`, 'success');
        this.render();
      }
    } catch (err) {
      window.showToast(err.message || 'Registration failed', 'danger');
      const errEl = document.getElementById('authRegisterError');
      if (errEl) {
        errEl.textContent = err.message || 'Registration failed';
        errEl.style.display = 'block';
      }
    }
  },

  async quickDemoLogin(role = 'customer') {
    if (role === 'customer') {
      await this.login('elena@avelune.com', 'demo123');
    } else {
      await this.login('admin@avelune.com', 'admin123');
      window.location.hash = '#/admin';
    }
  },

  logout() {
    State.logout();
    window.showToast('You have been signed out', 'info');
    this.render();
  },

  async render() {
    const container = document.getElementById('accountViewContainer');
    if (!container) return;

    if (!State.user) {
      // Render Auth Form (Login / Register / Quick Demo)
      container.innerHTML = `
        <div style="max-width: 500px; margin: 3rem auto; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 2.5rem; box-shadow: var(--shadow-sm);">
          <div style="text-align: center; margin-bottom: 2rem;">
            <span class="eyebrow">Atelier Portal</span>
            <h2 style="font-size: 2rem; margin-bottom: 0.5rem;">Collector Sign In</h2>
            <p style="font-size: 0.875rem; color: var(--color-text-muted);">Access your order history, tracking, saved addresses, and artisan wishlist.</p>
          </div>

          <div id="authError" style="display: none; background: #fdf2f2; border: 1px solid #f8b4b4; color: var(--color-danger); padding: 0.75rem; border-radius: var(--radius-sm); font-size: 0.8125rem; margin-bottom: 1.25rem;"></div>

          <form id="loginForm" onsubmit="event.preventDefault(); AccountUI.handleLoginSubmit();">
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" id="loginEmail" class="form-input" placeholder="e.g. elena@avelune.com" required />
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" id="loginPassword" class="form-input" placeholder="••••••••" required />
            </div>
            <button type="submit" class="btn btn-primary btn-block" style="margin-top: 1rem;">Sign In</button>
          </form>

          <div style="margin: 2rem 0; position: relative; text-align: center;">
            <div style="position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: var(--color-border);"></div>
            <span style="position: relative; background: var(--color-surface); padding: 0 1rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-text-light);">Instant Demo Access</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <button class="btn btn-secondary btn-sm" onclick="AccountUI.quickDemoLogin('customer')">
              👤 One-Click Collector Demo (Elena Rostova)
            </button>
            <button class="btn btn-secondary btn-sm" onclick="AccountUI.quickDemoLogin('admin')">
              👑 One-Click Admin & Artisan Director
            </button>
          </div>
        </div>
      `;
      return;
    }

    // Render Authenticated Dashboard
    const user = State.user;
    let orders = [];
    try {
      const allOrders = await API.getOrders();
      if (allOrders.success) {
        orders = allOrders.orders.filter(o => o.customer?.email?.toLowerCase() === user.email.toLowerCase());
      }
    } catch (e) {
      console.warn('Orders fetch:', e);
    }

    container.innerHTML = `
      <div style="margin-bottom: 2.5rem; display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1px solid var(--color-border); padding-bottom: 1.5rem;">
        <div>
          <span class="eyebrow">Welcome to Your Private Atelier</span>
          <h2 style="font-size: 2.25rem;">${user.name}</h2>
          <div style="font-size: 0.875rem; color: var(--color-text-muted);">
            Collector since ${user.joinedDate || '2026'} • 
            <span style="color: var(--color-accent); font-weight: 600;">${user.role === 'admin' ? 'Artisan Administrator' : 'Tier: Silver Collector'}</span>
          </div>
        </div>
        <div style="display: flex; gap: 0.75rem;">
          ${user.role === 'admin' ? '<a href="#/admin" class="btn btn-accent btn-sm">Enter Admin Suite</a>' : ''}
          <button class="btn btn-secondary btn-sm" onclick="AccountUI.logout()">Sign Out</button>
        </div>
      </div>

      <div class="shop-layout">
        <!-- Sidebar Navigation -->
        <div class="shop-sidebar">
          <ul class="filter-list">
            <li>
              <button class="filter-btn ${this.currentTab === 'orders' ? 'active' : ''}" onclick="AccountUI.setTab('orders')">
                <span>📦 Order History</span>
                <span class="filter-count">(${orders.length})</span>
              </button>
            </li>
            <li>
              <button class="filter-btn ${this.currentTab === 'wishlist' ? 'active' : ''}" onclick="AccountUI.setTab('wishlist')">
                <span>🤍 Saved Pieces</span>
                <span class="filter-count">(${State.wishlist.length})</span>
              </button>
            </li>
            <li>
              <button class="filter-btn ${this.currentTab === 'addresses' ? 'active' : ''}" onclick="AccountUI.setTab('addresses')">
                <span>📍 Shipping Addresses</span>
              </button>
            </li>
          </ul>
        </div>

        <!-- Tab Content -->
        <div style="min-height: 400px;">
          ${this.renderTabContent(orders)}
        </div>
      </div>
    `;
  },

  renderTabContent(orders) {
    if (this.currentTab === 'orders') {
      if (orders.length === 0) {
        return `
          <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 3rem; text-align: center;">
            <p style="color: var(--color-text-muted); margin-bottom: 1.5rem;">You haven't placed any atelier orders yet.</p>
            <a href="#/shop" class="btn btn-primary btn-sm">Explore Collection</a>
          </div>
        `;
      }

      return orders.map(order => `
        <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 1.75rem; margin-bottom: 1.5rem; box-shadow: var(--shadow-sm);">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-border); padding-bottom: 1rem; margin-bottom: 1rem;">
            <div>
              <div style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 600;">Order #${order.id}</div>
              <div style="font-size: 0.75rem; color: var(--color-text-light);">Placed on ${new Date(order.createdAt).toLocaleDateString()}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span class="status-chip ${order.fulfillmentStatus}">${order.fulfillmentStatus}</span>
              <a href="#/track/${order.id}" class="btn btn-secondary btn-sm">Track Package</a>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1rem;">
            ${(order.items || []).map(item => `
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.875rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <img src="${item.image}" alt="${item.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;" />
                  <span>${item.name} × ${item.quantity}</span>
                </div>
                <div style="font-weight: 600;">${State.formatPrice(item.price * item.quantity)}</div>
              </div>
            `).join('')}
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--color-border); padding-top: 0.75rem; font-size: 0.875rem;">
            <div style="color: var(--color-text-muted);">Payment: ${order.paymentMethod}</div>
            <div style="font-size: 1rem; font-weight: 700; color: var(--color-primary);">Total: ${State.formatPrice(order.total)}</div>
          </div>
        </div>
      `).join('');
    }

    if (this.currentTab === 'wishlist') {
      return `
        <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 2rem;">
          <h3 style="font-size: 1.25rem; margin-bottom: 1rem;">Your Curated Wishlist (${State.wishlist.length})</h3>
          <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 1.5rem;">Pieces you have saved for personal collection or gifting.</p>
          <div id="accountWishlistGrid" class="products-grid" style="grid-template-columns: repeat(2, 1fr);">
            <!-- Populated dynamically -->
          </div>
        </div>
      `;
    }

    if (this.currentTab === 'addresses') {
      const addresses = State.user.addresses || [];
      return `
        <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 2rem;">
          <h3 style="font-size: 1.25rem; margin-bottom: 1rem;">Saved Addresses</h3>
          ${addresses.length > 0 ? addresses.map(addr => `
            <div style="border: 1px solid var(--color-border); padding: 1.25rem; border-radius: var(--radius-sm); margin-bottom: 1rem;">
              <div style="font-weight: 600; font-size: 0.95rem; margin-bottom: 0.25rem;">${addr.firstName} ${addr.lastName} ${addr.isDefault ? '<span class="status-chip Delivered" style="font-size: 0.65rem;">Default</span>' : ''}</div>
              <div style="font-size: 0.875rem; color: var(--color-text-muted);">${addr.street}</div>
              <div style="font-size: 0.875rem; color: var(--color-text-muted);">${addr.city}, ${addr.state} ${addr.postalCode}</div>
              <div style="font-size: 0.875rem; color: var(--color-text-muted);">${addr.country}</div>
              <div style="font-size: 0.8125rem; color: var(--color-text-light); margin-top: 0.5rem;">Phone: ${addr.phone}</div>
            </div>
          `).join('') : '<p style="color: var(--color-text-muted);">No saved addresses yet.</p>'}
        </div>
      `;
    }

    return '';
  },

  handleLoginSubmit() {
    const email = document.getElementById('loginEmail')?.value;
    const password = document.getElementById('loginPassword')?.value;
    if (email && password) {
      this.login(email, password);
    }
  }
};

window.AccountUI = AccountUI;

