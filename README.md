# 🛍️ ShopSphere — Full-Stack MERN E-Commerce Platform & Admin Suite

[![CI Status](https://github.com/your-username/shopsphere/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/shopsphere/actions)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19-black?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payment%20Gateway-0C2340?logo=razorpay)](https://razorpay.com/)

A production-grade full-stack MERN e-commerce application engineered for high security, scalability, and modern UX. Includes customer storefront, shopping bag with live stock validation, Razorpay checkout, live order tracking, and an executive Admin Analytics panel with Recharts.

---

## 🚀 Key Features

### 🛒 Customer Storefront
- **Instant Search & Faceted Filtering:** Debounced search, category filters, price range sliders, and sorting (price, newest, ratings).
- **Product Details & Gallery:** Multiple thumbnail views, discount calculations, live stock availability warnings, and verified customer reviews.
- **Persistent Cart & Wishlist:** Real-time synchronization with MongoDB, server-side quantity validation, and out-of-stock guardrails.
- **Tamper-Proof Razorpay Checkout:** Cryptographic verification (HMAC-SHA256) with complete server-side price recalculation.
- **Order Tracking:** Visual fulfillment timeline (`Placed -> Packed -> Shipped -> Delivered`).

### 🛡️ Administrative Portal
- **Executive Analytics:** Metric cards (Total Revenue, Orders, Customer count, Low Stock warning).
- **Interactive Visualizations:** Recharts Area & Bar charts for monthly sales and order volumes.
- **Product Inventory Management:** Full CRUD modal interface with stock adjustments and image linking.
- **Live Order Control:** Instant fulfillment status updates with automatic inventory rollbacks on cancellation.
- **User Permission Controls:** Promote or demote users between Customer and Admin roles.

### 🔒 Enterprise Security & Reliability
- **Auth:** JWT issued in `httpOnly`, `SameSite` cookies with bcrypt password hashing.
- **Protection:** Rate limiting via `express-rate-limit`, `helmet` HTTP headers, CORS with strict origin credentialing, and `express-validator` request sanitization.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Redux Toolkit, React Router v6, Tailwind CSS, Lucide Icons, Recharts, Axios |
| **Backend** | Node.js, Express, MongoDB, Mongoose, JWT (httpOnly), Bcryptjs, Multer, Cloudinary, Razorpay SDK |
| **DevOps** | GitHub Actions CI, Vercel (Client SPA), Render (API Server), MongoDB Atlas |

---

## ⚡ Quick Start

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/shopsphere.git
cd shopsphere

# Install root orchestrator and child packages
npm run install-all
```

### 2. Configure Environment Variables

**Backend (`backend/.env`):**
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/shopsphere
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
JWT_EXPIRES_IN=7d
COOKIE_EXPIRES_DAYS=7
CLOUDINARY_CLOUD_NAME=demo_cloud
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=sample_cloudinary_secret
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

**Frontend (`frontend/.env`):**
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

### 3. Seed Database & Start
```bash
# In backend directory, seed initial demo products and accounts
npm run seed --prefix backend

# Start both backend and frontend concurrently
npm run dev
```

Visit [`http://localhost:5173`](http://localhost:5173) in your browser.

---

## 🔑 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Customer** | `customer@shopsphere.com` | `Customer@123` |
| **Admin** | `admin@shopsphere.com` | `Admin@123` |

---

## 📡 API Reference Overview

| Route | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | POST | Public | User registration & cookie issuance |
| `/api/auth/login` | POST | Public | User authentication & cookie issuance |
| `/api/auth/logout` | POST | Public | Clear httpOnly session cookie |
| `/api/auth/me` | GET | Private | Fetch authenticated user profile |
| `/api/products` | GET | Public | Search, category, price, sort & pagination |
| `/api/products/:id` | GET | Public | Single product details & customer reviews |
| `/api/products` | POST/PUT/DELETE | Admin | Catalog inventory management |
| `/api/products/:id/reviews` | POST | Private | Verified customer review submission |
| `/api/cart` | GET/POST/PUT/DELETE | Private | User bag synchronization & stock check |
| `/api/wishlist` | GET/POST/DELETE | Private | User saved items toggle |
| `/api/payment/create-order` | POST | Private | Razorpay order with server total computation |
| `/api/payment/verify` | POST | Private | Cryptographic signature verification |
| `/api/orders` | POST / GET | Private | Create order & view customer orders |
| `/api/orders/:id/status` | PATCH | Admin | Update shipment status (auto stock rollback on cancel) |
| `/api/admin/stats` | GET | Admin | Revenue, low stock counts, Recharts sales history |
| `/api/admin/users` | GET / PATCH | Admin | User list and role promotion |

---

## 🚢 Deployment Guide

### Frontend (Vercel)
1. Push project to GitHub.
2. Import repository in **Vercel**.
3. Set **Root Directory** to `frontend`.
4. Add Environment Variable:
   - `VITE_API_BASE_URL`: `https://your-backend.onrender.com/api`
   - `VITE_RAZORPAY_KEY_ID`: Your Razorpay Test Key ID.
5. Deploy.

### Backend (Render)
1. In **Render**, create a new **Web Service** connected to your repository.
2. Set **Root Directory** to `backend`.
3. Set **Build Command** to `npm install`.
4. Set **Start Command** to `node src/server.js`.
5. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `MONGO_URI`: Your MongoDB Atlas connection URI.
   - `JWT_SECRET`: Random 64-character secret.
   - `CLIENT_URL`: `https://your-frontend.vercel.app`
   - `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`: Your Razorpay credentials.

---

## 📄 License
This project is licensed under the MIT License.
