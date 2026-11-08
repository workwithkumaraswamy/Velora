# VÉLORA Technical Architecture & System Specification

## 1. High-Level System Architecture

VÉLORA is architected as an enterprise multi-tier e-commerce dropshipping system.

```
┌─────────────────────────────────────────────────────────────┐
│                    VÉLORA Client Layer                      │
│   React 18 + Vite SPA + Tailwind CSS + Framer Motion        │
│   (Consumer Marketplace, Customer Portal, Admin Console)    │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON REST APIs
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway & Security                  │
│   Express + Helmet + CORS + Rate Limiter + JWT Bearer Auth   │
└──────────────────────────────┬──────────────────────────────┘
                               │
       ┌───────────────────────┼───────────────────────┐
       ▼                       ▼                       ▼
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│ Catalog &    │       │ Dropshipping │       │ Orders &     │
│ Sizing Core  │       │ Operations   │       │ Payments     │
└──────┬───────┘       └──────┬───────┘       └──────┬───────┘
       │                      │                      │
       └──────────────────────┼──────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 Prisma Data Access Layer                    │
│   Normalized Schema (35+ Entities, Indexes, Foreign Keys)   │
└──────────────────────────────┬──────────────────────────────┘
                               │
       ┌───────────────────────┴───────────────────────┐
       ▼                                               ▼
┌──────────────────────────────┐       ┌──────────────────────────────┐
│       MySQL 8.0 Engine       │       │    VÉLORA Pre-Seeded Store   │
│  (Production / Docker Mode)  │       │   (Local Standalone Dev)     │
└──────────────────────────────┘       └──────────────────────────────┘
```

## 2. Dropshipping Operational Flow

1. **Patron Order Placement**: Customer completes checkout via Razorpay (verified signature) or COD.
2. **Order Routing**: Order items are parsed and grouped by their assigned supplier partner.
3. **Purchase Order Issuance**: A corresponding `SupplierOrder` is dispatched with `status: REQUESTED`.
4. **Supplier Confirmation**: The supplier acknowledges stock allocation and accepts the purchase order (`status: CONFIRMED`).
5. **Shipment Generation**: Courier partner (BlueDart / Delhivery) allocates a tracking waybill ID.
6. **Live Consumer Timeline**: Customer tracks the parcel status in real time on `/track-order`.

## 3. Role-Based Access Control (RBAC) Matrix

| Resource / Action | SUPER_ADMIN | MENS_MANAGER | WOMENS_MANAGER | KIDS_MANAGER | ORDER_MANAGER | SUPPORT_MANAGER | CUSTOMER |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Browse & Buy Catalog | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manage Men's Products | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage Women's Products | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage Kids' Products | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Manage Suppliers & Waybills | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Manage Returns & Support | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Appoint Department Staff | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Create Promotional Coupons | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Financial Profit Reports | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

## 4. Security Protocols

- **Password Hashing**: Salted bcrypt (cost factor 10).
- **Session Tokens**: Short-lived JWT access tokens + rotating refresh tokens.
- **Payment Verification**: Server-side HMAC SHA256 signature verification matching Razorpay secret.
- **Input Sanitization**: Zod validation schemas across all endpoints.
- **Data Protection**: Zero storage of raw financial card details.
