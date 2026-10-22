import React from "react";
import { products, formatPrice } from "../data/products.js";
export default function CartDrawer({
  open,
  onClose,
  cart,
  wishlistMode,
  wishlist,
  onAdd,
  onQty,
  onRemove,
  onCheckout,
  onOpen,
  onToggleWishlist,
}) {
  const lines = wishlistMode
    ? wishlist.map((id) => ({ id, qty: 1, color: "" }))
    : cart;
  const subtotal = cart.reduce(
    (s, l) => s + (products.find((p) => p.id === l.id)?.price || 0) * l.qty,
    0,
  );
  const shipping = subtotal >= 1499 || subtotal === 0 ? 0 : 99;
  return (
    <>
      <div className={`overlay ${open ? "open" : ""}`} onClick={onClose} />
      <aside
        className={`drawer ${open ? "open" : ""}`}
        aria-label="Shopping panel"
      >
        <div className="drawer-head">
          <h2>{wishlistMode ? "Your wishlist" : "Your bag"}</h2>
          <button
            className="icon-btn"
            onClick={onClose}
            aria-label="Close panel"
          >
            ×
          </button>
        </div>
        <div className="drawer-content">
          {!lines.length ? (
            <div className="empty-state">
              <div className="eyebrow muted">
                A little room for something lovely
              </div>
              <h3>
                {wishlistMode
                  ? "Your wishlist is waiting."
                  : "Your bag is empty."}
              </h3>
              <p>Discover thoughtfully made objects for your home.</p>
              <button className="button outline" onClick={onClose}>
                Continue exploring
              </button>
            </div>
          ) : (
            lines.map((l, i) => {
              const p = products.find((x) => x.id === l.id);
              if (!p) return null;
              return (
                <div className="cart-line" key={`${l.id}-${l.color || i}`}>
                  <img src={p.image[0]} alt={p.name} />
                  <div>
                    <h3>{p.name}</h3>
                    <div className="muted">
                      {l.color || p.colors[0]} · {formatPrice(p.price)}
                    </div>
                    {wishlistMode ? (
                      <button
                        className="button outline"
                        style={{ marginTop: 10 }}
                        onClick={() => onAdd(p)}
                      >
                        Add to bag
                      </button>
                    ) : (
                      <div className="line-controls">
                        <button onClick={() => onQty(l, -1)}>−</button>
                        <span>{l.qty}</span>
                        <button onClick={() => onQty(l, 1)}>+</button>
                        <button className="remove" onClick={() => onRemove(l)}>
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="line-price">
                    {formatPrice(p.price * (l.qty || 1))}
                  </div>
                </div>
              );
            })
          )}
        </div>
        {!wishlistMode && cart.length > 0 && (
          <div className="drawer-foot">
            <div className="shipping-progress">
              {shipping === 0
                ? "Complimentary shipping applied"
                : "Add more for complimentary shipping"}
            </div>
            <div className="totals">
              <div>
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div>
                <span>Shipping</span>
                <span>
                  {shipping ? formatPrice(shipping) : "Complimentary"}
                </span>
              </div>
              <div className="grand">
                <span>Total</span>
                <strong>{formatPrice(subtotal + shipping)}</strong>
              </div>
            </div>
            <button className="button" onClick={onCheckout}>
              Proceed to checkout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
