# Chapterly Bookstore

A high-performance, responsive e-commerce platform for a modern bookstore built with React, Vite, Tailwind CSS, React Router, Context API, Lucide icons, mock role authentication, and PayPal Sandbox integration.

## Features

- Dual-role login for shoppers and admins
- Mock JWT-style local authentication
- Protected admin route
- Responsive book catalog with category filtering and search
- Book detail pages with author information, rating, stock, and full descriptions
- Persistent shopping cart with add, remove, and quantity update actions
- Checkout flow with shipping details, PayPal Sandbox buttons, and a mock payment fallback
- Order confirmation page
- Admin dashboard for adding, editing, deleting, repricing, and restocking books
- Mock recent orders and category management
- Dark and light mode toggle
- Toast feedback and loading skeletons

## Tech Stack

- React.js with Vite
- Tailwind CSS
- Lucide React
- React Router DOM
- Context API
- PayPal React SDK
- localStorage persistence

## Folder Structure

```text
src/
  components/
    BookCard.jsx
    Layout.jsx
    ProtectedRoute.jsx
    SectionHeader.jsx
    SkeletonGrid.jsx
  context/
    AuthContext.jsx
    BookContext.jsx
    CartContext.jsx
    ToastContext.jsx
  data/
    books.js
  pages/
    AdminDashboard.jsx
    BookDetail.jsx
    Cart.jsx
    Checkout.jsx
    Home.jsx
    Login.jsx
    OrderConfirmation.jsx
    Shop.jsx
  utils/
    storage.js
  App.jsx
  main.jsx
  styles.css
```

## System Preview

Create a `screenshots` folder in the project root and save your screenshots with the following names after running the app.

![Home Page](./screenshots/home.png)
![Shop Page](./screenshots/shop.png)
![Book Detail](./screenshots/book-detail.png)
![Cart Page](./screenshots/cart.png)
![Checkout Page](./screenshots/checkout.png)
![Admin Dashboard](./screenshots/admin-dashboard.png)
![Login Page](./screenshots/login.png)

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## PayPal Sandbox

The app reads the PayPal Client ID from:

```bash
VITE_PAYPAL_CLIENT_ID=your_paypal_sandbox_client_id
```

The default value is `sb`, which is useful for sandbox-style local development. A `Mock Payment` button is also included so the checkout flow can be tested before a real PayPal Developer Client ID is available.

## Mock Login Credentials

User:

```text
Email: reader@chapterly.dev
Password: reader123
```

Admin:

```text
Email: admin@chapterly.dev
Password: admin123
```

## Notes

Catalog edits, categories, cart contents, user session, and theme preference persist in `localStorage`. Clear browser storage to reset the app to the seeded demo data.
