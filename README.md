# VÉLORA — Fashion Without Limits
### Premium Multi-Category Fashion Dropshipping Marketplace

![VÉLORA Luxury Marketplace](https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=85)

---

## 1. Brand Identity & Executive Overview

**VÉLORA** is an enterprise-grade multi-category fashion dropshipping marketplace engineered for the modern luxury consumer. It merges the seamless shopping convenience and feature richness of AJIO, Amazon, Flipkart, and Meesho with the high-fashion editorial aesthetics of international luxury houses.

- **Tagline**: *Fashion Without Limits.*
- **Market**: India (with multi-currency international architecture ready).
- **Currency**: Indian Rupee (₹ INR).
- **Core Departments**:
  - **Men’s Sartorial**: Double-breasted blazers, French linen shirts, wholecut Goodyear leather Oxfords, silk accessories.
  - **Women’s Haute Couture**: Bias-cut Mulberry silk gowns, Kashi Kadwa Banarasi sarees with silver-gilt zari, Italian calfskin Kelly totes, 18k fine jewellery.
  - **Kids’ Boutique**: Chanderi festive kurta sets, tiered French tulle ballerina dresses, hypoallergenic organic infant wear.
- **Design Philosophy**: Warm ivory (`#FAF9F6`), soft beige (`#F4EFEA`), champagne gold accents (`#C5A880`), refined serif typography (*Playfair Display*) and modern sans-serif (*Plus Jakarta Sans*).

---

## 2. Technology Stack

### Frontend:
- **Framework**: React 18.3, Vite 6, TypeScript 5.7
- **Styling**: Tailwind CSS 3.4 (custom luxury design tokens), PostCSS, Autoprefixer
- **State Management**: Zustand 5.0 (AuthStore, CartStore with persistence, WishlistStore)
- **Icons & Motion**: Lucide React, Framer Motion
- **HTTP Client**: Axios with automatic JWT Bearer token interceptor & error handling

### Backend:
- **Runtime**: Node.js 22 LTS, Express 4.21, TypeScript 5.7
- **Database & ORM**: MySQL 8.0, Prisma ORM 5.22 (Normalized schema with 35+ models)
- **Authentication**: JWT access tokens + refresh token rotation, bcrypt password hashing, Role-Based Access Control (RBAC)
- **Security**: Helmet, CORS with credential support, express-rate-limit, Zod request validation

### Integrations & Dropshipping Automation:
- **Payments**: Razorpay India (UPI, NetBanking, Debit/Credit Cards) + Cash on Delivery (COD)
- **Supplier Operations**: Dropshipping purchase order creation, automatic margin calculation, supplier fulfillment dispatch, courier waybill tracking (BlueDart, Delhivery)
- **AI Product Studio**: Generative luxury fashion descriptions, SEO metadata generation, and studio photographic visualization with attribution safeguards

---

## 3. Verified Seed Credentials

The database and in-memory luxury engine are pre-hydrated with realistic credentials. The frontend login page also features **1-Click Demo Buttons** for instant evaluation:

| Role | Email | Password | Scope & Authority |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@velora.com` | `VeloraAdmin2026!` | Universal authority over all departments, catalog, orders, suppliers, staff & analytics |
| **Men’s Manager** | `men.manager@velora.com` | `MenManager2026!` | Autonomous control over Men’s catalog, sizing variants & inventory |
| **Women’s Manager** | `women.manager@velora.com` | `WomenManager2026!` | Autonomous control over Women’s haute apparel, sarees & accessories |
| **Kids’ Manager** | `kids.manager@velora.com` | `KidsManager2026!` | Autonomous control over Kids’ clothing & festive ensembles |
| **Patron Customer** | `customer@velora.com` | `Customer2026!` | Consumer account with saved orders, addresses and wishlist |

### Active Promotional Codes:
- `WELCOME10`: 10% discount on orders above ₹1,999 (Max discount: ₹1,500)
- `MEN20`: 20% discount on Men's formalwear and blazers above ₹4,999 (Max discount: ₹2,500)
- `VELORA500`: Flat ₹500 discount on orders above ₹2,999

---

## 4. Acceptance Test Results (100% Passed)

The automated test suite (`backend/test/run-tests.ts`) executes and verifies all key workflows:

```bash
======================================================
🧪 RUNNING VÉLORA ACCEPTANCE & INTEGRATION TEST SUITE
======================================================

GET /health 200 - Health Check endpoint responds healthy
  ✅ PASS: Health Check endpoint responds healthy

--- WORKFLOW A: Customer Registration, Browse, Filter, Cart & COD Checkout ---
  ✅ PASS: Customer registration succeeds
  ✅ PASS: Customer login returns JWT token
  ✅ PASS: Browse Men department with sorting
  ✅ PASS: COD Order created & confirmed

--- WORKFLOW B: Razorpay Online Payment & Server-Side Verification ---
  ✅ PASS: Razorpay payment intent initialized
  ✅ PASS: Payment verified & Order status marked SUCCESS

--- WORKFLOW C: Admin Import, AI Studio & Publishing ---
  ✅ PASS: Super Admin login authenticated
  ✅ PASS: AI Supplier product parsed with auto-calculated margin
  ✅ PASS: AI Description generator produced luxury copy and SEO metadata
  ✅ PASS: AI Image studio generated safe fashion editorial asset
  ✅ PASS: Newly created AI-enriched product published

