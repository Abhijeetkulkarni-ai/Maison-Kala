
"use client";

import React, { useState } from "react";
import { products, formatPrice } from "../data/products.js";

const TRACKING_STEPS = [
  { key: "confirmed", label: "Order confirmed", description: "Your order has been received." },
  { key: "processing", label: "Preparing your order", description: "Your pieces are being carefully prepared." },
  { key: "shipped", label: "Shipped", description: "Your order has left our facility." },
  { key: "transit", label: "In transit", description: "Your package is on its way to you." },
  { key: "delivered", label: "Delivered", description: "Your order has reached its destination." },
];

function getTrackingIndex(status = "") {
  const value = status.toLowerCase();

  if (value.includes("cancel")) return -1;
  if (value.includes("deliver")) return 4;
  if (value.includes("transit") || value.includes("out for delivery")) return 3;
  if (value.includes("ship")) return 2;
  if (value.includes("process") || value.includes("pack")) return 1;
  if (value.includes("confirm") || value.includes("pending")) return 0;

  // Treat an unknown status as confirmed rather than inventing progress.
  return 0;
}

function getOrderProduct(item) {
  return products.find((product) => product.id === item.id);
}

export default function AccountModal({
  open,
  onClose,
  orders = [],
  onSignIn,
}) {
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;

    try {
      return JSON.parse(localStorage.getItem("mk-demo-session"));
    } catch {
      return null;
    }
  });

  const [selectedOrder, setSelectedOrder] = useState(null);

  if (!open) return null;

  const mine = user
    ? orders.filter(
        (order) =>
          order.email?.trim().toLowerCase() ===
          user.email?.trim().toLowerCase()
      )
    : [];

  const handleSignOut = () => {
    localStorage.removeItem("mk-demo-session");
    setUser(null);
    setSelectedOrder(null);
    onSignIn?.("");
    onClose();
  };

  const openOrder = (order) => {
    setSelectedOrder(order);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getProductSummary = (order) =>
    (order.items || [])
      .map((item) => {
        const product = getOrderProduct(item);
        return product ? `${product.name} × ${item.qty}` : `Item × ${item.qty}`;
      })
      .join(", ");

  return (
    <main className="account-page">
      <header className="account-page-header">
        <button
          className="account-back"
          type="button"
          onClick={() => {
            if (selectedOrder) setSelectedOrder(null);
            else onClose();
          }}
        >
          ← {selectedOrder ? "Back to my orders" : "Back to store"}
        </button>

        <span className="account-brand">Maison Kala</span>
        <span className="account-header-caption">MY ACCOUNT</span>
      </header>

      <div className="account-dashboard">
        <aside className="account-sidebar">
          <span className="eyebrow muted">MY ACCOUNT</span>

          <h1>
            Your
            <br />
            <em>personal space.</em>
          </h1>

          <p>
            Everything about your Maison Kala experience,
            thoughtfully organised in one place.
          </p>

          {user && (
            <div className="account-sidebar-profile">
              <div className="account-avatar">
                {(user.name || user.email || "C").charAt(0).toUpperCase()}
              </div>

              <div>
                <strong>{user.name || "Customer"}</strong>
                <p>{user.email}</p>
              </div>
            </div>
          )}

          <button
            className="button outline account-signout"
            type="button"
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </aside>

        <section className="account-main">
          {!user ? (
            <div className="account-empty account-no-session">
              <div className="account-empty-icon">◇</div>
              <h2>No account session found</h2>
              <p>Please sign in to view your profile and orders.</p>
              <button className="button" type="button" onClick={onClose}>
                Return to store
              </button>
            </div>
          ) : selectedOrder ? (
            /* ORDER DETAIL VIEW */
            <div className="order-detail-view">
              <div className="account-main-heading">
                <div>
                  <span className="eyebrow muted">ORDER INFORMATION</span>
                  <h2>Order #{selectedOrder.id}</h2>
                  <p className="order-detail-date">
                    Placed on {selectedOrder.date || "Date unavailable"}
                  </p>
                </div>

                <span className="order-status">
                  {selectedOrder.status || "Processing"}
                </span>
              </div>

              {/* TRACKING */}
              <section className="account-details tracking-section">
                <span className="eyebrow muted">DELIVERY UPDATES</span>
                <h3>Track your order</h3>

                {String(selectedOrder.status || "").toLowerCase().includes("cancel") ? (
                  <div className="tracking-cancelled">
                    <strong>Order cancelled</strong>
                    <p>This order is marked as cancelled.</p>
                  </div>
                ) : (
                  <>
                    {selectedOrder.trackingNumber && (
                      <div className="tracking-number">
                        <span>Tracking number</span>
                        <strong>{selectedOrder.trackingNumber}</strong>
                      </div>
                    )}

                    <div className="tracking-timeline">
                      {TRACKING_STEPS.map((step, index) => {
                        const currentIndex = getTrackingIndex(
                          selectedOrder.status
                        );
                        const completed = index <= currentIndex;
                        const current = index === currentIndex;

                        return (
                          <div
                            className={`tracking-step ${
                              completed ? "is-complete" : ""
                            } ${current ? "is-current" : ""}`}
                            key={step.key}
                          >
                            <div className="tracking-marker">
                              {completed ? "✓" : ""}
                            </div>

                            <div className="tracking-step-copy">
                              <strong>{step.label}</strong>
                              <p>{step.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <p className="tracking-disclaimer">
                      Tracking is based on the order status saved in this demo.
                      Live courier scans are not connected.
                    </p>
                  </>
                )}
              </section>

              {/* ITEMS */}
              <section className="account-details">
                <span className="eyebrow muted">YOUR PURCHASE</span>
                <h3>Items in this order</h3>

                <div className="order-detail-items">
                  {(selectedOrder.items || []).map((item, index) => {
                    const product = getOrderProduct(item);

                    return (
                      <article
                        className="order-detail-item"
                        key={`${item.id}-${item.color || ""}-${index}`}
                      >
                        <div className="order-detail-item-image">
                          {product?.image ? (
                            <img src={product.image} alt={product.name} />
                          ) : (
                            <span>◇</span>
                          )}
                        </div>

                        <div className="order-detail-item-info">
                          <strong>{product?.name || "Maison Kala item"}</strong>
                          {item.color && <p>Colour: {item.color}</p>}
                          <p>Quantity: {item.qty}</p>
                        </div>

                        <strong>
                          {product
                            ? formatPrice(
                                (product.price || 0) * (item.qty || 1)
                              )
                            : "—"}
                        </strong>
                      </article>
                    );
                  })}
                </div>
              </section>

              {/* PAYMENT SUMMARY */}
              <section className="account-details">
                <span className="eyebrow muted">PAYMENT SUMMARY</span>
                <h3>Order total</h3>

                <div className="account-detail-row">
                  <span>Items</span>
                  <strong>{getProductSummary(selectedOrder) || "—"}</strong>
                </div>

                <div className="account-detail-row">
                  <span>Order total</span>
                  <strong>{formatPrice(selectedOrder.total || 0)}</strong>
                </div>

                {selectedOrder.paymentMethod && (
                  <div className="account-detail-row">
                    <span>Payment method</span>
                    <strong>{selectedOrder.paymentMethod}</strong>
                  </div>
                )}

                {selectedOrder.paymentStatus && (
                  <div className="account-detail-row">
                    <span>Payment status</span>
                    <strong>{selectedOrder.paymentStatus}</strong>
                  </div>
                )}
              </section>

              {/* SHIPPING ADDRESS */}
              <section className="account-details">
                <span className="eyebrow muted">DELIVERY INFORMATION</span>
                <h3>Shipping address</h3>

                {selectedOrder.address ? (
                  <div className="order-shipping-address">
                    {[
                      selectedOrder.customerName,
                      selectedOrder.address,
                      selectedOrder.city,
                      selectedOrder.state,
                      selectedOrder.postalCode,
                      selectedOrder.phone,
                    ]
                      .filter(Boolean)
                      .map((value, index) => (
                        <p key={`${value}-${index}`}>{value}</p>
                      ))}
                  </div>
                ) : (
                  <p className="order-detail-date">
                    Address details were not saved with this demo order.
                  </p>
                )}
              </section>

              <button
                className="button"
                type="button"
                onClick={() => setSelectedOrder(null)}
              >
                Back to all orders
              </button>
            </div>
          ) : (
            /* ACCOUNT OVERVIEW */
            <>
              <div className="account-main-heading">
                <div>
                  <span className="eyebrow muted">CUSTOMER DASHBOARD</span>
                  <h2>Overview</h2>
                </div>
                <span className="account-member-label">
                  MAISON KALA MEMBER
                </span>
              </div>

              <div className="account-stats">
                <article className="account-stat">
                  <span>Total orders</span>
                  <strong>{mine.length}</strong>
                  <p>Your purchase history</p>
                </article>

                <article className="account-stat">
                  <span>In progress</span>
                  <strong>
                    {
                      mine.filter((order) =>
                        /pending|processing|confirmed|shipped|transit/i.test(
                          order.status || ""
                        )
                      ).length
                    }
                  </strong>
                  <p>Orders being fulfilled</p>
                </article>

                <article className="account-stat">
                  <span>Account</span>
                  <strong>Active</strong>
                  <p>{user.email}</p>
                </article>
              </div>

              <div className="account-orders-heading">
                <div>
                  <span className="eyebrow muted">PURCHASE HISTORY</span>
                  <h3>Your orders</h3>
                </div>
                <span>{mine.length} orders</span>
              </div>

              {mine.length > 0 ? (
                <div className="account-order-list">
                  {mine.map((order) => (
                    <button
                      className="account-order account-order-clickable"
                      key={order.id}
                      type="button"
                      onClick={() => openOrder(order)}
                    >
                      <div className="account-order-head">
                        <strong>Order #{order.id}</strong>
                        <span className="order-status">
                          {order.status || "Processing"}
                        </span>
                      </div>

                      <p>
                        Placed {order.date || "Date unavailable"}
                        {order.city ? ` · ${order.city}` : ""}
                      </p>

                      <p className="account-order-items">
                        {getProductSummary(order) || "Order items"}
                      </p>

                      <div className="account-order-footer">
                        <strong>{formatPrice(order.total || 0)}</strong>
                        <span>View details & track order →</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="account-empty">
                  <div className="account-empty-icon">◇</div>
                  <h3>No orders yet</h3>
                  <p>
                    Your Maison Kala purchases will appear here when you place
                    your first order.
                  </p>
                  <button className="button" type="button" onClick={onClose}>
                    Explore collection
                  </button>
                </div>
              )}

              <section className="account-details">
                <span className="eyebrow muted">ACCOUNT INFORMATION</span>
                <h3>Personal details</h3>

                <div className="account-detail-row">
                  <span>Full name</span>
                  <strong>{user.name || "Not provided"}</strong>
                </div>

                <div className="account-detail-row">
                  <span>Email address</span>
                  <strong>{user.email}</strong>
                </div>
              </section>
            </>
          )}
        </section>
      </div>

      <footer className="account-page-footer">
        <span>MAISON KALA</span>
        <span>Thoughtfully made in India.</span>
      </footer>
    </main>
  );
}
