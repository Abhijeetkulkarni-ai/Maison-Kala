
"use client";

import React, { useEffect, useState } from "react";

import Header from "./components/Header.jsx";
import HomePage from "./components/HomePage.jsx";
import CollectionPage from "./components/CollectionPage.jsx";
import ProductDetail from "./components/ProductDetail.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import SearchOverlay from "./components/SearchOverlay.jsx";
import CheckoutModal from "./components/CheckoutModal.jsx";
import AccountModal from "./components/AccountModal.jsx";
import Footer from "./components/Footer.jsx";
import AuthPage from "./components/auth/AuthPage.jsx";

const load = (key, fallback) => {
  if (typeof window === "undefined") return fallback;

  try {
    return JSON.parse(window.localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

export default function App() {
  const [category, setCategory] = useState("wall");
  const [view, setView] = useState("home");
  const [product, setProduct] = useState(null);

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);

  const [drawer, setDrawer] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [toast, setToast] = useState("");
  const [storageReady, setStorageReady] = useState(false);

  // Restore saved shopping data and customer session.
  useEffect(() => {
    setCart(load("mk-cart", []));
    setWishlist(load("mk-wishlist", []));
    setOrders(load("mk-demo-orders", []));

    const session = load("mk-demo-session", null);
    setIsLoggedIn(Boolean(session?.email));

    setStorageReady(true);
  }, []);

  // Persist cart and wishlist.
  useEffect(() => {
    if (!storageReady) return;

    localStorage.setItem("mk-cart", JSON.stringify(cart));
    localStorage.setItem("mk-wishlist", JSON.stringify(wishlist));
  }, [cart, wishlist, storageReady]);

  // Persist demo orders.
  useEffect(() => {
    if (!storageReady) return;

    localStorage.setItem("mk-demo-orders", JSON.stringify(orders));
  }, [orders, storageReady]);

  // Lock background scrolling only for overlays.
  // The full product page remains scrollable.
  useEffect(() => {
    const locked =
      (drawer && drawer !== "menu") ||
      searchOpen ||
      checkoutOpen ||
      accountOpen ||
      authOpen;

    document.body.classList.toggle("lock", Boolean(locked));

    return () => {
      document.body.classList.remove("lock");
    };
  }, [drawer, searchOpen, checkoutOpen, accountOpen, authOpen]);

  // Automatically dismiss toast notifications.
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => setToast(""), 2400);

    return () => clearTimeout(timer);
  }, [toast]);

  const cartCount = cart.reduce(
    (total, line) => total + line.qty,
    0
  );

  // Add a product to the shopping bag.
  const add = (item, color = item.colors?.[0], qty = 1) => {
    if (!item?.stock) {
      setToast("This piece is currently unavailable.");
      return;
    }

    setCart((previous) => {
      const next = [...previous];

      const existing = next.find(
        (line) => line.id === item.id && line.color === color
      );

      if (existing) {
        existing.qty += qty;
      } else {
        next.push({
          id: item.id,
          color,
          qty,
        });
      }

      return next;
    });

    setToast(`${item.name} added to your bag`);
  };

  // Toggle wishlist items.
  const toggleWishlist = (id) => {
    const isSaved = wishlist.includes(id);

    setWishlist((previous) =>
      isSaved
        ? previous.filter((itemId) => itemId !== id)
        : [...previous, id]
    );

    setToast(
      isSaved
        ? "Removed from your wishlist"
        : "Saved to your wishlist"
    );
  };

  // Open a product as a full page.
  const openProduct = (item) => {
    if (!item) return;

    setProduct(item);
    setDrawer(null);
    setSearchOpen(false);
    setCheckoutOpen(false);
    setAccountOpen(false);
    setAuthOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  };

  // Return to the previous storefront view.
  const closeProduct = () => {
    setProduct(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Open a collection.
  const goCategory = (cat) => {
    if (cat === "menu") {
      setDrawer("menu");
      return;
    }

    setCategory(cat);
    setView("collection");

    setDrawer(null);
    setSearchOpen(false);
    setCheckoutOpen(false);
    setAccountOpen(false);
    setAuthOpen(false);
    setProduct(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Return to the home page.
  const goHome = () => {
    setView("home");

    setDrawer(null);
    setSearchOpen(false);
    setCheckoutOpen(false);
    setAccountOpen(false);
    setAuthOpen(false);
    setProduct(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Header account button.
  const handleAccount = () => {
    setDrawer(null);
    setSearchOpen(false);
    setCheckoutOpen(false);
    setProduct(null);

    if (isLoggedIn) {
      setAccountOpen(true);
    } else {
      setAuthOpen(true);
    }
  };

  // Handle successful demo authentication.
  const handleAuthenticated = (user) => {
    if (!user?.email) {
      setToast("Authentication response is missing the user email.");
      return;
    }

    const session = {
      name: user.name || "",
      email: user.email.trim().toLowerCase(),
    };

    // Demo-only session storage.
    // Production authentication should use server-verified sessions.
    localStorage.setItem(
      "mk-demo-session",
      JSON.stringify(session)
    );

    setIsLoggedIn(true);
    setAuthOpen(false);
    setAccountOpen(true);
    setToast("Welcome to Maison Kala");
  };

  // Sign out the customer.
  const handleSignOut = () => {
    localStorage.removeItem("mk-demo-session");

    setIsLoggedIn(false);
    setAccountOpen(false);
    setAuthOpen(false);

    setToast("You have signed out.");
  };

  // Remove a cart line.
  const removeLine = (line) => {
    setCart((previous) =>
      previous.filter((item) => item !== line)
    );
  };

  // Change cart quantity.
  const changeQty = (line, delta) => {
    setCart((previous) =>
      previous
        .map((item) =>
          item === line
            ? { ...item, qty: item.qty + delta }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  // Record a demo order.
  const placeOrder = (order) => {
    setOrders((previous) => [order, ...previous]);
    setCart([]);
    setCheckoutOpen(false);
    setToast("Demo order recorded");
  };

  return (
    <>
      {/* Main header */}
      <Header
        onHome={goHome}
        onCategory={goCategory}
        onSearch={() => {
          setProduct(null);
          setDrawer(null);
          setSearchOpen(true);
        }}
        onAccount={handleAccount}
        onCart={() => {
          setSearchOpen(false);
          setDrawer("cart");
        }}
        onWishlist={() => {
          setSearchOpen(false);
          setDrawer("wishlist");
        }}
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        isLoggedIn={isLoggedIn}
        activeCategory={category}
        activeView={view}
      />

      {/* Storefront OR full product page — never both */}
      {product ? (
        <ProductDetail
          key={product.id}
          product={product}
          onClose={closeProduct}
          onAdd={add}
          saved={wishlist.includes(product.id)}
          onToggleWishlist={toggleWishlist}
          wishlist={wishlist}
          onOpenProduct={openProduct}
        />
      ) : (
        <>
          <HomePage
            hidden={view !== "home"}
            onCategory={goCategory}
            onProduct={openProduct}
          />

          <CollectionPage
            hidden={view !== "collection"}
            category={category}
            onCategory={goCategory}
            onOpen={openProduct}
            onToggleWishlist={toggleWishlist}
            onAdd={(item) => add(item)}
            wishlist={wishlist}
          />

          <Footer onCategory={goCategory} />
        </>
      )}

      {/* Cart and wishlist drawer */}
      <CartDrawer
        open={Boolean(drawer) && drawer !== "menu"}
        onClose={() => setDrawer(null)}
        cart={cart}
        wishlistMode={drawer === "wishlist"}
        wishlist={wishlist}
        onAdd={(item) => add(item)}
        onQty={changeQty}
        onRemove={removeLine}
        onCheckout={() => {
          setDrawer(null);
          setCheckoutOpen(true);
        }}
        onOpen={openProduct}
        onToggleWishlist={toggleWishlist}
      />

      {/* Search */}
      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onOpenProduct={openProduct}
      />

      {/* Checkout */}
      <CheckoutModal
        open={checkoutOpen}
        cart={cart}
        onClose={() => setCheckoutOpen(false)}
        onOrder={placeOrder}
      />

      {/* Login and signup */}
      {authOpen && (
        <AuthPage
          onClose={() => setAuthOpen(false)}
          onAuthenticated={handleAuthenticated}
        />
      )}

      {/* Customer account */}
      {accountOpen && isLoggedIn && (
        <AccountModal
          open={accountOpen}
          onClose={() => setAccountOpen(false)}
          orders={orders}
          onSignIn={(email) => {
            if (!email) handleSignOut();
          }}
        />
      )}

      {/* Toast notification */}
      <div
        className={`toast ${toast ? "show" : ""}`}
        role="status"
        aria-live="polite"
      >
        {toast}
      </div>

      {/* Navigation menu */}
      {drawer === "menu" && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setDrawer(null);
            }
          }}
        >
          <section
            className="detail-modal"
            style={{ maxWidth: 420 }}
          >
            <button
              className="detail-close"
              type="button"
              onClick={() => setDrawer(null)}
              aria-label="Close menu"
            >
              ×
            </button>

            <h2 className="serif">Explore Maison Kala</h2>

            {[
              ["wall", "Wall Décor"],
              ["table", "Table Accessories"],
              ["gift", "Gifting"],
            ].map(([value, label]) => (
              <p key={value}>
                <button
                  className="pill"
                  type="button"
                  onClick={() => goCategory(value)}
                >
                  {label}
                </button>
              </p>
            ))}
          </section>
        </div>
      )}
    </>
  );
}
