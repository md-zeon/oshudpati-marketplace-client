<h1 align="center">Oshudpati Marketplace</h1>

<p align="center">
  <em>Trusted online medicine & healthcare marketplace in Bangladesh</em>
</p>

<p align="center">
  <a href="https://oshudpati-marketplace-client.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/Live_Demo-oshudpati--marketplace--client.vercel.app-0f766e?style=flat-square&logo=vercel&logoColor=white" alt="Live Demo">
  </a>
  <img src="https://img.shields.io/github/license/md-zeon/oshudpati-marketplace-client?style=flat-square&color=0f766e" alt="License">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" alt="PRs Welcome">
  <img src="https://img.shields.io/github/package-json/v/md-zeon/oshudpati-marketplace-client?style=flat-square&color=0f766e" alt="Version">
</p>

---

## 📖 About

**Oshudpati Marketplace** is a full‑featured e‑commerce platform built for the Bangladeshi healthcare industry. Customers can browse authentic medicines, healthcare products, baby care items, personal care essentials, and wellness products from trusted pharmacies and sellers — all in one place.

This repository contains the **frontend client** built with Next.js 16 (App Router) and React 19.

---

## 🚀 Live Demo

**→ [https://oshudpati-marketplace-client.vercel.app/](https://oshudpati-marketplace-client.vercel.app/)**

---

## 🧰 Tech Stack

| Category               | Technologies                                                                                               |
| ---------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Framework**          | [Next.js 16](https://nextjs.org/) (App Router)                                                             |
| **UI Library**         | [React 19](https://react.dev/)                                                                             |
| **Language**           | [TypeScript](https://www.typescriptlang.org/)                                                              |
| **Styling**            | [Tailwind CSS v4](https://tailwindcss.com/) + `tw-animate-css`                                             |
| **UI Components**      | [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/) (via `cmdk`, `vaul`, `sonner`) |
| **Animation**          | [Motion](https://motion.dev/) (Framer Motion)                                                              |
| **Auth**               | [Better-Auth](https://www.better-auth.com/) client                                                         |
| **Forms & Validation** | [TanStack React Form](https://tanstack.com/form/latest) + [Zod](https://zod.dev/)                          |
| **Image Hosting**      | [Cloudinary](https://cloudinary.com/) via `next-cloudinary`                                                |
| **Icons**              | [Lucide React](https://lucide.dev/)                                                                        |
| **Themes**             | `next-themes`                                                                                              |
| **Env Safety**         | `@t3-oss/env-nextjs`                                                                                       |
| **Package Manager**    | [pnpm](https://pnpm.io/)                                                                                   |

---

## ✨ Key Features

- **🔍 Medicine Browsing** — Search and filter by category, dosage form, strength, price, and more
- **🛒 Multi‑Vendor Cart** — Add items from multiple sellers; cart is grouped by shop
- **📦 Checkout & Ordering** — Saved addresses, shipping cost calculation, order splitting by vendor
- **📋 Order Tracking** — Real‑time order status (Placed → Processing → Shipped → Delivered)
- **⭐ Reviews & Ratings** — Customers can review purchased medicines; sellers can reply
- **❤️ Wishlist** — Save medicines for later
- **👤 Role‑Based Dashboards** — Separate views for Customers, Sellers, and Admins
- **🔐 Authentication** — Email/password, Google OAuth, Twitter OAuth; email verification
- **📱 Responsive** — Fully mobile‑friendly with adaptive layouts

---

## 🏗️ Project Structure

```
src/
├── actions/           # Server Actions (address, admin, cart, medicine, order, review, shop, user, wishlist)
├── app/               # Next.js App Router pages
│   ├── (auth)/        # Login / Register
│   ├── (public)/      # Home, medicine detail, categories, cart, checkout, shop, wishlist, etc.
│   ├── admin/         # Admin panel
│   ├── auth-callback/ # OAuth callback handler
│   ├── dashboard/     # Customer dashboard
│   ├── email-verified/
│   ├── privacy/       # Privacy policy
│   ├── seller/        # Seller dashboard
│   ├── terms/         # Terms of service
│   └── verify-email/  # Email verification
├── components/        # Reusable UI components
│   ├── motion-primitives/
│   ├── shared/
│   └── ui/            # shadcn/ui components
├── constants/         # App-wide constants
├── hooks/             # Custom React hooks
├── lib/               # Utility libraries (auth client, local-cart, utils)
├── services/          # API service layer
└── types/             # TypeScript type definitions
```

### 📄 Route Overview

| Route                      | Description                               |
| -------------------------- | ----------------------------------------- |
| `/`                        | Homepage — featured medicines, categories |
| `/medicines`               | Browse all medicines                      |
| `/medicines/[slug]`        | Medicine detail page                      |
| `/categories`              | Symptom-based categories                  |
| `/cart`                    | Shopping cart                             |
| `/checkout`                | Checkout process                          |
| `/checkout/order-received` | Order confirmation                        |
| `/wishlist`                | User wishlist                             |
| `/shop`                    | Browse sellers / shops                    |
| `/order-tracking`          | Track orders                              |
| `/account`                 | User profile & settings                   |
| `/dashboard`               | Customer dashboard                        |
| `/seller`                  | Seller dashboard                          |
| `/admin`                   | Admin panel                               |
| `/about`                   | About us                                  |
| `/contact`                 | Contact form                              |
| `/faq`                     | FAQ                                       |
| `/privacy`                 | Privacy policy                            |
| `/terms`                   | Terms of service                          |

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 20
- [pnpm](https://pnpm.io/) (recommended) or npm / yarn

### Environment Variables

Create a `.env.local` file in the root:

```env
# Backend
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:5000/api
AUTH_URL=http://localhost:5000/api/auth

# Shipping thresholds
FREE_SHIPPING_THRESHOLD=1000
FLAT_SHIPPING_CHARGE=80

# Public (frontend)
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD=1000
NEXT_PUBLIC_FLAT_SHIPPING_CHARGE=80
```

### Install & Run

```bash
pnpm install
pnpm dev        # → http://localhost:3000
pnpm build      # Production build
pnpm start      # Start production server
pnpm lint       # Run ESLint
```

---

## 🚢 Deployment

The client is optimized for [Vercel](https://vercel.com/). Connect your repository and set the required environment variables listed above. The build command is `next build`.

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

## 📄 License

ISC — see [LICENSE](LICENSE) for details.

## 👤 Author

**Zeanur Rahaman Zeon**  
[zeon.cse@gmail.com](mailto:zeon.cse@gmail.com)
