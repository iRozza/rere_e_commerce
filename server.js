const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const db = require('./data/db');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 5 * 1024 * 1024) {
        req.destroy();
        reject(new Error('Body too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  // API Routes
  if (pathname.startsWith('/api/')) {
    try {
      // Products list & filter
      if (pathname === '/api/products' && method === 'GET') {
        const products = db.getProducts(parsedUrl.query);
        return sendJson(res, 200, { success: true, count: products.length, products });
      }

      // Single Product
      const productMatch = pathname.match(/^\/api\/products\/([^\/]+)$/);
      if (productMatch && method === 'GET') {
        const idOrSlug = productMatch[1];
        const product = db.getProductById(idOrSlug);
        if (!product) return sendJson(res, 404, { success: false, message: 'Product not found' });
        return sendJson(res, 200, { success: true, product });
      }

      // Create Product (Admin)
      if (pathname === '/api/products' && method === 'POST') {
        const body = await parseBody(req);
        if (!body.name || !body.price) {
          return sendJson(res, 400, { success: false, message: 'Name and price are required' });
        }
        const created = db.addProduct(body);
        return sendJson(res, 201, { success: true, product: created });
      }

      // Update Product (Admin)
      if (productMatch && (method === 'PUT' || method === 'PATCH')) {
        const id = productMatch[1];
        const body = await parseBody(req);
        const updated = db.updateProduct(id, body);
        if (!updated) return sendJson(res, 404, { success: false, message: 'Product not found' });
        return sendJson(res, 200, { success: true, product: updated });
      }

      // Delete Product (Admin)
      if (productMatch && method === 'DELETE') {
        const id = productMatch[1];
        const ok = db.deleteProduct(id);
        if (!ok) return sendJson(res, 404, { success: false, message: 'Product not found' });
        return sendJson(res, 200, { success: true, message: 'Product deleted' });
      }

      // Orders list (Admin)
      if (pathname === '/api/orders' && method === 'GET') {
        const orders = db.getOrders();
        return sendJson(res, 200, { success: true, orders });
      }

      // Single Order
      const orderMatch = pathname.match(/^\/api\/orders\/([^\/]+)$/);
      if (orderMatch && method === 'GET') {
        const id = orderMatch[1];
        const order = db.getOrderById(id);
        if (!order) return sendJson(res, 404, { success: false, message: 'Order not found' });
        return sendJson(res, 200, { success: true, order });
      }

      // Create Order (Checkout)
      if (pathname === '/api/orders' && method === 'POST') {
        const body = await parseBody(req);
        if (!body.items || !body.items.length) {
          return sendJson(res, 400, { success: false, message: 'Cart items required' });
        }
        if (!body.customer || !body.customer.email) {
          return sendJson(res, 400, { success: false, message: 'Customer email required' });
        }
        const order = db.createOrder(body);
        return sendJson(res, 201, { success: true, order });
      }

      // Update Order Status (Admin)
      const orderStatusMatch = pathname.match(/^\/api\/orders\/([^\/]+)\/status$/);
      if (orderStatusMatch && (method === 'PATCH' || method === 'PUT')) {
        const id = orderStatusMatch[1];
        const body = await parseBody(req);
        if (!body.status) return sendJson(res, 400, { success: false, message: 'Status required' });
        const updated = db.updateOrderStatus(id, body.status);
        if (!updated) return sendJson(res, 404, { success: false, message: 'Order not found' });
        return sendJson(res, 200, { success: true, order: updated });
      }

      // Public Track Order Lookup
      const trackMatch = pathname.match(/^\/api\/track\/([^\/]+)$/);
      if (trackMatch && method === 'GET') {
        const queryTerm = decodeURIComponent(trackMatch[1]);
        const order = db.getOrderById(queryTerm);
        if (!order) {
          return sendJson(res, 404, { success: false, message: 'No order found matching that number' });
        }
        return sendJson(res, 200, {
          success: true,
          order: {
            id: order.id,
            trackingNumber: order.trackingNumber,
            carrier: order.carrier,
            fulfillmentStatus: order.fulfillmentStatus,
            createdAt: order.createdAt,
            trackingTimeline: order.trackingTimeline,
            itemsCount: (order.items || []).length,
            shippingAddress: {
              city: order.shippingAddress?.city,
              country: order.shippingAddress?.country
            }
          }
        });
      }

      // Reviews
      if (pathname === '/api/reviews' && method === 'GET') {
        const productId = parsedUrl.query.productId;
        const reviews = db.getReviews(productId);
        return sendJson(res, 200, { success: true, count: reviews.length, reviews });
      }

      if (pathname === '/api/reviews' && method === 'POST') {
        const body = await parseBody(req);
        if (!body.productId || !body.author || !body.comment) {
          return sendJson(res, 400, { success: false, message: 'Missing review fields' });
        }
        const review = db.addReview(body);
        return sendJson(res, 201, { success: true, review });
      }

      // Coupon Validation
      if (pathname === '/api/coupons/validate' && method === 'GET') {
        const code = parsedUrl.query.code;
        if (!code) return sendJson(res, 400, { success: false, message: 'Code required' });
        const coupon = db.validateCoupon(code);
        if (!coupon) return sendJson(res, 404, { success: false, message: 'Invalid or expired promo code' });
        return sendJson(res, 200, { success: true, coupon });
      }

      // Auth: Login
      if (pathname === '/api/auth/login' && method === 'POST') {
        const body = await parseBody(req);
        const { email, password } = body;
        const data = db.read();
        const user = data.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase().trim());
        if (!user || user.passwordHash !== password) {
          return sendJson(res, 401, { success: false, message: 'Invalid email or password' });
        }
        const { passwordHash, ...safeUser } = user;
        return sendJson(res, 200, {
          success: true,
          token: 'token-' + Buffer.from(safeUser.email).toString('base64'),
          user: safeUser
        });
      }

      // Auth: Register
      if (pathname === '/api/auth/register' && method === 'POST') {
        const body = await parseBody(req);
        const { email, password, name, phone } = body;
        if (!email || !password || !name) {
          return sendJson(res, 400, { success: false, message: 'Email, password, and name required' });
        }
        const data = db.read();
        if (data.users.some(u => u.email.toLowerCase() === email.toLowerCase().trim())) {
          return sendJson(res, 409, { success: false, message: 'An account with this email already exists' });
        }
        const newUser = {
          id: 'user-' + Date.now(),
          email: email.trim(),
          passwordHash: password,
          name: name.trim(),
          phone: phone ? phone.trim() : '',
          role: 'customer',
          joinedDate: new Date().toISOString().split('T')[0],
          addresses: [],
          wishlist: []
        };
        data.users.push(newUser);
        db.write(data);

        const { passwordHash, ...safeUser } = newUser;
        return sendJson(res, 201, {
          success: true,
          token: 'token-' + Buffer.from(safeUser.email).toString('base64'),
          user: safeUser
        });
      }

      // Admin Metrics
      if (pathname === '/api/admin/metrics' && method === 'GET') {
        const metrics = db.getMetrics();
        return sendJson(res, 200, { success: true, metrics });
      }

      // Newsletter
      if (pathname === '/api/newsletter' && method === 'POST') {
        const body = await parseBody(req);
        if (!body.email) return sendJson(res, 400, { success: false, message: 'Email is required' });
        db.addNewsletter(body.email);
        return sendJson(res, 200, { success: true, message: 'Subscribed to Avelune Atelier Gazette!' });
      }

      // 404 API Route
      return sendJson(res, 404, { success: false, message: 'Endpoint not found' });
    } catch (err) {
      console.error('API Error:', err);
      return sendJson(res, 500, { success: false, message: 'Internal server error' });
    }
  }

  // Static File Serving
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  
  // Security check: stay within PUBLIC_DIR
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // If it's a SPA route, fallback to index.html for non-asset GET requests
      const isAsset = path.extname(pathname) !== '';
      if (!isAsset && req.headers.accept && req.headers.accept.includes('text/html')) {
        const indexPath = path.join(PUBLIC_DIR, 'index.html');
        fs.readFile(indexPath, (readErr, content) => {
          if (readErr) {
            res.writeHead(404);
            return res.end('Page Not Found');
          }
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          return res.end(content);
        });
        return;
      }

      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('File Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`✨ AVELUNE Atelier eCommerce running at http://localhost:${PORT}`);
});
