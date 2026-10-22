import React, { useMemo, useState } from "react";
import { products, formatPrice } from "../data/products.js";
export default function CheckoutModal({ open, cart, onClose, onOrder }) {
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    shipping: "0",
  });
  const [done, setDone] = useState(null);
  const subtotal = cart.reduce(
    (s, l) => s + (products.find((p) => p.id === l.id)?.price || 0) * l.qty,
    0,
  );
  const total = subtotal + Number(form.shipping || 0);
  if (!open) return null;
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    const order = {
      id: "MK-" + Math.floor(100000 + Math.random() * 899999),
      date: new Date().toLocaleDateString("en-IN"),
      total,
      items: cart.map((l) => ({ id: l.id, qty: l.qty, color: l.color })),
      city: form.city,
      status: "Order received",
      email: form.email,
    };
    onOrder(order);
    setDone(order);
  };
  return (
    <section className="checkout-overlay open" aria-label="Checkout">
      <div className="checkout-inner">
        <div className="search-top">
          <div className="brand" style={{ fontSize: 16 }}>
            Maison Kala
          </div>
          <button
            className="icon-btn"
            onClick={() => {
              setDone(null);
              onClose();
            }}
            aria-label="Close checkout"
          >
            ×
          </button>
        </div>
        {done ? (
          <div style={{ textAlign: "center", paddingTop: "10vh" }}>
            <div className="eyebrow muted">Demo order confirmed</div>
            <h1>Thank you.</h1>
            <p>
              Your preview order <strong>{done.id}</strong> has been recorded in
              this browser. No payment was taken.
            </p>
            <p className="muted">Order total: {formatPrice(done.total)}</p>
            <button
              className="button"
              onClick={() => {
                setDone(null);
                onClose();
              }}
            >
              Back to the collection
            </button>
          </div>
        ) : (
          <>
            <h1>Almost home.</h1>
            <div className="checkout-grid">
              <form className="checkout-form" onSubmit={submit}>
                <div className="eyebrow">Contact</div>
                <label>Email address</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={change}
                />
                <div className="eyebrow" style={{ marginTop: 24 }}>
                  Delivery address
                </div>
                <label>Full name</label>
                <input
                  name="fullName"
                  required
                  placeholder="Your full name"
                  value={form.fullName}
                  onChange={change}
                />
                <label>Phone number</label>
                <input
                  name="phone"
                  type="tel"
                  required
                  pattern="[0-9+ ()-]{8,16}"
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={change}
                />
                <label>Address</label>
                <input
                  name="address"
                  required
                  placeholder="House / street / area"
                  value={form.address}
                  onChange={change}
                />
                <div className="form-row">
                  <div>
                    <label>City</label>
                    <input
                      name="city"
                      required
                      value={form.city}
                      onChange={change}
                    />
                  </div>
                  <div>
                    <label>PIN code</label>
                    <input
                      name="pincode"
                      required
                      pattern="[0-9]{6}"
                      maxLength="6"
                      value={form.pincode}
                      onChange={change}
                    />
                  </div>
                </div>
                <label>Delivery</label>
                <select name="shipping" value={form.shipping} onChange={change}>
                  <option value="0">Standard · 3–6 business days</option>
                  <option value="150">
                    Express · 1–2 business days · ₹150
                  </option>
                </select>
                <button
                  className="button"
                  style={{ width: "100%", marginTop: 24 }}
                >
                  Place demo order
                </button>
                <p className="checkout-note">
                  Demo checkout only. No payment is processed and no real order
                  is sent.
                </p>
              </form>
              <aside className="checkout-summary">
                <h2>Order summary</h2>
                {cart.map((l, i) => {
                  const p = products.find((x) => x.id === l.id);
                  return p ? (
                    <div className="checkout-product" key={`${l.id}-${i}`}>
                      <span>
                        {p.name} · {l.color} × {l.qty}
                      </span>
                      <strong>{formatPrice(p.price * l.qty)}</strong>
                    </div>
                  ) : null;
                })}
                <div className="totals">
                  <div>
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div>
                    <span>Shipping</span>
                    <span>
                      {form.shipping === "0"
                        ? "Complimentary"
                        : formatPrice(Number(form.shipping))}
                    </span>
                  </div>
                  <div className="grand">
                    <span>Total</span>
                    <strong>{formatPrice(total)}</strong>
                  </div>
                </div>
              </aside>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
