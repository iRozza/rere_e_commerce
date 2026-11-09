const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'store.json');

const INITIAL_DATA = {
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
      image: "/images/products/herringbone-necklace.jpg",
      gallery: [
        "/images/products/herringbone-necklace.jpg",
        "/images/products/herringbone-necklace.jpg"
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
      image: "/images/products/butterfly-chevron-anklet.jpg",
      gallery: [
        "/images/products/butterfly-chevron-anklet.jpg",
        "/images/products/butterfly-chevron-anklet.jpg"
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
      image: "/images/products/eclipse-disc-bracelet.jpg",
      gallery: [
        "/images/products/eclipse-disc-bracelet.jpg",
        "/images/products/eclipse-disc-bracelet.jpg"
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
      image: "/images/products/soleil-lune-beaded-bracelet.jpg",
      gallery: [
        "/images/products/soleil-lune-beaded-bracelet.jpg",
        "/images/products/soleil-lune-beaded-bracelet.jpg"
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
      image: "/images/products/celeste-cuff.svg",
      gallery: [
        "/images/products/celeste-cuff.svg"
      ],
      shortDesc: "Sculptural open cuff hand-hammered to reflect dappled light like rippling water.",
      description: "Forged on a jeweler's anvil, each Céleste cuff features thousands of individual light-catching facets that produce a soft organic glow. Malleable enough to gently adjust for a tailored wrist fit.",
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
      image: "/images/products/aura-pearl-choker.svg",
      gallery: [
        "/images/products/aura-pearl-choker.svg"
      ],
      shortDesc: "A luminous hand-selected natural baroque pearl floating on an ultra-fine 18k white gold vermeil chain.",
      description: "Each baroque pearl is grown naturally and possesses its own singular contour, iridescent luster, and character. Suspended on a whisper-thin diamond-cut silver cable chain that catches light with subtle radiance.",
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
      image: "/images/products/serpentine-anklet.svg",
      gallery: [
        "/images/products/serpentine-anklet.svg"
      ],
      shortDesc: "Twisted French rope chain designed for effortless glint on sunlit strolls and evening wear.",
      description: "Spun with tight diamond-cut helical twists, the Serpentine Anklet glimmers continuously from every perspective. Featherweight and smooth against skin, it never snags on delicate fabrics.",
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
      image: "/images/products/astral-starburst.svg",
      gallery: [
        "/images/products/astral-starburst.svg"
      ],
      shortDesc: "Intricately hand-engraved celestial compass talisman set with a shimmering central cubic zircon starlight.",
      description: "An homage to antique maritime navigational pendants and celestial wanderers. Hand-etched starburst rays radiate outwards from a bezel-set faceted center stone, encased in an artisan coin rim.",
      materials: "Heavy 925 Sterling Silver medallion with brilliant-cut conflict-free CZ stone.",
      dimensions: "Length: 20 inches + 2-inch extender. Medallion diameter: 18mm.",
      clasp: "Decorative swivel dog-clip clasp.",
      care: "Store in cool, dry velvet pouch. Buff gently with anti-tarnish polishing cloth.",
      handcraftedBy: "Artisan Maya Chen - Hand-engraved starburst relief",
      tags: ["necklace", "medallion", "starburst", "celestial", "statement", "heirloom"]
    }
  ],
  categories: [
    { id: "all", name: "All Accessories", count: 8 },
    { id: "necklaces", name: "Necklaces & Chokers", count: 3 },
    { id: "bracelets", name: "Artisan Bracelets", count: 3 },
    { id: "anklets", name: "Delicate Anklets", count: 2 }
  ],
  coupons: [
    { code: "AVELUNE15", discountPercent: 15, description: "15% off your entire order", minSpend: 30 },
    { code: "WELCOME20", discountPercent: 20, description: "20% off for first-time collectors", minSpend: 50 },
    { code: "FREESHIP", freeShipping: true, description: "Complimentary worldwide express shipping", minSpend: 0 },
    { code: "SILVER10", discountPercent: 10, description: "$10% off Sterling Silver Collection", minSpend: 40 }
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
      customer: {
        name: "Elena Rostova",
        email: "elena@avelune.com",
        phone: "+1 (555) 234-8971"
      },
      shippingAddress: {
        firstName: "Elena",
        lastName: "Rostova",
        street: "742 Evergreen Terrace, Apt 4B",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "United States"
      },
      items: [
        {
          id: "prod-herringbone-01",
          name: "L'Ombre Liquid Herringbone Choker",
          price: 68.0,
          quantity: 1,
          image: "/images/products/herringbone-necklace.jpg"
        },
        {
          id: "prod-papillon-02",
          name: "Papillon Dual-Layer Chevron & Bead Anklet",
          price: 48.0,
          quantity: 1,
          image: "/images/products/butterfly-chevron-anklet.jpg"
        }
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
    },
    {
      id: "AVE-8761",
      trackingNumber: "AVL-432190",
      carrier: "FedEx Priority Artisan",
      createdAt: "2026-11-04T10:10:00Z",
      customer: {
        name: "Chloe Dupont",
        email: "chloe.dupont@vogue-paris.fr",
        phone: "+33 6 12 34 56 78"
      },
      shippingAddress: {
        firstName: "Chloe",
        lastName: "Dupont",
        street: "18 Rue Saint-Honoré",
        city: "Paris",
        state: "Île-de-France",
        postalCode: "75001",
        country: "France"
      },
      items: [
        {
          id: "prod-soleil-04",
          name: "Soleil & Lune Evil Eye Artisan Beaded Bracelet",
          price: 54.0,
          quantity: 2,
          image: "/images/products/soleil-lune-beaded-bracelet.jpg"
        }
      ],
      subtotal: 108.0,
      discount: 0.0,
      couponCode: "",
      shippingFee: 0.0,
      tax: 0.0,
      total: 108.0,
      paymentMethod: "Apple Pay",
      paymentStatus: "Paid",
      fulfillmentStatus: "Delivered",
      trackingTimeline: [
        { title: "Order Placed", desc: "Order #AVE-8761 confirmed.", time: "Nov 4, 2026 - 10:10", completed: true },
        { title: "Artisan Handcrafted", desc: "Hand-strung with Japanese seed beads.", time: "Nov 4, 2026 - 16:00", completed: true },
        { title: "Dispatched", desc: "Departed Paris Atelier.", time: "Nov 5, 2026 - 08:45", completed: true },
        { title: "Out for Delivery", desc: "Courier on route.", time: "Nov 6, 2026 - 12:00", completed: true },
        { title: "Delivered", desc: "Delivered & signed by recipient.", time: "Nov 6, 2026 - 15:30", completed: true }
      ]
    },
    {
      id: "AVE-9012",
      trackingNumber: "AVL-110293",
      carrier: "UPS Carbon-Neutral Handcrafted",
      createdAt: "2026-11-09T18:05:00Z",
      customer: {
        name: "Marcus Sterling",
        email: "marcus.sterling@lifestyle.com",
        phone: "+1 (555) 777-3312"
      },
      shippingAddress: {
        firstName: "Marcus",
        lastName: "Sterling",
        street: "450 Sutter St, Suite 1200",
        city: "San Francisco",
        state: "CA",
        postalCode: "94108",
        country: "United States"
      },
      items: [
        {
          id: "prod-eclipse-03",
          name: "Éclipse Tri-Disc Beaded Bracelet",
          price: 42.0,
          quantity: 1,
          image: "/images/products/eclipse-disc-bracelet.jpg"
        },
        {
          id: "prod-astral-08",
          name: "Astral Starburst Medallion Necklace",
          price: 84.0,
          quantity: 1,
          image: "/images/products/astral-starburst.svg"
        }
      ],
      subtotal: 126.0,
      discount: 25.2,
      couponCode: "WELCOME20",
      shippingFee: 0.0,
      tax: 9.58,
      total: 110.38,
      paymentMethod: "Credit Card (ending 8812)",
      paymentStatus: "Paid",
      fulfillmentStatus: "Handcrafting",
      trackingTimeline: [
        { title: "Order Placed", desc: "Order #AVE-9012 received.", time: "Nov 9, 2026 - 18:05", completed: true },
        { title: "In Handcrafting", desc: "Artisan currently assembling starburst setting & disc stamping.", time: "Nov 9, 2026 - 19:40", completed: true },
        { title: "Awaiting Carrier Pickup", desc: "Packaging in signature eco-friendly gift box.", time: "Scheduled Nov 10, 2026", completed: false },
        { title: "Dispatched", desc: "In transit with UPS Carbon-Neutral.", time: "Pending", completed: false },
        { title: "Delivered", desc: "Delivered to recipient.", time: "Pending", completed: false }
      ]
    }
  ],
  reviews: [
    {
      id: "rev-01",
      productId: "prod-herringbone-01",
      author: "Sophia Laurent",
      rating: 5,
      date: "October 28, 2026",
      title: "Literally looks like melted silver on skin",
      comment: "I have worn this choker non-stop for 3 weeks! It lays so completely flat against my neck, never twists or kinks, and the mirror shine is breathtaking. Everyone asks me where I got it.",
      verified: true,
      helpfulCount: 34
    },
    {
      id: "rev-02",
      productId: "prod-herringbone-01",
      author: "Maya J.",
      rating: 5,
      date: "November 2, 2026",
      title: "Incredible weight and quality",
      comment: "The craftsmanship is top tier. You can immediately feel the difference compared to cheap fast fashion jewelry. Heavy, supple, and clasp is sturdy.",
      verified: true,
      helpfulCount: 19
    },
    {
      id: "rev-03",
      productId: "prod-papillon-02",
      author: "Camille V.",
      rating: 5,
      date: "November 1, 2026",
      title: "The butterfly charm is utterly enchanting",
      comment: "The double strand detail is so genius. The chevron catches the sun and the butterfly has this lovely artisanal weight. It stayed on during my whole trip to Amalfi!",
      verified: true,
      helpfulCount: 27
    },
    {
      id: "rev-04",
      productId: "prod-eclipse-03",
      author: "Isabella R.",
      rating: 5,
      date: "October 19, 2026",
      title: "The soft chime of the discs is calming",
      comment: "The discs have a mirror shine that hasn't tarnished at all. Looks very high end layered with my watch.",
      verified: true,
      helpfulCount: 15
    },
    {
      id: "rev-05",
      productId: "prod-soleil-04",
      author: "Amira K.",
      rating: 5,
      date: "November 5, 2026",
      title: "Unique statement piece with true personality",
      comment: "I love the contrast between the sunny yellow beads and the silver moon charm! The evil eye feels authentic and the freshwater pearl gives it such an expensive organic touch.",
      verified: true,
      helpfulCount: 42
    }
  ],
  newsletterSubscribers: [
    { email: "collector@voguemag.com", date: "2026-10-12" },
    { email: "fashionista.mia@gmail.com", date: "2026-11-01" }
  ]
};

class Database {
  constructor() {
    this.ensureDataFile();
  }

  ensureDataFile() {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf8');
    }
  }

  read() {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(content);
    } catch (err) {
      console.error('Error reading db:', err);
      return INITIAL_DATA;
    }
  }

  write(data) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (err) {
      console.error('Error writing db:', err);
      return false;
    }
  }

  getProducts(filter = {}) {
    const data = this.read();
    let prods = [...data.products];

    if (filter.category && filter.category !== 'all') {
      prods = prods.filter(p => p.categorySlug === filter.category || p.category.toLowerCase() === filter.category.toLowerCase());
    }

    if (filter.search) {
      const q = filter.search.toLowerCase();
      prods = prods.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (filter.minPrice !== undefined) {
      prods = prods.filter(p => p.price >= Number(filter.minPrice));
    }
    if (filter.maxPrice !== undefined) {
      prods = prods.filter(p => p.price <= Number(filter.maxPrice));
    }

    if (filter.sort) {
      switch (filter.sort) {
        case 'price-asc':
          prods.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          prods.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          prods.sort((a, b) => b.rating - a.rating);
          break;
        case 'reviews':
          prods.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
        case 'name':
          prods.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'featured':
        default:
          prods.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
          break;
      }
    }

    return prods;
  }

  getProductById(idOrSlug) {
    const data = this.read();
    return data.products.find(p => p.id === idOrSlug || p.slug === idOrSlug);
  }

  addProduct(newProd) {
    const data = this.read();
    const id = 'prod-' + Date.now();
    const slug = newProd.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const product = {
      id,
      slug,
      rating: 5.0,
      reviewCount: 1,
      inStock: newProd.inStock !== false,
      stockCount: Number(newProd.stockCount) || 10,
      featured: Boolean(newProd.featured),
      badge: newProd.badge || 'New Artisan Arrival',
      materials: newProd.materials || 'Handcrafted 925 Sterling Silver',
      dimensions: newProd.dimensions || 'Adjustable fit',
      clasp: newProd.clasp || 'Lobster claw clasp',
      care: newProd.care || 'Wipe with microfiber cloth.',
      handcraftedBy: newProd.handcraftedBy || 'Avelune Studio Artisans',
      tags: newProd.tags || ['artisan', 'handmade', 'avelune'],
      gallery: [newProd.image],
      ...newProd
    };
    data.products.unshift(product);
    this.write(data);
    return product;
  }

  updateProduct(id, updates) {
    const data = this.read();
    const idx = data.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    data.products[idx] = { ...data.products[idx], ...updates };
    this.write(data);
    return data.products[idx];
  }

  deleteProduct(id) {
    const data = this.read();
    const idx = data.products.findIndex(p => p.id === id);
    if (idx === -1) return false;
    data.products.splice(idx, 1);
    this.write(data);
    return true;
  }

  getOrders() {
    const data = this.read();
    return data.orders;
  }

  getOrderById(idOrTracking) {
    const data = this.read();
    const term = idOrTracking.trim().toUpperCase();
    return data.orders.find(o =>
      o.id.toUpperCase() === term ||
      o.trackingNumber.toUpperCase() === term
    );
  }

  createOrder(orderData) {
    const data = this.read();
    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const trackingNum = Math.floor(100000 + Math.random() * 900000);
    const id = `AVE-${orderNum}`;
    const trackingNumber = `AVL-${trackingNum}`;

    const order = {
      id,
      trackingNumber,
      carrier: "DHL Express / Artisan White Glove",
      createdAt: new Date().toISOString(),
      fulfillmentStatus: "Handcrafting",
      paymentStatus: "Paid",
      trackingTimeline: [
        {
          title: "Order Placed & Verified",
          desc: `Order #${id} confirmed and queued for handcrafting.`,
          time: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          completed: true
        },
        {
          title: "Artisan Bench Assembly",
          desc: "Our jewelers are prepping, hand-linking, and polishing your pieces.",
          time: "In Progress (1-2 days)",
          completed: true
        },
        {
          title: "Signature Packaging & Quality Seal",
          desc: "Placed in branded anti-tarnish suede pouch with certificate of authenticity.",
          time: "Pending",
          completed: false
        },
        {
          title: "Dispatched with Carrier",
          desc: "Carrier tracking pickup and departure.",
          time: "Pending",
          completed: false
        },
        {
          title: "Delivered to Doorstep",
          desc: "Safely delivered into your hands.",
          time: "Pending",
          completed: false
        }
      ],
      ...orderData
    };

    // Deduct stock
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach(item => {
        const prod = data.products.find(p => p.id === item.id);
        if (prod) {
          prod.stockCount = Math.max(0, (prod.stockCount || 10) - (item.quantity || 1));
          if (prod.stockCount === 0) prod.inStock = false;
        }
      });
    }

    data.orders.unshift(order);
    this.write(data);
    return order;
  }

  updateOrderStatus(orderId, status) {
    const data = this.read();
    const order = data.orders.find(o => o.id === orderId);
    if (!order) return null;
    order.fulfillmentStatus = status;

    // update timeline accordingly
    if (status === 'Shipped') {
      order.trackingTimeline.forEach(t => {
        if (t.title.includes('Dispatched') || t.title.includes('Carrier')) {
          t.completed = true;
          t.time = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        }
      });
    } else if (status === 'Delivered') {
      order.trackingTimeline.forEach(t => {
        t.completed = true;
        if (t.title.includes('Delivered')) {
          t.time = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        }
      });
    }

    this.write(data);
    return order;
  }

  getReviews(productId) {
    const data = this.read();
    if (productId) {
      return data.reviews.filter(r => r.productId === productId);
    }
    return data.reviews;
  }

  addReview(reviewData) {
    const data = this.read();
    const id = 'rev-' + Date.now();
    const newRev = {
      id,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      verified: true,
      helpfulCount: 1,
      ...reviewData
    };
    data.reviews.unshift(newRev);

    // recalculate product rating & reviewCount
    const prod = data.products.find(p => p.id === newRev.productId);
    if (prod) {
      const prodRevs = data.reviews.filter(r => r.productId === prod.id);
      const totalStars = prodRevs.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
      prod.rating = Number((totalStars / prodRevs.length).toFixed(1));
      prod.reviewCount = prodRevs.length;
    }

    this.write(data);
    return newRev;
  }

  validateCoupon(code) {
    const data = this.read();
    const coupon = data.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    return coupon || null;
  }

  getMetrics() {
    const data = this.read();
    const totalRevenue = data.orders.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
    const totalOrders = data.orders.length;
    const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;
    const lowStockCount = data.products.filter(p => p.stockCount <= 5).length;

    return {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrders,
      avgOrderValue: Number(avgOrderValue),
      lowStockCount,
      conversionRate: "3.84%",
      recentOrders: data.orders.slice(0, 5)
    };
  }

  addNewsletter(email) {
    const data = this.read();
    if (!data.newsletterSubscribers) data.newsletterSubscribers = [];
    const exists = data.newsletterSubscribers.some(s => s.email.toLowerCase() === email.toLowerCase());
    if (!exists) {
      data.newsletterSubscribers.push({ email, date: new Date().toISOString() });
      this.write(data);
    }
    return { success: true };
  }
}

module.exports = new Database();
