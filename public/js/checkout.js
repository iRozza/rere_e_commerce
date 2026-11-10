// AVELUNE Atelier Multi-Step Checkout Controller
const CheckoutUI = {
  currentStep: 1,
  selectedPayment: 'card',
  selectedShippingFee: 0,
  orderBumpAdded: false,
  eventsBound: false,

  init() {
    this.bindEvents();
    if (!this.cartSummaryListenerBound) {
      State.on('cart:updated', () => this.renderSummary());
      this.cartSummaryListenerBound = true;
    }
    this.renderSummary();
  },

  bindEvents() {
    if (this.eventsBound) return;
    this.eventsBound = true;
    // Payment method radio tabs
    document.querySelectorAll('.payment-option-card[data-method]').forEach(card => {
      card.addEventListener('click', (e) => {
        document.querySelectorAll('.payment-option-card[data-method]').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const method = card.dataset.method;
        this.selectedPayment = method;

        const cardDetails = document.getElementById('cardDetailsForm');
        if (cardDetails) {
          cardDetails.style.display = method === 'card' ? 'block' : 'none';
        }
      });
    });

    // Credit Card Auto-Formatting
    const cardInput = document.getElementById('ccNumber');
    if (cardInput) {
      cardInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
        e.target.value = formatted.substring(0, 19);
      });
    }

    const expInput = document.getElementById('ccExp');
    if (expInput) {
      expInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length >= 2) {
          e.target.value = val.substring(0, 2) + '/' + val.substring(2, 4);
        } else {
          e.target.value = val;
        }
      });
    }

    // Shipping radio options
    document.querySelectorAll('input[name="shippingOption"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.selectedShippingFee = e.target.dataset.shippingType === 'express' ? 14.99 : 0;
        document.querySelectorAll('input[name="shippingOption"]').forEach(option => {
          option.closest('.payment-option-card')?.classList.toggle('selected', option === e.target);
        });
        this.renderSummary();
      });
    });

    // Order Bump checkbox
    const bumpCheck = document.getElementById('orderBumpCloth');
    if (bumpCheck) {
      bumpCheck.addEventListener('change', (e) => {
        this.orderBumpAdded = e.target.checked;
        this.renderSummary();
      });
    }

    // Pre-fill user data if logged in
    if (State.user) {
      const emailField = document.getElementById('checkoutEmail');
      const nameField = document.getElementById('checkoutName');
      const phoneField = document.getElementById('checkoutPhone');
      if (emailField) emailField.value = State.user.email || '';
      if (nameField) nameField.value = State.user.name || '';
      if (phoneField) phoneField.value = State.user.phone || '';

      if (State.user.addresses && State.user.addresses.length > 0) {
        const addr = State.user.addresses[0];
        const streetField = document.getElementById('checkoutStreet');
        const cityField = document.getElementById('checkoutCity');
        const stateField = document.getElementById('checkoutState');
        const zipField = document.getElementById('checkoutZip');
        if (streetField) streetField.value = addr.street || '';
        if (cityField) cityField.value = addr.city || '';
        if (stateField) stateField.value = addr.state || '';
        if (zipField) zipField.value = addr.postalCode || '';
      }
    }
  },

  renderSummary() {
    const container = document.getElementById('checkoutItemsList');
    const subtotalEl = document.getElementById('checkoutSubtotal');
    const discountEl = document.getElementById('checkoutDiscount');
    const discountRow = document.getElementById('checkoutDiscountRow');
    const shippingEl = document.getElementById('checkoutShipping');
    const taxEl = document.getElementById('checkoutTax');
    const totalEl = document.getElementById('checkoutTotal');

    if (!container) return;

    const subtotal = State.getCartSubtotal() + (this.orderBumpAdded ? 6.0 : 0);
    if (State.appliedCoupon && subtotal < (State.appliedCoupon.minSpend || 0)) {
      const code = State.appliedCoupon.code;
      State.removeCoupon();
      const msg = document.getElementById('couponFeedbackMsg');
      if (msg) {
        msg.style.color = 'var(--color-danger)';
        msg.textContent = `Promo code ${code} was removed because the order no longer meets its minimum spend.`;
      }
    }
    const standardRadio = document.querySelector('input[name="shippingOption"][data-shipping-type="standard"]');
    const standardLabel = standardRadio?.closest('.payment-option-card');
    const standardPrice = standardLabel?.lastElementChild;
    const standardFee = this.getStandardShippingFee(subtotal);
    if (standardRadio) standardRadio.value = String(standardFee);
    if (standardPrice) {
      standardPrice.textContent = standardFee === 0 ? 'FREE' : State.formatPrice(standardFee);
      standardPrice.style.color = standardFee === 0 ? 'var(--color-success)' : '';
    }
    const selectedRadio = document.querySelector('input[name="shippingOption"]:checked');
    this.selectedShippingFee = selectedRadio?.dataset.shippingType === 'express' ? 14.99 : standardFee;

    if (State.cart.length === 0) {
      container.innerHTML = `<p style="color: var(--color-text-muted); font-size: 0.875rem;">Your bag is empty. Please add items to checkout.</p>`;
      if (subtotalEl) subtotalEl.textContent = State.formatPrice(0);
      if (discountRow) discountRow.style.display = 'none';
      if (discountEl) discountEl.textContent = State.formatPrice(0);
      if (shippingEl) shippingEl.textContent = 'FREE';
      if (taxEl) taxEl.textContent = State.formatPrice(0);
      if (totalEl) totalEl.textContent = State.formatPrice(0);
      return;
    }

    container.innerHTML = State.cart.map(item => `
      <div style="display: flex; gap: 0.75rem; align-items: center; justify-content: space-between;">
        <div style="display: flex; gap: 0.75rem; align-items: center;">
          <div style="position: relative;">
            <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--color-border);" />
            <span style="position: absolute; top: -6px; right: -6px; background: var(--color-primary); color: #fff; font-size: 0.7rem; font-weight: 700; width: 18px; height: 18px; border-radius: 999px; display: flex; align-items: center; justify-content: center;">${item.quantity}</span>
          </div>
          <div>
            <div style="font-size: 0.875rem; font-weight: 600; color: var(--color-primary);">${item.name}</div>
            <div style="font-size: 0.75rem; color: var(--color-text-light);">${item.category}</div>
          </div>
        </div>
        <div style="font-weight: 600; font-size: 0.875rem;">${State.formatPrice(item.price * item.quantity)}</div>
      </div>
    `).join('');

    const discount = this.getCheckoutDiscount(subtotal);
    const shipping = State.appliedCoupon?.freeShipping ? 0 : this.selectedShippingFee;

    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = taxableAmount * 0.08;
    const finalTotal = taxableAmount + shipping + tax;

    if (subtotalEl) subtotalEl.textContent = State.formatPrice(subtotal);

    if (discountEl && discountRow) {
      if (discount > 0) {
        discountRow.style.display = 'flex';
        discountEl.textContent = `-${State.formatPrice(discount)} (${State.appliedCoupon.code})`;
      } else {
        discountRow.style.display = 'none';
      }
    }

    if (shippingEl) {
      shippingEl.textContent = shipping === 0 ? 'FREE' : State.formatPrice(shipping);
    }
    if (taxEl) taxEl.textContent = State.formatPrice(tax);
    if (totalEl) totalEl.textContent = State.formatPrice(finalTotal);
  },

  async applyCoupon() {
    const input = document.getElementById('checkoutCouponInput');
    const msg = document.getElementById('couponFeedbackMsg');
    if (!input || !input.value.trim()) return;

    try {
      const res = await API.validateCoupon(input.value.trim());
      if (res.success && res.coupon) {
        const subtotal = State.getCartSubtotal() + (this.orderBumpAdded ? 6 : 0);
        if (subtotal < (res.coupon.minSpend || 0)) {
          if (msg) {
            msg.style.color = 'var(--color-danger)';
            msg.textContent = `This code requires a minimum order of ${State.formatPrice(res.coupon.minSpend)}.`;
          }
          return;
        }
        State.applyCoupon(res.coupon);
        if (msg) {
          msg.style.color = 'var(--color-success)';
          msg.textContent = `✓ Promo code "${res.coupon.code}" applied: ${res.coupon.description}!`;
        }
        this.renderSummary();
      } else if (msg) {
        msg.style.color = 'var(--color-danger)';
        msg.textContent = res.message || 'Invalid promotional code.';
      }
    } catch (err) {
      if (msg) {
        msg.style.color = 'var(--color-danger)';
        msg.textContent = err.message || 'Invalid promotional code.';
      }
    }
  },

  async placeOrder() {
    const submitBtn = document.getElementById('placeOrderBtn');
    const errorAlert = document.getElementById('checkoutErrorAlert');
    if (errorAlert) errorAlert.style.display = 'none';

    // Validation
    const email = document.getElementById('checkoutEmail')?.value.trim();
    const name = document.getElementById('checkoutName')?.value.trim();
    const street = document.getElementById('checkoutStreet')?.value.trim();
    const city = document.getElementById('checkoutCity')?.value.trim();
    const postalCode = document.getElementById('checkoutZip')?.value.trim();
    const country = document.getElementById('checkoutCountry')?.value.trim() || 'United States';
    const phone = document.getElementById('checkoutPhone')?.value.trim() || '';

    const emailField = document.getElementById('checkoutEmail');
    if (!email || !name || !street || !city || !postalCode || !emailField?.checkValidity()) {
      if (errorAlert) {
        errorAlert.textContent = 'Please complete all required customer & shipping address fields.';
        errorAlert.style.display = 'block';
      }
      window.showToast('Please fill all required shipping fields', 'warning');
      return;
    }

    if (this.selectedPayment === 'card') {
      const ccNum = document.getElementById('ccNumber')?.value.replace(/\D/g, '');
      const ccExp = document.getElementById('ccExp')?.value.trim();
      const ccCvc = document.getElementById('ccCvc')?.value.trim();
      const expMatch = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(ccExp || '');
      const expirationIsFuture = expMatch && (() => {
        const month = Number(expMatch[1]);
        const year = 2000 + Number(expMatch[2]);
        const now = new Date();
        return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
      })();

      if (!ccNum || ccNum.length < 15 || ccNum.length > 19 || !this.passesLuhnCheck(ccNum) || !expirationIsFuture || !/^\d{3,4}$/.test(ccCvc || '')) {
        if (errorAlert) {
          errorAlert.textContent = 'Please enter a valid credit card number, expiration date, and security code.';
          errorAlert.style.display = 'block';
        }
        window.showToast('Please check your card payment details', 'warning');
        return;
      }
    }

    if (State.cart.length === 0) {
      window.showToast('Your bag is empty', 'warning');
      return;
    }

    // Set button loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>
        Securing Atelier Order...
      `;
    }

    try {
      let items = [...State.cart];
      if (this.orderBumpAdded) {
        items.push({
          id: 'cloth-anti-tarnish',
          name: 'Atelier Suede Anti-Tarnish Polishing Cloth',
          price: 6.0,
          quantity: 1,
          image: './images/products/herringbone-necklace.jpg'
        });
      }

      let subtotal = State.getCartSubtotal() + (this.orderBumpAdded ? 6.0 : 0);
      let discount = this.getCheckoutDiscount(subtotal);
      let shipping = State.appliedCoupon?.freeShipping ? 0 : this.selectedShippingFee;
      let tax = (subtotal - discount) * 0.08;
      let total = subtotal - discount + shipping + tax;

      const orderPayload = {
        customer: { name, email, phone },
        shippingAddress: {
          firstName: name.split(' ')[0] || name,
          lastName: name.split(' ').slice(1).join(' ') || '',
          street,
          city,
          postalCode,
          country
        },
        items,
        subtotal: Number(subtotal.toFixed(2)),
        discount: Number(discount.toFixed(2)),
        couponCode: State.appliedCoupon ? State.appliedCoupon.code : '',
        shippingFee: Number(shipping.toFixed(2)),
        tax: Number(tax.toFixed(2)),
        total: Number(total.toFixed(2)),
        paymentMethod: this.selectedPayment === 'card' ? 'Credit Card (ending 4242)' : (this.selectedPayment === 'paypal' ? 'PayPal Express' : 'Cash on Delivery')
      };

      // Call API
      const res = await API.createOrder(orderPayload);
      if (res.success && res.order) {
        // Clear cart
        State.clearCart();
        window.showToast('Order confirmed! Generating your certificate...', 'success');
        // Route to confirmation
        window.location.hash = `#/order-confirmed/${res.order.id}`;
      }
    } catch (err) {
      console.error('Order error:', err);
      if (errorAlert) {
        errorAlert.textContent = err.message || 'Payment processing failed. Please try again.';
        errorAlert.style.display = 'block';
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Complete Order';
      }
    }
  },
  getStandardShippingFee(subtotal) {
    if (subtotal <= 0 || subtotal >= 50 || State.appliedCoupon?.freeShipping) return 0;
    return 4.99;
  },
  getCheckoutDiscount(subtotal) {
    const coupon = State.appliedCoupon;
    if (!coupon || subtotal < (coupon.minSpend || 0) || !coupon.discountPercent) return 0;
    return subtotal * (coupon.discountPercent / 100);
  },
  passesLuhnCheck(cardNumber) {
    let sum = 0;
    let doubleDigit = false;
    for (let i = cardNumber.length - 1; i >= 0; i -= 1) {
      let digit = Number(cardNumber[i]);
      if (doubleDigit) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      doubleDigit = !doubleDigit;
    }
    return sum % 10 === 0;
  }
};

window.CheckoutUI = CheckoutUI;

