import React, { useMemo, useState, useEffect } from "react";
import { products, formatPrice } from "../data/products.js";
export default function SearchOverlay({ open, onClose, onOpenProduct }) {
  const [query, setQuery] = useState("");
  const results = useMemo(
    () =>
      products
        .filter((p) =>
          (p.name + " " + p.sub + " " + p.cat + " " + p.colors.join(" "))
            .toLowerCase()
            .includes(query.toLowerCase().trim()),
        )
        .slice(0, 9),
    [query],
  );
  useEffect(() => {
    if (open) {
      setQuery("");
    }
  }, [open]);
  if (!open) return null;
  return (
    <section className="search-overlay open" aria-label="Search products">
      <div className="search-inner">
        <div className="search-top">
          <div className="eyebrow">Search Maison Kala</div>
          <button
            className="icon-btn"
            onClick={onClose}
            aria-label="Close search"
          >
            ×
          </button>
        </div>
        <input
          className="search-input"
          autoFocus
          placeholder="What are you looking for?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="search-results">
          {query.trim() ? (
            results.map((p) => (
              <button
                className="search-result"
                key={p.id}
                onClick={() => onOpenProduct(p)}
              >
                <img src={p.image[0]} alt="" />
                <span>
                  {p.name}
                  <small>{formatPrice(p.price)}</small>
                </span>
              </button>
            ))
          ) : (
            <p className="muted">
              Try “wall plate”, “mirror”, “textile” or “terracotta”.
            </p>
          )}
          {query.trim() && !results.length && (
            <p className="muted">No matches yet. Try another search.</p>
          )}
        </div>
      </div>
    </section>
  );
}
