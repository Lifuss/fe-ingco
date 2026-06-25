# INGCO Ukraine E-Commerce Platform — Frontend Client

[![Live Demo](https://img.shields.io/badge/Demo-Live%20Site-orange?style=for-the-badge&logo=vercel)](https://ingcoua.com.ua)
[![Next.js Version](https://img.shields.io/badge/Next.js-16.2.3-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org)
[![React Version](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)

A high-performance, responsive e-commerce web application built for the official distributor of **INGCO** tools in Ukraine. The platform is architected to serve three distinct customer segments: B2C retail shoppers, verified B2B wholesale partners, and platform administrators.

Developed with **Next.js 16 (App Router)**, **React 19**, **Redux Toolkit**, and **Tailwind CSS 4**, this repository represents the modern frontend architecture migrating from an older legacy stack.

---

## 🌟 Key Features & Portals

### 🛒 1. B2C Retail Catalog

Designed for direct consumers with a focus on speed, user experience, and search engine optimization.

- **Product Catalog & Search:** High-performance listing with category filtering and dynamic search.
- **Shopping Cart & Wishlist:** Custom state sync preserving cart items and user favorites across sessions.
- **Order Flow:** Seamless checkout integrated with **Nova Poshta API** for real-time city and branch selection.
- **Order History:** Full tracking of past orders and delivery statuses for registered retail users.

### 💼 2. B2B Wholesale Portal

Tailored for verified business partners, optimized for speed and bulk operations.

- **Density Layouts:** Interactive table views (via `@tanstack/react-table`) for quick scanning.
- **Bulk Export:** Export product lists to Excel files with barcode rendering (`jsbarcode`) for wholesale inventories.
- **B2B-Specific Pricing:** Live currency conversion and volume-based wholesale discount tiers.

### 📊 3. Admin CRM Dashboard

A fully-featured administrative dashboard for site management.

- **Interactive Analytics:** Rich visualizations and reports using `recharts`.
- **Content Management:** Full CRUD management for products, multi-level category trees, and users.
- **Order Processing:** State-machine transitions for managing orders (`PENDING_CONFIRMATION`, `PENDING_PAYMENT`, `ASSEMBLING`, `SHIPPED`, `COMPLETED`, `CANCELLED`).
- **Support Tickets:** Internal messaging system for customer service ticket tracking.

---

## 🛠️ Tech Stack & Architecture Highlights

### **Frontend Framework & Core**

- **Next.js 16.2 & React 19:** Utilizes Server Components by default to minimize client-side bundle sizes, and Client Components at the leaf level for interactivity. Incorporates Next.js 16 async dynamic APIs (`params`, `searchParams`, `cookies()`).
- **TypeScript:** Strict type checking configured across the workspace with unified domain interfaces.

### **State Management & Data Fetching**

- **Redux Toolkit & Redux Persist:** Manages application state (such as auth token, cart, favorites, and exchange rates) with persistent storage and serialize-safe middleware.
- **Axios with Interceptors:** Custom Axios client with silent access token refresh and request token injection.

### **UI & Styling**

- **Tailwind CSS 4:** Modern utility styling with custom orange/gold branding matching the official tool importer design language.
- **shadcn v4 & Radix UI:** Accessible, customizable unstyled primitives as UI building blocks.
- **TanStack Table v8:** Optimized tables wrapping data grids.
- **React Hook Form + Zod:** Form validation with Ukrainian localization rules and schema enforcement.

### **Performance & SEO**

- Custom JSON-LD structured schemas (`LocalBusiness`, `WebSite`, `Product`) for rich search results.
- Next.js dynamic image processing (`next/image`) for optimized WebP/AVIF formats.
- Pre-configured middleware (`proxy.ts`) for edge-level route protection.

---

## 📂 Repository Structure

```
src/
├── app/                          # Next.js App Router (pages & layouts)
│   ├── (retail-catalog)/         # B2C catalog route group (main shop view)
│   ├── about-us/                 # Contacts, support, partnership pages
│   ├── auth/                     # Authentication (login, register, forgot-password)
│   ├── dashboard/                # CRM admin dashboard (CRM tables, sidebar, statistics)
│   ├── ui/                       # Reusable UI component library (buttons, forms, skeletons, etc.)
│   └── globals.css               # Global styles (Tailwind + CSS variables)
├── lib/                          # Application state, hooks, and utility functions
│   ├── appState/                 # Redux store, slices, and async thunks
│   ├── novaPoshta.ts             # Nova Poshta delivery API integration
│   ├── validationSchema.ts       # Zod form validation schemas
│   └── types.ts                  # Shared TypeScript interfaces
└── proxy.ts                      # Route protection middleware
```

---

## 🚀 Getting Started

### 📋 Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### 🔧 Setup & Local Development

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Lifuss/fe-ingco.git
   cd fe-ingco
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file at the root of the project using `.env.example` as a reference:

   ```env
   NEXT_PUBLIC_API=https://api-ingco-service.win/api
   NEXT_PUBLIC_VIBER_URL=...
   NEXT_PUBLIC_TELEGRAM_URL=...
   NP_API_KEY=your_nova_poshta_api_key
   POSTGRES_URL=your_postgres_db_url_for_nova_poshta_data
   ```

4. **Run the Development Server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 📄 License

This project is proprietary and copyright © 2026 official distributor of **INGCO** Ukraine. All rights reserved. Used for demonstration and portfolio purposes only.
