# 🛒 Merca Backend Service & Database

This is the backend service and database management suite for the **Merca** e-commerce platform.

---

## 🚀 Quick Setup

### 1. Add PostgreSQL Connection String
Open [`backend/.env`](file:///d:/VSCODE-PROJECTS/MERCA/Merca---Ecommerce-Platform/backend/.env) and replace `DATABASE_URL` with your PostgreSQL database link:

```env
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>?sslmode=require
```

> **Compatible with:** Neon, Supabase, Render, AWS RDS, local PostgreSQL, etc.

---

### 2. Install Dependencies
In the `backend` folder:
```bash
npm install
```

---

### 3. Run Database Migrations
To execute all SQL schema files and seed data (`V001` through `V010`) in order:
```bash
npm run db:migrate
```

To test if your connection is valid:
```bash
npm run db:test
```

---

### 4. Start the Backend API Server
```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

Backend will run on **http://localhost:5000** with healthcheck at **http://localhost:5000/api/health**.

---

## 🗄️ Database Schema & Migrations (`backend/db/migration/`)

1. **`V001__create_extensions.sql`** — PostgreSQL extensions (`uuid-ossp`, `pg_trgm`, `pgcrypto`)
2. **`V002__create_auth_identity.sql`** — `users`, `customers`, `sellers`, `seller_bank_accounts`
3. **`V003__create_catalog.sql`** — `categories`, `brands`, `products`, `product_attributes`, `product_images`
4. **`V004__create_marketplace.sql`** — `seller_inventories`, `warehouses`, `inventory_items`, `stock_reservations`
5. **`V005__create_customer.sql`** — `addresses`, `cart_items`, `wishlists`, `reviews`
6. **`V006__create_orders.sql`** — `orders`, `order_items`, `shipments`, `tracking`
7. **`V007__create_payments.sql`** — `payments`, `transactions`, `refunds`
8. **`V008__create_engagement.sql`** — `search_queries`, `telemetry_events`, `activity_logs`
9. **`V009__create_promotions_returns.sql`** — `coupons`, `promotions`, `returns`
10. **`V010__seed_data.sql`** — Initial categories, electronics, accessories, test users, and sellers

