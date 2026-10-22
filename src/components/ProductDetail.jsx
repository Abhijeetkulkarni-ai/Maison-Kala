
"use client";

import React, { useEffect, useState } from "react";
import { products, formatPrice, colorMap } from "../data/products.js";

export default function ProductDetail({
  product: p,
  onClose,
  onAdd,
  saved,
  onToggleWishlist,
  onOpenProduct,
  wishlist = [],
}) {
  const [color, setColor] = useState(p.colors?.[0] || "");
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setColor(p.colors?.[0] || "");
    setQty(1);
    setActiveImage(0);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [p.id]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (!p) return null;

  const recommendations = products
    .filter((item) => item.id !== p.id)
    .sort((a, b) => {
      const aScore = a.cat === p.cat ? 2 : 0;
      const bScore = b.cat === p.cat ? 2 : 0;
      return bScore - aScore;
    })
    .slice(0, 4);

  const images = Array.isArray(p.image) ? p.image : [p.image];

  return (
    <main className="product-page">
      <div className="product-page-topbar">
        <button className="product-back" onClick={onClose} type="button">
          ← Continue shopping
        </button>

        <div className="product-page-brand">Maison Kala</div>

        <span className="product-page-caption">OBJECTS FOR LIVING</span>
      </div>

      <div className="product-page-breadcrumb">
        <button type="button" onClick={onClose}>
          Home
        </button>
        <span>/</span>
        <span>{p.sub}</span>
        <span>/</span>
        <span>{p.name}</span>
      </div>

      <section className="product-page-main">
        {/* Product gallery */}
        <div className="product-page-gallery">
          <div className="product-page-thumbnails">
            {images.map((img, index) => (
              <button
                type="button"
                key={`${img}-${index}`}
                className={`product-thumbnail ${
                  activeImage === index ? "selected" : ""
                }`}
                onClick={() => setActiveImage(index)}
                aria-label={`View product image ${index + 1}`}
                aria-pressed={activeImage === index}
              >
                <img src={img} alt="" />
              </button>
            ))}
          </div>

          <div className="product-page-image">
            <img
              src={images[activeImage] || images[0]}
              alt={p.name}
              fetchPriority="high"
            />

            {p.tag && <span className="product-page-tag">{p.tag}</span>}
          </div>
        </div>

        {/* Product information */}
        <div className="product-page-info">
          <span className="eyebrow muted">
            {p.tag || p.sub || "MAISON KALA COLLECTION"}
          </span>

          <h1>{p.name}</h1>

          <div className="product-page-price">{formatPrice(p.price)}</div>

          <p className="product-page-description">{p.desc}</p>

          <div className="product-page-shipping-note">
            <span>✦</span>
            Thoughtfully made in India
          </div>

          <div className="product-page-divider" />

          <div className="detail-label">Colour: {color}</div>

          <div className="choice-row product-page-colours">
            {p.colors.map((c) => (
              <button
                type="button"
                key={c}
                className={`choice color-choice ${
                  color === c ? "selected" : ""
                }`}
                onClick={() => setColor(c)}
                aria-pressed={color === c}
              >
                <span
                  className="color-dot"
                  style={{ background: colorMap[c] || "#ddd" }}
                />
                {c}
              </button>
            ))}
          </div>

          <div className="product-page-purchase">
            <div>
              <div className="detail-label">Quantity</div>

              <div className="qty-control">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  −
                </button>

                <span>{qty}</span>

                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(10, q + 1))}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <button
              className={`heart product-page-heart ${saved ? "saved" : ""}`}
              type="button"
              onClick={() => onToggleWishlist(p.id)}
              aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
            >
              {saved ? "♥" : "♡"}
            </button>
          </div>

          <button
            className="button product-page-add"
            type="button"
            disabled={!p.stock}
            onClick={() => onAdd(p, color, qty)}
          >
            {p.stock
              ? `Add to bag · ${formatPrice(p.price * qty)}`
              : "Currently unavailable"}
          </button>

          <p className="product-page-stock">
            {p.stock
              ? "Available to order"
              : "This piece is currently sold out"}
          </p>

          <div className="product-page-accordions">
            <details className="detail-note">
              <summary>Product story</summary>
              <p>{p.desc}</p>
            </details>

            <details className="detail-note">
              <summary>Materials & dimensions</summary>
              <p>
                <strong>Material:</strong> {p.material || "See product specifications"}
              </p>
              <p>
                <strong>Dimensions:</strong> {p.size || "See product specifications"}
              </p>
            </details>

            <details className="detail-note">
              <summary>Shipping & delivery</summary>
              <p>
                Complimentary shipping on orders above ₹1,499. Delivery
                timelines depend on your location and product availability.
              </p>
            </details>

            <details className="detail-note">
              <summary>Care instructions</summary>
              <p>
                Handle with care. Clean using the method appropriate for the
                product's material, and avoid harsh chemicals.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Editorial details */}
      <section className="product-story-section">
        <span className="eyebrow muted">THE MAISON KALA EDIT</span>
        <h2>A little more about this piece.</h2>
        <p>{p.desc}</p>

        <div className="product-story-facts">
          <div>
            <span>Material</span>
            <strong>{p.material}</strong>
          </div>

          <div>
            <span>Dimensions</span>
            <strong>{p.size}</strong>
          </div>

          <div>
            <span>Collection</span>
            <strong>{p.sub}</strong>
          </div>
        </div>
      </section>

      {/* Related products */}
      <section className="product-recommendations">
        <div className="product-recommendations-heading">
          <div>
            <span className="eyebrow muted">CURATED FOR YOU</span>
            <h2>You may also love</h2>
          </div>

          <span>Discover more pieces</span>
        </div>

        <div className="product-recommendations-grid">
          {recommendations.map((item) => (
            <article className="product-card" key={item.id}>
              <div
                className="product-media"
                role="button"
                tabIndex={0}
                onClick={() => onOpenProduct?.(item)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onOpenProduct?.(item);
                  }
                }}
                aria-label={`View ${item.name}`}
              >
                <img src={item.image[0]} alt={item.name} loading="lazy" />

                {item.tag && <span className="badge">{item.tag}</span>}

                <button
                  className={`heart ${
                    wishlist.includes(item.id) ? "saved" : ""
                  }`}
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onToggleWishlist(item.id);
                  }}
                  aria-label={
                    wishlist.includes(item.id)
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                >
                  {wishlist.includes(item.id) ? "♥" : "♡"}
                </button>

                <button
                  className="quick-add"
                  type="button"
                  disabled={!item.stock}
                  onClick={(event) => {
                    event.stopPropagation();
                    onAdd(item, item.colors?.[0], 1);
                  }}
                >
                  {item.stock ? "Quick add to bag" : "Currently unavailable"}
                </button>
              </div>

              <div className="product-info">
                <div className="product-title-line">
                  <button
                    className="product-name"
                    type="button"
                    onClick={() => onOpenProduct?.(item)}
                  >
                    {item.name}
                  </button>

                  <span className="product-price">
                    {formatPrice(item.price)}
                  </span>
                </div>

                <div className="product-meta">
                  <span>{item.sub}</span>
                  <span>{item.stock ? "Ready to ship" : "Sold out"}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="product-page-footer">
        <span>MAISON KALA</span>
        <span>Thoughtfully made in India.</span>
      </footer>
    </main>
  );
}
