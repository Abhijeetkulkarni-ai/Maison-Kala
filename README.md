# Maison Kala — Next.js storefront

Component-based Next.js App Router conversion of the Maison Kala React storefront. The existing luxury design, product data, cart, wishlist, search, product detail, demo checkout and demo account UI are retained.

## Requirements

- Node.js 20.9 or newer
- npm

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Production build

```bash
npm run build
npm start
```

## Structure

```text
app/
  globals.css        Global design system and responsive styles
  layout.jsx         Root layout, fonts and SEO metadata
  page.jsx           Storefront route
src/
  App.jsx            Storefront state and component orchestration
  components/
    Header.jsx
    HomePage.jsx
    CollectionPage.jsx
    ProductCard.jsx
    ProductDetail.jsx
    CartDrawer.jsx
    SearchOverlay.jsx
    CheckoutModal.jsx
    AccountModal.jsx
    Footer.jsx
  data/
    products.js      Product catalogue and price helpers
```

## Demo limitations

The storefront currently keeps cart, wishlist, demo accounts and order history in browser localStorage. It does not process real payments, authenticate securely, or connect to a courier. Never use real passwords in the demo. For production, connect a secure authentication provider, database, payment gateway and shipping/tracking API.
# Maison-Kala
# Maison-Kala
