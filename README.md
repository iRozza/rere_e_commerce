# AVELUNE Atelier Joaillerie — Handcrafted Accessories eCommerce

A full-featured, luxury-aesthetic eCommerce platform for **AVELUNE**, an artisanal fashion jewelry brand specializing in handcrafted sterling silver chokers, layered butterfly anklets, coin disc bracelets, and bohemian celestial talismans.

---

## ✦ Key Features & Architecture

### 1. Modern Luxury Aesthetic & Conversion-Focused Design
- **Warm Atelier Palette**: Rich obsidian tones, warm pearl ivory (`#FAF8F5`), champagne gold accents (`#C5A059`), and crisp typography pairing **Playfair Display** (editorial serif) with **Plus Jakarta Sans** (clean contemporary sans).
- **Sticky Announcement Bar**: Promotes free worldwide express shipping on orders over $50 and highlights small-batch craftsmanship.
- **Dynamic Currency Switcher**: Real-time conversions across **USD ($)**, **EUR (€)**, **GBP (£)**, and **EGP (E£)**.
- **Mobile-First Responsive Layout**: Smooth slide-over navigation drawer, touch-friendly product cards, and responsive checkout.

### 2. Handcrafted Pieces Catalog (Directly from Uploaded Product Photos)
1. **L'Ombre Liquid Herringbone Choker** (`/images/products/herringbone-necklace.jpg`): Solid 925 sterling silver ribbon links with a fluid, mirror-shine finish that contours flat against the collarbone without twisting.
2. **Papillon Dual-Layer Chevron & Bead Anklet** (`/images/products/butterfly-chevron-anklet.jpg`): Dual-strand architecture uniting chevron herringbone with a satellite bead chain and a hand-cast butterfly charm.
3. **Éclipse Tri-Disc Beaded Bracelet** (`/images/products/eclipse-disc-bracelet.jpg`): Circular mirror-buffed discs floating between micro ball beads for a soft ambient chime and effortless stacking.
4. **Soleil & Lune Evil Eye Artisan Bracelet** (`/images/products/soleil-lune-beaded-bracelet.jpg`): Half-and-half artisan piece with Japanese yellow seed beads, lampwork evil eye talisman, genuine baroque freshwater pearl, and smiling crescent moon charm.
5. *Plus complementary handcrafted additions*: Céleste Hammered Silver Cuff, Aura Baroque Pearl Drop, Serpentine French Rope Anklet, and Astral Starburst Medallion.

### 3. Comprehensive Page Experience
- **Homepage (`#/`)**:
  - High-impact editorial hero banner with floating artisan badge and direct CTAs.
  - 4 Value Pillars: Small-batch making, solid 925 sterling silver, 1-year craft warranty, and complimentary gift packaging.
  - Curated collection banners: Necklaces & Chokers, Artisan Bracelets, Delicate Anklets.
  - Bestsellers & New Arrivals grids with ratings, stock status, and instant add-to-cart.
  - Brand Story teaser with founder's quote and workshop philosophy.
  - Verified buyer testimonial cards.
  - Interactive Instagram / Studio feed lookbook.
  - Newsletter subscription box with instant discount perk.
- **Shop / Catalog Page (`#/shop`)**:
  - Dynamic category filtering (`All`, `Necklaces`, `Bracelets`, `Anklets`).
  - Real-time search with instant keystroke filtering.
  - Price range slider / min-max inputs.
  - "In Stock Only" toggle.
  - Sorting (Featured, Price: Low-to-High, Price: High-to-Low, Rating).
  - Quick View modal for previewing details and adding to cart without navigating away.
- **Product Detail Page (`#/product/:id`)**:
  - Multi-image interactive gallery with thumbnail selector.
  - Low-stock indicator ("Only 6 left from this batch").
  - Savings badge (Strike-through comparison price).
  - Quantity selector with stock upper limit.
  - Direct "Add to Atelier Bag" and "Instant Buy Now" CTAs.
  - Collapsible accordions for Materials & Dimensions, Jewelry Care, and Gift Packaging.
  - Verified collector reviews section with 5-star ratings and review submission form.
- **Brand Story Page (`#/story`)**:
  - The philosophy of slow batch making, ethical recycled metallurgy, and the 1-year craftsmanship guarantee.
- **Slide-Over Cart Drawer**:
  - Dynamic free shipping progress bar ("Add $18.00 more to unlock Free Worldwide Shipping").
  - In-cart quantity adjusters and removal controls.
  - Live subtotal recalculation.
- **Multi-Step Checkout Experience (`#/checkout`)**:
  - Customer contact & delivery address validation.
  - Shipping tier selection (Standard Insured vs. Express White Glove Courier).
  - Interactive payment gateway simulator (Stripe-style credit card formatting with auto-spaced digits, MM/YY expiry mask, and CVC; PayPal Express; Cash on Delivery).
  - Order bump upsell: Anti-Tarnish Suede Polishing Cloth for $6.00.
  - Promo code validation system (e.g. `AVELUNE15`, `WELCOME20`, `FREESHIP`).
  - Real-time tax (8%) and shipping calculation.
- **Order Confirmation Page (`#/order-confirmed/:id`)**:
  - Displays generated Order ID (`#AVE-XXXX`) and Carrier Tracking ID (`AVL-XXXXXX`).
  - Printable/downloadable invoice button.
  - Direct link to track shipment.
- **Public Order Tracking Portal (`#/track`)**:
  - Enter Order ID or Tracking ID.
  - Visual step-by-step milestone timeline (`Order Placed`, `Artisan Bench Assembly`, `Packaging Seal`, `Dispatched`, `Delivered`).
- **Customer Account Portal (`#/account`)**:
  - Sign in, registration, or **One-Click Demo Login** (`Elena Rostova`).
  - Complete order history with live status chips and tracking jump links.
  - Saved shipping address book.
  - Curated wishlist items with direct "Move to Bag".
- **Artisan Admin Suite (`#/admin`)**:
  - Protected studio dashboard for administrators and master jewelers.
  - KPI executive cards: Gross Revenue, Total Orders, Average Order Value, Conversion Rate.
  - Client orders management table with live status updater dropdown (`Handcrafting`, `Shipped`, `Delivered`) that immediately updates public tracking.
  - Product catalog manager: Live stock editor, Add New Product modal, and delete action.

---

## ✦ Getting Started

### Launching the Website
Run the included launcher or execute via Node:

```bash
# Double-click start.bat, or run from PowerShell / Terminal:
.\start.bat

# Or directly with node:
.\node.cmd server.js
```

Then open your browser at:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## ✦ Demo Accounts & Promo Codes

### One-Click Demo Logins
- **Collector Demo**: `elena@avelune.com` (Password: `demo123`) — Has pre-seeded past orders and saved shipping addresses.
- **Artisan Admin Demo**: `admin@avelune.com` (Password: `admin123`) — Unlocks the Master Admin Suite (`#/admin`).

### Active Promo Codes
- `AVELUNE15` — 15% discount on all orders
- `WELCOME20` — 20% discount on orders over $50
- `FREESHIP` — 100% Free worldwide express shipping
- `SILVER10` — 10% discount on sterling silver jewelry

