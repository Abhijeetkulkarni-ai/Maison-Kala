
"use client";

import React from "react";

export default function Header({
  onHome,
  onCategory,
  onSearch,
  onAccount,
  onCart,
  onWishlist,
  cartCount,
  wishlistCount,
  isLoggedIn = false,
  activeCategory = "",
  activeView = "home",
}) {
  const navItems = [
    { label: "Wall Décor", value: "wall" },
    { label: "Table Accessories", value: "table" },
    { label: "Gifting", value: "gift" },
  ];

  return (
    <>
      <div className="announcement">
        Complimentary shipping on orders above ₹1,499 · Thoughtfully made in
        India
      </div>

      <header className="site-header">
        <button
          className="menu-btn"
          onClick={() => onCategory("menu")}
          type="button"
        >
          Menu
        </button>

        <nav className="nav" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive =
              activeView === "collection" &&
              activeCategory === item.value;

            return (
              <a
                key={item.value}
                href="#collection"
                className={isActive ? "active" : ""}
                aria-current={isActive ? "page" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  onCategory(item.value);
                }}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <button
          className="brand"
          style={{ border: 0, background: "none" }}
          onClick={onHome}
          type="button"
        >
          Maison Kala
        </button>

        <div className="head-actions">
          <button id="searchBtn" onClick={onSearch} type="button">
            ⌕ <span className="search-label">Search</span>
          </button>

          <button onClick={onAccount} type="button">
            ♙{" "}
            <span className="account-label">
              {isLoggedIn ? "Account" : "Login"}
            </span>
          </button>

          <button onClick={onWishlist} type="button">
            ♡ <span className="account-label">Wishlist</span>
            <span className="count">{wishlistCount}</span>
          </button>

          <button onClick={onCart} type="button">
            Bag <span className="count">{cartCount}</span>
          </button>
        </div>
      </header>
    </>
  );
}
