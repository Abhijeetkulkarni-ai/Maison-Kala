import React, { useState } from "react";
export default function Footer({ onCategory }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <>
      <section className="newsletter">
        <div className="eyebrow muted">Notes from Maison Kala</div>
        <h2>A little more beauty, occasionally.</h2>
        <p>
          New pieces, thoughtful spaces and stories from the makers behind them.
        </p>
        <form
          className="newsletter-form"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
            setEmail("");
          }}
        >
          <input
            type="email"
            required
            placeholder="Your email address"
            aria-label="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="button">
            {sent ? "You're on the list" : "Sign me up"}
          </button>
        </form>
        {sent && (
          <p role="status">Thanks — newsletter signup is in preview mode.</p>
        )}
      </section>
      <footer className="site-footer">
        <div>
          <div className="footer-brand">Maison Kala</div>
          <p className="muted" style={{ fontSize: 12 }}>
            Thoughtful objects for considered living.
          </p>
        </div>
        <div>
          <div className="eyebrow">Shop</div>
          <a
            href="#collection"
            onClick={(e) => {
              e.preventDefault();
              onCategory("wall");
            }}
          >
            Wall Décor
          </a>
          <a
            href="#collection"
            onClick={(e) => {
              e.preventDefault();
              onCategory("table");
            }}
          >
            Table Accessories
          </a>
          <a
            href="#collection"
            onClick={(e) => {
              e.preventDefault();
              onCategory("gift");
            }}
          >
            Gifting
          </a>
        </div>
        <div>
          <div className="eyebrow">Explore</div>
          <a href="#craft">Our craft</a>
          <a href="#instagram">@maisonkala</a>
        </div>
        <div className="footer-news">
          <div className="eyebrow">A little more about us</div>
          <p className="muted" style={{ fontSize: 12 }}>
            Small-batch objects. Natural materials. A home that tells your
            story.
          </p>
        </div>
        <div className="copyright">
          <span>© 2026 Maison Kala. Design preview.</span>
          <span>Made with care · India</span>
        </div>
      </footer>
    </>
  );
}
