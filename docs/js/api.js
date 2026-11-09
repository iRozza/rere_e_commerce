// AVELUNE Atelier API Client with Automatic Static/GitHub Pages Fallback
(function() {
  const INITIAL_SEED = {
    products: [
      {
        id: "prod-herringbone-01",
        name: "L'Ombre Liquid Herringbone Choker",
        slug: "l-ombre-liquid-herringbone-choker",
        category: "Necklaces",
        categorySlug: "necklaces",
        price: 68.0,
        compareAtPrice: 85.0,
        badge: "Bestseller",
        featured: true,
        inStock: true,
        stockCount: 14,
        rating: 4.9,
        reviewCount: 128,
        image: "./images/products/herringbone-necklace.jpg",
        gallery: [
          "./images/products/herringbone-necklace.jpg",
          "./images/products/herringbone-necklace.jpg"
        ],
        shortDesc: "Silky, flexible 925 sterling silver ribbon links that drape flush against the collarbone like liquid mercury.",
        description: "An ode to sleek modernism and effortless glamour. The L'Ombre Liquid Herringbone Choker is handcrafted using precision interlocking flat ribbon links that create an astonishingly fluid, mirror-shine finish. Designed to contour smoothly around the collarbone without twisting or catching.",
        materials: "Solid 925 Sterling Silver with anti-tarnish rhodium barrier coating.",
        dimensions: "Length: 16 inches + 2-inch extender chain. Ribbon width: 4.2mm.",
        clasp: "Hand-soldered lobster claw closure with engraved Avelune signature tag.",
        care: "Store flat in your included velvet pouch. Polish with microfiber cloth after wear.",
        handcraftedBy: "Master Jeweler Lucas Rey - Hand-aligned ribbon weave",
        tags: ["sterling silver", "choker", "necklace", "herringbone", "minimalist", "liquid silver"]
      },
      {
        id: "prod-papillon-02",
        name: "Papillon Dual-Layer Chevron & Bead Anklet",
        slug: "papillon-dual-layer-chevron-bead-anklet",
        category: "Anklets",
        categorySlug: "anklets",
        price: 48.0,
        compareAtPrice: 62.0,
        badge: "Artisan Favorite",
        featured: true,
        inStock: true,
        stockCount: 9,
        rating: 5.0,
        reviewCount: 94,
        image: "./images/products/butterfly-chevron-anklet.jpg",
        gallery: [
          "./images/products/butterfly-chevron-anklet.jpg",
          "./images/products/butterfly-chevron-anklet.jpg"
        ],
        shortDesc: "Dual-strand architecture marrying sculpted chevron herringbone links with delicate satellite beads and a hand-cast butterfly charm.",
        description: "Capturing the poetic movement of transformation, the Papillon Anklet showcases two complementary strands in one seamless piece. One strand features architectural chevron arrows, paired with a satellite bead chain culminating in an ethereal three-dimensional butterfly charm.",
        materials: "Artisan Sterling Silver and hypo-allergenic stainless alloy core for everyday flex resilience.",
        dimensions: "Length: 9 inches + 2.5-inch custom extension loop. Butterfly pendant: 16mm x 14mm.",
        clasp: "Reinforced lobster clasp with teardrop adjustment links.",
        care: "Water-resistant finish. Rinse with fresh water after ocean or pool wear.",
        handcraftedBy: "Atelier Camille - Hand-cast talisman and hand-linked satellite beads",
        tags: ["anklet", "butterfly", "chevron", "layered", "silver", "summer", "delicate"]
      },
      {
        id: "prod-eclipse-03",
        name: "Éclipse Tri-Disc Beaded Bracelet",
        slug: "eclipse-tri-disc-beaded-bracelet",
        category: "Bracelets",
        categorySlug: "bracelets",
        price: 42.0,
        compareAtPrice: 55.0,
        badge: "Limited Batch",
        featured: true,
        inStock: true,
        stockCount: 18,
        rating: 4.8,
        reviewCount: 86,
        image: "./images/products/eclipse-disc-bracelet.jpg",
        gallery: [
          "./images/products/eclipse-disc-bracelet.jpg",
          "./images/products/eclipse-disc-bracelet.jpg"
        ],
        shortDesc: "Smooth circular discs suspended between micro-polished ball beads catching ambient light with graceful subtlety.",
        description: "The Éclipse Bracelet balances tactile beaded texture with three flat mirror-polished circular disc pendants that chime softly in motion. Engineered for comfortable all-day wear and stunning when stacked with cuffs or watchbands.",
        materials: "925 Sterling Silver plated brass with protective polymer micro-seal.",
        dimensions: "Length: 6.75 inches + 1.5-inch extender chain. Disc diameter: 9.5mm.",
        clasp: "Classic curved lobster clasp.",
        care: "Keep away from harsh perfumes and direct chemical solvents. Buff with soft cloth.",
        handcraftedBy: "Artisan Maya Chen - Individually stamped & diamond-buffed discs",
        tags: ["bracelet", "disc", "beaded", "stackable", "silver", "coin charm", "everyday"]
      },
      {
        id: "prod-soleil-04",
        name: "Soleil & Lune Evil Eye Artisan Bracelet",
        slug: "soleil-lune-evil-eye-artisan-bracelet",
        category: "Bracelets",
        categorySlug: "bracelets",
        price: 54.0,
        compareAtPrice: 70.0,
        badge: "Signature Design",
        featured: true,
        inStock: true,
        stockCount: 6,
        rating: 4.9,
        reviewCount: 112,
        image: "./images/products/soleil-lune-beaded-bracelet.jpg",
        gallery: [
          "./images/products/soleil-lune-beaded-bracelet.jpg",
          "./images/products/soleil-lune-beaded-bracelet.jpg"
        ],
        shortDesc: "Artisanal half-and-half piece featuring vibrant yellow glass beads, protective evil eye, freshwater pearl, and smiling crescent moon charm.",
        description: "A talisman of joy, protection, and celestial wonder. This asymmetric signature piece contrasts sunny yellow Japanese seed beads and an evil eye glass bead with a genuine natural freshwater pearl, continuing into an antique silver link chain with a smiling crescent moon talisman.",
        materials: "Japanese Miyuki seed beads, handcrafted lampwork glass evil eye, natural baroque freshwater pearl, antique silver plated brass chain.",
        dimensions: "Adjustable 6.8 to 8.2 inches. Moon charm: 18mm.",
        clasp: "Sturdy lobster clasp with bead stop safety crimp.",
        care: "Avoid submerging in hot water to preserve string tension and pearl luster.",
        handcraftedBy: "Founder & Lead Artisan Valerie Noire - Hand-strung & wire-wrapped",
        tags: ["evil eye", "beaded", "bracelet", "pearl", "moon charm", "yellow", "artisan talisman"]
      },
      {
        id: "prod-celeste-05",
        name: "Céleste Hammered Silver Cuff",
        slug: "celeste-hammered-silver-cuff",
        category: "Bracelets",
        categorySlug: "bracelets",
        price: 62.0,
        compareAtPrice: 78.0,
        badge: "Hand-Forged",
        featured: false,
        inStock: true,
        stockCount: 11,
        rating: 4.9,
        reviewCount: 64,
        image: "./images/products/celeste-cuff.svg",
        gallery: ["./images/products/celeste-cuff.svg"],
        shortDesc: "Sculptural open cuff hand-hammered to reflect dappled light like rippling water.",
        description: "Forged on a jeweler's anvil, each Céleste cuff features thousands of individual light-catching facets that produce a soft organic glow.",
        materials: "Recycled 925 Sterling Silver with matte satin interior.",
        dimensions: "Width: 8mm. Inner circumference: 6.5 inches (flexible open cuff).",
        clasp: "Slip-on open contour cuff.",
        care: "Wipe with jeweler's cloth. Store individually to prevent scuffs.",
        handcraftedBy: "Artisan Lucas Rey - Anvil hammered & hand burnished",
        tags: ["cuff", "hammered", "silver", "minimalist", "sculptural"]
      },
      {
        id: "prod-aura-06",
        name: "Aura Freshwater Pearl Minimalist Drop",
        slug: "aura-freshwater-pearl-minimalist-drop",
        category: "Necklaces",
        categorySlug: "necklaces",
        price: 76.0,
        compareAtPrice: 92.0,
        badge: "Organic Luxury",
        featured: false,
        inStock: true,
        stockCount: 8,
        rating: 4.8,
        reviewCount: 77,
        image: "./images/products/aura-pearl-choker.svg",
        gallery: ["./images/products/aura-pearl-choker.svg"],
        shortDesc: "A luminous hand-selected natural baroque pearl floating on an ultra-fine 18k white gold vermeil chain.",
        description: "Each baroque pearl is grown naturally and possesses its own singular contour, iridescent luster, and character.",
        materials: "Cultured AAA Baroque Freshwater Pearl (10-11mm) and 925 Sterling Silver cable chain.",
        dimensions: "Length: 17 inches + 2-inch extender.",
        clasp: "Spring-ring clasp with hallmark tag.",
        care: "Put on after lotions and perfumes. Gently clean with damp silk cloth.",
        handcraftedBy: "Atelier Camille - Pearl hand-drilled and bail wire-wrapped",
        tags: ["pearl", "necklace", "baroque", "organic", "minimalist", "bridal"]
      },
      {
        id: "prod-serpentine-07",
        name: "Serpentine Dainty Twisted Rope Anklet",
        slug: "serpentine-dainty-twisted-rope-anklet",
        category: "Anklets",
        categorySlug: "anklets",
        price: 39.0,
        compareAtPrice: 50.0,
        badge: "Everyday Staple",
        featured: false,
        inStock: true,
        stockCount: 22,
        rating: 4.7,
        reviewCount: 53,
        image: "./images/products/serpentine-anklet.svg",
        gallery: ["./images/products/serpentine-anklet.svg"],
        shortDesc: "Twisted French rope chain designed for effortless glint on sunlit strolls and evening wear.",
        description: "Spun with tight diamond-cut helical twists, the Serpentine Anklet glimmers continuously from every perspective.",
        materials: "Italian 925 Sterling Silver with anti-oxidation rhodium shield.",
        dimensions: "Length: 8.5 inches + 2-inch extender. Chain gauge: 2.2mm.",
        clasp: "Lobster claw with reinforced jump ring.",
        care: "Shower safe. Avoid harsh chlorine and sulfur hot springs.",
        handcraftedBy: "Studio Atelier Paris - Hand-twisted link assembly",
        tags: ["anklet", "rope chain", "silver", "delicate", "beach ready"]
      },
      {
        id: "prod-astral-08",
        name: "Astral Starburst Medallion Necklace",
        slug: "astral-starburst-medallion-necklace",
        category: "Necklaces",
        categorySlug: "necklaces",
        price: 84.0,
        compareAtPrice: 105.0,
        badge: "Heirloom Edition",
        featured: true,
        inStock: true,
        stockCount: 5,
        rating: 5.0,
        reviewCount: 41,
        image: "./images/products/astral-starburst.svg",
        gallery: ["./images/products/astral-starburst.svg"],
        shortDesc: "Intricately hand-engraved celestial compass talisman set with a shimmering central cubic zircon starlight.",
        description: "An homage to antique maritime navigational pendants and celestial wanderers. Hand-etched starburst rays radiate outwards from a bezel-set faceted center stone.",
        materials: "Heavy 925 Sterling Silver medallion with brilliant-cut conflict-free CZ stone.",
        dimensions: "Length: 20 inches + 2-inch extender. Medallion diameter: 18mm.",
        clasp: "Decorative swivel dog-clip clasp.",
        care: "Store in cool, dry velvet pouch. Buff gently with anti-tarnish polishing cloth.",
        handcraftedBy: "Artisan Maya Chen - Hand-engraved starburst relief",
        tags: ["necklace", "medallion", "starburst", "celestial", "statement", "heirloom"]
      }
    ],
    coupons: [
      { code: "AVELUNE15", discountPercent: 15, description: "15% off your entire order", minSpend: 30 },
      { code: "WELCOME20", discountPercent: 20, description: "20% off for first-time collectors", minSpend: 50 },
      { code: "FREESHIP", freeShipping: true, description: "Complimentary worldwide express shipping", minSpend: 0 },
      { code: "SILVER10", discountPercent: 10, description: "10% off Sterling Silver Collection", minSpend: 40 }
    ],
    users: [
      {
        id: "user-elena-01",
        email: "elena@avelune.com",
        passwordHash: "demo123",
        name: "Elena Rostova",
        phone: "+1 (555) 234-8971",
        role: "customer",
        joinedDate: "2026-03-15",
        addresses: [
          {
            id: "addr-01",
            isDefault: true,
            firstName: "Elena",
            lastName: "Rostova",
            street: "742 Evergreen Terrace, Apt 4B",
            city: "New York",
            state: "NY",
            postalCode: "10001",
            country: "United States",
            phone: "+1 (555) 234-8971"
          }
        ],
        wishlist: ["prod-herringbone-01", "prod-papillon-02"]
      },
      {
        id: "user-admin-01",
        email: "admin@avelune.com",
        passwordHash: "admin123",
        name: "Valerie Noire (Artisan Director)",
        phone: "+1 (555) 987-6543",
        role: "admin",
        joinedDate: "2025-01-01",
        addresses: [],
        wishlist: []
      }
    ],
    orders: [
      {
        id: "AVE-8924",
        trackingNumber: "AVL-984210",
        carrier: "DHL Express / Artisan White Glove",
        createdAt: "2026-11-07T14:22:00Z",
        customer: { name: "Elena Rostova", email: "elena@avelune.com", phone: "+1 (555) 234-8971" },
        shippingAddress: { firstName: "Elena", lastName: "Rostova", street: "742 Evergreen Terrace, Apt 4B", city: "New York", state: "NY", postalCode: "10001", country: "United States" },
        items: [
          { id: "prod-herringbone-01", name: "L'Ombre Liquid Herringbone Choker", price: 68.0, quantity: 1, image: "./images/products/herringbone-necklace.jpg" },
          { id: "prod-papillon-02", name: "Papillon Dual-Layer Chevron & Bead Anklet", price: 48.0, quantity: 1, image: "./images/products/butterfly-chevron-anklet.jpg" }
        ],
        subtotal: 116.0,
        discount: 17.4,
        couponCode: "AVELUNE15",
        shippingFee: 0.0,
        tax: 8.87,
        total: 107.47,
        paymentMethod: "Credit Card (ending 4242)",
        paymentStatus: "Paid",
        fulfillmentStatus: "Shipped",
        trackingTimeline: [
          { title: "Order Placed", desc: "Order #AVE-8924 confirmed and registered.", time: "Nov 7, 2026 - 14:22", completed: true },
          { title: "Artisan Preparation", desc: "Hand-polishing and quality audit completed in studio.", time: "Nov 8, 2026 - 09:30", completed: true },
          { title: "Dispatched & In Transit", desc: "Handed over to carrier. En route to regional distribution hub.", time: "Nov 9, 2026 - 11:15", completed: true },
          { title: "Out for Delivery", desc: "Courier vehicle out for scheduled delivery.", time: "Expected Nov 10, 2026", completed: false },
          { title: "Delivered", desc: "Package signed for and placed in recipient's hands.", time: "Pending", completed: false }
        ]
      }
    ],
    reviews: [
      {
        id: "rev-01",
        productId: "prod-herringbone-01",
        author: "Sophia Laurent",
        rating: 5,
        title: "Literally looks like melted silver on skin",
        comment: "I have worn this choker non-stop for 3 weeks! It lays so completely flat against my neck, never twists or kinks, and the mirror shine is breathtaking.",
        verified: true
      },
      {
        id: "rev-02",
        productId: "prod-papillon-02",
        author: "Camille V.",
        rating: 5,
        title: "The butterfly charm is utterly enchanting",
        comment: "The double strand detail is so genius. The chevron catches the sun and the butterfly has this lovely artisanal weight.",
        verified: true
      },
      {
        id: "rev-03",
        productId: "prod-soleil-04",
        author: "Amira K.",
        rating: 5,
        title: "Unique statement piece with true personality",
        comment: "I love the contrast between the sunny yellow beads and the silver moon charm! The evil eye feels authentic and the freshwater pearl gives it such an expensive organic touch.",
        verified: true
      }
    ]
  };

  // Client-side Local Database for static GitHub Pages hosting
  class LocalStore {
    constructor() {
      const stored = localStorage.getItem('avelune_static_db');
      if (!stored) {
        this.data = INITIAL_SEED;
        this.save();
      } else {
        try {
          this.data = JSON.parse(stored);
          if (!this.data.products || this.data.products.length === 0) {
            this.data = INITIAL_SEED;
            this.save();
          }
        } catch (e) {
          this.data = INITIAL_SEED;
          this.save();
        }
      }
    }

    save() {
      localStorage.setItem('avelune_static_db', JSON.stringify(this.data));
    }

    getProducts(filter = {}) {
      let prods = [...this.data.products];
      if (filter.category && filter.category !== 'all') {
        prods = prods.filter(p => p.categorySlug === filter.category || p.category.toLowerCase() === filter.category.toLowerCase());
      }
      return prods;
    }

    getProduct(idOrSlug) {
      return this.data.products.find(p => p.id === idOrSlug || p.slug === idOrSlug);
    }

    createOrder(payload) {
      const orderNum = Math.floor(1000 + Math.random() * 9000);
      const trackingNum = Math.floor(100000 + Math.random() * 900000);
      const order = {
        id: `AVE-${orderNum}`,
        trackingNumber: `AVL-${trackingNum}`,
        carrier: "DHL Express / Artisan White Glove",
        createdAt: new Date().toISOString(),
        fulfillmentStatus: "Handcrafting",
        paymentStatus: "Paid",
        trackingTimeline: [
          { title: "Order Placed & Verified", desc: `Order confirmed and queued for bench assembly.`, time: "Just now", completed: true },
          { title: "Artisan Bench Assembly", desc: "Our jewelers are prepping, hand-linking, and polishing your pieces.", time: "In Progress", completed: true },
          { title: "Signature Packaging & Quality Seal", desc: "Placed in branded anti-tarnish suede pouch.", time: "Pending", completed: false },
          { title: "Dispatched with Carrier", desc: "Carrier tracking pickup and departure.", time: "Pending", completed: false },
          { title: "Delivered to Doorstep", desc: "Safely delivered into your hands.", time: "Pending", completed: false }
        ],
        ...payload
      };
      this.data.orders.unshift(order);
      this.save();
      return order;
    }

    getOrder(idOrTracking) {
      const term = (idOrTracking || '').trim().toUpperCase();
      return this.data.orders.find(o => o.id.toUpperCase() === term || o.trackingNumber.toUpperCase() === term);
    }

    updateOrderStatus(id, status) {
      const order = this.data.orders.find(o => o.id === id);
      if (order) {
        order.fulfillmentStatus = status;
        this.save();
      }
      return order;
    }

    validateCoupon(code) {
      return this.data.coupons.find(c => c.code.toUpperCase() === (code || '').trim().toUpperCase());
    }

    login(email, password) {
      const user = this.data.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase().trim());
      if (user && user.passwordHash === password) {
        return user;
      }
      return null;
    }

    getMetrics() {
      const totalRev = this.data.orders.reduce((acc, o) => acc + (o.total || 0), 0);
      return {
        totalRevenue: Number(totalRev.toFixed(2)),
        totalOrders: this.data.orders.length,
        avgOrderValue: this.data.orders.length ? Number((totalRev / this.data.orders.length).toFixed(2)) : 0,
        lowStockCount: this.data.products.filter(p => p.stockCount <= 5).length,
        conversionRate: "3.84%"
      };
    }
  }

  const localStore = new LocalStore();

  const API = {
    baseUrl: '/api',

    async request(endpoint, options = {}) {
      const config = {
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        ...options
      };

      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, config);
        if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
        return await response.json();
      } catch (err) {
        // Fallback to local store for GitHub Pages / static hosting
        return this.fallback(endpoint, options);
      }
    },

    fallback(endpoint, options = {}) {
      const method = (options.method || 'GET').toUpperCase();

      // Products
      if (endpoint.startsWith('/products')) {
        if (method === 'GET') {
          const parts = endpoint.split('/products/');
          if (parts[1]) {
            const p = localStore.getProduct(decodeURIComponent(parts[1]));
            return { success: true, product: p };
          }
          const cat = new URLSearchParams(endpoint.split('?')[1] || '').get('category');
          const prods = localStore.getProducts({ category: cat });
          return { success: true, count: prods.length, products: prods };
        }
      }

      // Orders
      if (endpoint === '/orders' && method === 'GET') {
        return { success: true, orders: localStore.data.orders };
      }
      if (endpoint === '/orders' && method === 'POST') {
        const body = JSON.parse(options.body || '{}');
        const order = localStore.createOrder(body);
        return { success: true, order };
      }
      if (endpoint.startsWith('/orders/') && endpoint.endsWith('/status')) {
        const orderId = endpoint.split('/orders/')[1].split('/status')[0];
        const body = JSON.parse(options.body || '{}');
        const updated = localStore.updateOrderStatus(orderId, body.status);
        return { success: true, order: updated };
      }
      if (endpoint.startsWith('/orders/')) {
        const id = endpoint.split('/orders/')[1];
        const order = localStore.getOrder(id);
        return { success: true, order };
      }

      // Tracking
      if (endpoint.startsWith('/track/')) {
        const q = endpoint.split('/track/')[1];
        const order = localStore.getOrder(decodeURIComponent(q));
        if (!order) return { success: false, message: 'No shipment found' };
        return { success: true, order };
      }

      // Reviews
      if (endpoint.startsWith('/reviews')) {
        return { success: true, reviews: localStore.data.reviews };
      }

      // Coupon
      if (endpoint.startsWith('/coupons/validate')) {
        const code = new URLSearchParams(endpoint.split('?')[1] || '').get('code');
        const c = localStore.validateCoupon(code);
        return c ? { success: true, coupon: c } : { success: false, message: 'Invalid code' };
      }

      // Auth
      if (endpoint === '/auth/login' && method === 'POST') {
        const { email, password } = JSON.parse(options.body || '{}');
        const u = localStore.login(email, password);
        if (u) {
          const { passwordHash, ...safe } = u;
          return { success: true, user: safe, token: 'token-demo' };
        }
        return { success: false, message: 'Invalid credentials' };
      }

      // Metrics
      if (endpoint === '/admin/metrics') {
        return { success: true, metrics: localStore.getMetrics() };
      }

      return { success: true };
    },

    // Methods
    getProducts(params = {}) {
      const q = new URLSearchParams(params).toString();
      return this.request(`/products${q ? '?' + q : ''}`);
    },

    getProduct(idOrSlug) {
      return this.request(`/products/${encodeURIComponent(idOrSlug)}`);
    },

    addProduct(prod) {
      return this.request('/products', { method: 'POST', body: JSON.stringify(prod) });
    },

    updateProduct(id, updates) {
      return this.request(`/products/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(updates) });
    },

    deleteProduct(id) {
      return this.request(`/products/${encodeURIComponent(id)}`, { method: 'DELETE' });
    },

    getOrders() {
      return this.request('/orders');
    },

    getOrder(id) {
      return this.request(`/orders/${encodeURIComponent(id)}`);
    },

    createOrder(data) {
      return this.request('/orders', { method: 'POST', body: JSON.stringify(data) });
    },

    updateOrderStatus(id, status) {
      return this.request(`/orders/${encodeURIComponent(id)}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
    },

    trackOrder(q) {
      return this.request(`/track/${encodeURIComponent(q)}`);
    },

    getReviews(id) {
      return this.request(`/reviews${id ? '?productId=' + encodeURIComponent(id) : ''}`);
    },

    addReview(data) {
      return this.request('/reviews', { method: 'POST', body: JSON.stringify(data) });
    },

    validateCoupon(code) {
      return this.request(`/coupons/validate?code=${encodeURIComponent(code)}`);
    },

    login(email, password) {
      return this.request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    },

    register(data) {
      return this.request('/auth/register', { method: 'POST', body: JSON.stringify(data) });
    },

    getMetrics() {
      return this.request('/admin/metrics');
    },

    subscribeNewsletter(email) {
      return this.request('/newsletter', { method: 'POST', body: JSON.stringify({ email }) });
    }
  };

  window.API = API;
})();
