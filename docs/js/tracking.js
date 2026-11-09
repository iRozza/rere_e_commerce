// AVELUNE Atelier Order Tracking Component
const TrackingUI = {
  async lookupOrder(queryTerm) {
    const input = document.getElementById('trackingInput');
    const resultContainer = document.getElementById('trackingResults');
    const errorContainer = document.getElementById('trackingError');

    const term = (queryTerm || input?.value || '').trim();
    if (!term) return;

    if (errorContainer) errorContainer.style.display = 'none';
    if (resultContainer) {
      resultContainer.innerHTML = `
        <div style="text-align: center; padding: 3rem;">
          <div class="animate-spin" style="display: inline-block; width: 32px; height: 32px; border: 3px solid var(--color-border); border-top-color: var(--color-accent); border-radius: 50%;"></div>
          <p style="margin-top: 1rem; color: var(--color-text-muted);">Retrieving white-glove atelier tracking...</p>
        </div>
      `;
    }

    try {
      const res = await API.trackOrder(term);
      if (res.success && res.order) {
        this.renderOrderTracking(res.order);
      }
    } catch (err) {
      if (resultContainer) resultContainer.innerHTML = '';
      if (errorContainer) {
        errorContainer.textContent = err.message || 'No shipment found matching that order number or tracking code. Please verify and try again.';
        errorContainer.style.display = 'block';
      }
    }
  },

  renderOrderTracking(order) {
    const resultContainer = document.getElementById('trackingResults');
    if (!resultContainer) return;

    const timelineHtml = (order.trackingTimeline || []).map((step, idx) => `
      <div class="timeline-step ${step.completed ? 'completed' : ''}">
        <div class="step-indicator">
          ${step.completed ? '✓' : (idx + 1)}
        </div>
        <div class="timeline-step-title">${step.title}</div>
        <div class="timeline-step-desc">${step.desc}</div>
        <div class="timeline-step-time">${step.time}</div>
      </div>
    `).join('');

    resultContainer.innerHTML = `
      <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 2.25rem; box-shadow: var(--shadow-sm); margin-top: 2rem;">
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-border); padding-bottom: 1.5rem; gap: 1rem;">
          <div>
            <span class="eyebrow" style="margin-bottom: 0.25rem;">Shipment Tracking</span>
            <h3 style="font-size: 1.75rem; margin-bottom: 0.25rem;">Order #${order.id}</h3>
            <div style="font-size: 0.8125rem; color: var(--color-text-muted);">Tracking Code: <strong>${order.trackingNumber}</strong></div>
          </div>
          <div style="text-align: right;">
            <span class="status-chip ${order.fulfillmentStatus}">${order.fulfillmentStatus}</span>
            <div style="font-size: 0.8125rem; color: var(--color-text-light); margin-top: 0.4rem;">Carrier: ${order.carrier}</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2.5rem; margin-top: 2rem;">
          <div>
            <h4 style="font-family: var(--font-sans); font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-primary); margin-bottom: 1rem;">Fulfillment & Transit Milestones</h4>
            <div class="tracking-timeline">
              ${timelineHtml}
            </div>
          </div>

          <div style="background: var(--color-surface-soft); border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 1.5rem; height: fit-content;">
            <h4 style="font-family: var(--font-sans); font-size: 0.8125rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1rem;">Artisan Dispatch Note</h4>
            <p style="font-size: 0.8125rem; color: var(--color-text-muted); line-height: 1.6; margin-bottom: 1rem;">
              Every Avelune piece undergoes individual bench inspection, ultrasonic cleansing, and anti-tarnish sealed packaging before carrier departure.
            </p>
            <div style="border-top: 1px solid var(--color-border); padding-top: 0.75rem; font-size: 0.75rem; color: var(--color-text-light);">
              Destination: ${order.shippingAddress?.city || 'Registered Address'}, ${order.shippingAddress?.country || 'Global'}
            </div>
          </div>
        </div>
      </div>
    `;
  }
};

window.TrackingUI = TrackingUI;

