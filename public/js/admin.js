// AVELUNE Atelier Admin Dashboard Component
const AdminUI = {
  currentTab: 'orders',

  async init() {
    this.render();
  },

  setTab(tab) {
    this.currentTab = tab;
    this.render();
  },

  async render() {
    const container = document.getElementById('adminViewContainer');
    if (!container) return;

    // Check if user is admin
    if (!State.user || State.user.role !== 'admin') {
      container.innerHTML = `
        <div style="max-width: 500px; margin: 4rem auto; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 3rem; text-align: center;">
          <div style="width: 54px; height: 54px; border-radius: 50%; background: #fff4e5; color: #b76e00; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 1.5rem;">🔒</div>
          <h2 style="font-size: 1.75rem; margin-bottom: 0.5rem;">Artisan Admin Suite</h2>
          <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 2rem;">
            This restricted command portal is reserved for Avelune Studio administrators and fulfillment artisans.
          </p>
          <button class="btn btn-primary btn-block" onclick="AccountUI.quickDemoLogin('admin')">
            👑 Log In as Artisan Director (Admin Demo)
          </button>
        </div>
      `;
      return;
    }

    // Fetch live metrics, orders, products
    let metrics = null;
    let orders = [];
    let products = [];
    try {
      const [mRes, oRes, pRes] = await Promise.all([
        API.getMetrics(),
        API.getOrders(),
        API.getProducts()
      ]);
      metrics = mRes.metrics;
      orders = oRes.orders;
      products = pRes.products;
    } catch (err) {
      console.error('Admin data load err:', err);
    }

    container.innerHTML = `
      <div class="admin-header">
        <div>
          <span class="eyebrow">Studio Management</span>
          <h1 style="font-size: 2.25rem;">Atelier Master Dashboard</h1>
          <div style="font-size: 0.875rem; color: var(--color-text-muted);">
            Logged in as <strong>${State.user.name}</strong> • Real-time inventory & fulfillment
          </div>
        </div>
        <div style="display: flex; gap: 0.75rem;">
          <button class="btn btn-primary btn-sm" onclick="AdminUI.openAddProductModal()">+ Add New Product</button>
          <button class="btn btn-secondary btn-sm" onclick="AccountUI.logout()">Exit Suite</button>
        </div>
      </div>

      <!-- KPI Executive Cards -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-label">Gross Revenue</div>
          <div class="kpi-val">${State.formatPrice(metrics?.totalRevenue || 0)}</div>
          <div class="kpi-change">▲ +18.4% vs last cycle</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Total Atelier Orders</div>
          <div class="kpi-val">${metrics?.totalOrders || 0}</div>
          <div class="kpi-change">▲ 100% On-time dispatch</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Avg. Order Value</div>
          <div class="kpi-val">${State.formatPrice(metrics?.avgOrderValue || 0)}</div>
          <div class="kpi-change">★ High customer loyalty</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Conversion Rate</div>
          <div class="kpi-val">${metrics?.conversionRate || '3.8%'}</div>
          <div class="kpi-change">● ${metrics?.lowStockCount || 0} low-stock alerts</div>
        </div>
      </div>

      <!-- Tabbed Sections -->
      <div class="admin-tabs">
        <div class="admin-tab ${this.currentTab === 'orders' ? 'active' : ''}" onclick="AdminUI.setTab('orders')">
          📦 Client Orders (${orders.length})
        </div>
        <div class="admin-tab ${this.currentTab === 'products' ? 'active' : ''}" onclick="AdminUI.setTab('products')">
          💍 Product Inventory (${products.length})
        </div>
      </div>

      <div>
        ${this.currentTab === 'orders' ? this.renderOrdersTable(orders) : this.renderProductsTable(products)}
      </div>
    `;
  },

  renderOrdersTable(orders) {
    if (!orders || orders.length === 0) {
      return `<p style="padding: 2rem; background: #fff;">No orders placed yet.</p>`;
    }

    return `
      <div style="overflow-x: auto;">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status Action</th>
            </tr>
          </thead>
          <tbody>
            ${orders.map(o => `
              <tr>
                <td>
                  <strong>#${o.id}</strong>
                  <div style="font-size: 0.7rem; color: var(--color-text-light);">${o.trackingNumber}</div>
                </td>
                <td>
                  <div>${o.customer?.name || 'Guest'}</div>
                  <div style="font-size: 0.75rem; color: var(--color-text-muted);">${o.customer?.email}</div>
                </td>
                <td>${new Date(o.createdAt).toLocaleDateString()}</td>
                <td>${(o.items || []).map(i => `${i.name} (${i.quantity})`).join(', ')}</td>
                <td><strong>${State.formatPrice(o.total)}</strong></td>
                <td><span style="font-size: 0.75rem;">${o.paymentStatus} (${o.paymentMethod})</span></td>
                <td>
                  <select onchange="AdminUI.handleStatusChange('${o.id}', this.value)" style="padding: 0.35rem 0.6rem; border-radius: 4px; border: 1px solid var(--color-border); font-size: 0.8125rem;">
                    <option value="Handcrafting" ${o.fulfillmentStatus === 'Handcrafting' ? 'selected' : ''}>Handcrafting</option>
                    <option value="Shipped" ${o.fulfillmentStatus === 'Shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="Delivered" ${o.fulfillmentStatus === 'Delivered' ? 'selected' : ''}>Delivered</option>
                  </select>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  renderProductsTable(products) {
    return `
      <div style="overflow-x: auto;">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${products.map(p => `
              <tr>
                <td>
                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <img src="${p.image}" alt="${p.name}" style="width: 44px; height: 44px; object-fit: cover; border-radius: 4px; border: 1px solid var(--color-border);" />
                    <div>
                      <strong>${p.name}</strong>
                      <div style="font-size: 0.75rem; color: var(--color-text-light);">${p.badge || 'Artisan item'}</div>
                    </div>
                  </div>
                </td>
                <td>${p.category}</td>
                <td>${State.formatPrice(p.price)}</td>
                <td>
                  <input type="number" value="${p.stockCount}" min="0" max="999" style="width: 60px; padding: 0.25rem; font-size: 0.8125rem; border: 1px solid var(--color-border); border-radius: 4px;" onchange="AdminUI.handleStockUpdate('${p.id}', this.value)" />
                </td>
                <td>★ ${p.rating} (${p.reviewCount})</td>
                <td>
                  <span class="status-chip ${p.stockCount > 0 ? 'Delivered' : 'Handcrafting'}">
                    ${p.stockCount > 0 ? 'In Stock' : 'Sold Out'}
                  </span>
                </td>
                <td>
                  <button class="btn btn-secondary btn-sm" onclick="AdminUI.handleDeleteProduct('${p.id}')" style="color: var(--color-danger); border-color: #f8b4b4;">
                    Delete
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  async handleStatusChange(orderId, newStatus) {
    try {
      await API.updateOrderStatus(orderId, newStatus);
      window.showToast(`Order #${orderId} updated to ${newStatus}`, 'success');
      this.render();
    } catch (e) {
      window.showToast('Failed to update status', 'danger');
    }
  },

  async handleStockUpdate(productId, newCount) {
    try {
      await API.updateProduct(productId, { stockCount: Number(newCount), inStock: Number(newCount) > 0 });
      window.showToast('Stock level updated', 'success');
    } catch (e) {
      window.showToast('Stock update failed', 'danger');
    }
  },

  async handleDeleteProduct(productId) {
    if (confirm('Are you sure you want to retire this piece from the catalog?')) {
      try {
        await API.deleteProduct(productId);
        window.showToast('Product removed', 'info');
        this.render();
      } catch (e) {
        window.showToast('Delete failed', 'danger');
      }
    }
  },

  openAddProductModal() {
    const modal = document.getElementById('addProductModal');
    if (modal) modal.classList.add('open');
  },

  closeAddProductModal() {
    const modal = document.getElementById('addProductModal');
    if (modal) modal.classList.remove('open');
  },

  async handleAddProductSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('newProdName')?.value;
    const category = document.getElementById('newProdCategory')?.value;
    const price = parseFloat(document.getElementById('newProdPrice')?.value) || 50;
    const stockCount = parseInt(document.getElementById('newProdStock')?.value) || 10;
    const shortDesc = document.getElementById('newProdDesc')?.value || '';
    const materials = document.getElementById('newProdMaterials')?.value || 'Handcrafted 925 Sterling Silver';

    const newProd = {
      name,
      category,
      categorySlug: category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      price,
      compareAtPrice: price * 1.25,
      stockCount,
      shortDesc,
      description: shortDesc,
      materials,
      image: './images/products/herringbone-necklace.jpg', // fallback or user-selected
      badge: 'New Artisan Piece',
      featured: true
    };

    try {
      await API.addProduct(newProd);
      window.showToast(`"${name}" added to catalog!`, 'success');
      this.closeAddProductModal();
      this.render();
    } catch (err) {
      window.showToast('Failed to add product: ' + err.message, 'danger');
    }
  }
};

window.AdminUI = AdminUI;