--- WORKFLOW D: Supplier Fulfillment, Tracking & Delivery Timeline ---
  ✅ PASS: Admin assigned courier & tracking number
  ✅ PASS: Customer live order tracking timeline updated

--- WORKFLOW E: Department Manager RBAC & Role Separation ---
  ✅ PASS: Super Admin created Men's Department Manager
  ✅ PASS: Department Manager logged in
  ✅ PASS: Department Manager authorized to view business overview
  ✅ PASS: Standard customer strictly blocked (403 Forbidden) from administrative routes

--- WORKFLOW F: Coupon Creation, Application & Discount Calculation ---
  ✅ PASS: Admin created new promotional coupon
  ✅ PASS: 15% discount accurately calculated on ₹5,000 subtotal (₹750)
  ✅ PASS: Correctly rejected order below ₹3,000 minimum order value threshold

======================================================
📊 TEST SUITE SUMMARY: 21 PASSED, 0 FAILED
======================================================
```

---

## 5. Local Development Setup

### Prerequisites:
- Node.js 20+ LTS
- npm 10+

### Option A: Quick Start (Full Stack)
```bash
# 1. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 2. Run backend (Terminal 1)
cd backend && npm run dev

# 3. Run frontend (Terminal 2)
cd frontend && npm run dev
```

Visit the application at: **`http://localhost:5173`**

### Option B: Run Automated Test Suite
```bash
cd backend && npm test
```

---

## 6. Docker & Production Deployment

A multi-stage containerized setup is provided in `docker-compose.yml`:

```bash
# Boot MySQL 8, Backend API, and Nginx Frontend
docker-compose up --build -d
```

- **Frontend**: `http://localhost` or `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api/v1`
- **Health Check**: `http://localhost:5000/health`
- **MySQL 8**: `localhost:3306`

---

## 7. Architecture & Directory Structure

```
velora/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # Complete MySQL 8 schema (35+ models)
│   │   └── seed.ts              # Database seeding script
│   ├── src/
│   │   ├── config/              # Typed environment variables
│   │   ├── middleware/          # JWT auth, RBAC & error handler
│   │   ├── modules/
│   │   │   ├── ai/              # AI description & image generation studio
│   │   │   ├── analytics/       # Business financials & department breakdown
│   │   │   ├── auth/            # Registration, login, profile, refresh token
│   │   │   ├── categories/      # Departments, categories & brands
│   │   │   ├── coupons/         # Promo codes & discount calculator
│   │   │   ├── orders/          # Checkout, Razorpay verification, COD
│   │   │   ├── products/        # Multi-facet filters, sorting, CRUD
│   │   │   ├── returns/         # Concierge doorstep returns & refunds
│   │   │   ├── reviews/         # Verified buyer appraisals & ratings
│   │   │   ├── suppliers/       # Supplier directory & purchase orders
│   │   │   ├── support/         # Customer ticket desk & messaging
│   │   │   └── users/           # Staff & department manager appointments
│   │   ├── utils/               # High-fidelity luxury mock store & seed engine
│   │   └── server.ts            # Express server initialization
│   └── test/
│       └── run-tests.ts         # Acceptance test suite (Workflows A to F)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/           # MetricCard, AdminSidebar
│   │   │   ├── cart/            # CartDrawer with progress bar
│   │   │   ├── common/          # Button, Badge, Modal, Skeleton
│   │   │   ├── layout/          # Navbar, MegaMenu, MobileNav, Footer
│   │   │   └── product/         # ProductCard, Grid, Filters, Gallery, SizeGuide, Reviews
│   │   ├── pages/
│   │   │   ├── Account/         # Profile, Orders, Addresses, Returns, Tickets
│   │   │   ├── Admin/           # Dashboard, Products, Editor, Suppliers, Orders, AIStudio, Staff, Analytics
│   │   │   ├── Auth/            # Login (with 1-click demo accounts), Register
│   │   │   ├── Home.tsx         # Hero carousel, categories, trending tabs, testimonials
│   │   │   ├── DepartmentPage.tsx # /men, /women, /kids with facet filters & sorting
│   │   │   ├── ProductDetailPage.tsx # Zoom gallery, PIN checker, size matrix, reviews
│   │   │   ├── CartPage.tsx     # Full review bag & voucher application
│   │   │   ├── CheckoutPage.tsx # Multi-step address & payment (Razorpay / COD)
│   │   │   ├── OrderSuccessPage.tsx # Confirmation & reference number
│   │   │   ├── TrackOrderPage.tsx # Live logistics timeline
│   │   │   └── WishlistPage.tsx # Saved products grid
│   │   ├── store/               # Zustand stores (Auth, Cart, Wishlist)
│   │   ├── services/            # Axios API client
│   │   └── types/               # TypeScript interfaces
│   ├── tailwind.config.js       # Luxury color palette configuration
│   └── vite.config.ts           # Vite proxy & build configuration
├── docker/
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── nginx.conf
├── docker-compose.yml
└── README.md
```

---

*VÉLORA — Fashion Without Limits.*
