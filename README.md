# LocalStore — Customer Marketplace Application

This is the **Customer Marketplace Application** for LocalStore. It provides the customer-facing shopping experience, allowing neighborhood residents to discover local stores, browse catalogs, add items to cart, checkout, and track orders in real-time.

---

## 🛍️ Customer Features & Routes

- **`http://localhost:3000/`** — Hyperlocal Storefront & Product Discovery
  - Hero banner with delivery location detection
  - Category filters (Grocery, Dairy, Bakery, Fruits, Pharmacy, Electronics)
  - Flash deals & trending products
  - Neighborhood verified stores carousel
- **`http://localhost:3000/shop/[shopId]`** — Neighborhood Storefront
  - Store hours, ratings, distance, and categories
  - Direct store inventory with instant add-to-cart
- **`http://localhost:3000/product/[productId]`** — Product Details
  - Image gallery, unit sizes, price comparisons, reviews, and store info
- **`http://localhost:3000/search` & `/explore`** — Instant Search & Filtering
- **`http://localhost:3000/cart`** — Multi-store Shopping Cart & Price Breakdown
- **`http://localhost:3000/checkout`** — Customer Delivery Address & Payment (UPI, COD, Card)
- **`http://localhost:3000/order-success`** — Confetti & Confirmation
- **`http://localhost:3000/orders` & `/orders/[orderId]`** — Live 5-Stage Order Tracking
- **`http://localhost:3000/account`** — Customer Profile, Saved Addresses (`/addresses`), Wishlist (`/favorites`), and Help (`/help`)

---

## 🏃‍♂️ Running Locally

```bash
npm run dev
```

Runs on [http://localhost:3000](http://localhost:3000).
