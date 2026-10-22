import React from "react";
import { formatPrice, colorMap } from "../data/products.js";
export default function ProductCard({
  product: p,
  saved,
  onOpen,
  onToggleWishlist,
  onAdd,
}) {
  return (
    <article className="product-card">
      <div
        className="product-media"
        role="button"
        tabIndex="0"
        onClick={() => onOpen(p)}
        onKeyDown={(e) => e.key === "Enter" && onOpen(p)}
        aria-label={`View ${p.name}`}
      >
        <img src={p.image[0]} alt={p.name} loading="lazy" />
        <span className={`badge ${p.tag ? "" : "hidden"}`}>{p.tag}</span>
        <button
          className={`heart ${saved ? "saved" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(p.id);
          }}
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
        >
          {saved ? "♥" : "♡"}
        </button>
        <button
          className="quick-add"
          disabled={!p.stock}
          onClick={(e) => {
            e.stopPropagation();
            onAdd(p);
          }}
        >
          {p.stock ? "Quick add to bag" : "Currently unavailable"}
        </button>
      </div>
      <div className="product-info">
        <div className="product-title-line">
          <button className="product-name" onClick={() => onOpen(p)}>
            {p.name}
          </button>
          <span className="product-price">{formatPrice(p.price)}</span>
        </div>
        <div className="product-meta">
          <span>{p.sub === "Wall Art" ? "Wall art" : p.sub}</span>
          <span>{p.stock ? "Ready to ship" : "Sold out"}</span>
        </div>
        <div className="swatches">
          {p.colors.slice(0, 4).map((c) => (
            <span
              className="swatch"
              key={c}
              style={{ background: colorMap[c] || "#ddd" }}
              title={c}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
