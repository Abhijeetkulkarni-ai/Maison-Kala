import React from "react";
import { products, formatPrice } from "../data/products.js";
const pics = {
  hero: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2200&q=88",
  wall: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85",
  table:
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
  gift: "https://images.unsplash.com/photo-1608755728617-aefab37d2a5c?auto=format&fit=crop&w=1200&q=85",
};
export default function HomePage({ onCategory, onProduct, hidden }) {
  const picks = [13, 14, 16, 19].map((id) => products.find((p) => p.id === id));
  return (
    <main
      id="homePage"
      className={hidden ? "home-page home-hidden" : "home-page"}
    >
      <section className="home-hero">
        <img
          className="home-bg"
          src={pics.hero}
          alt="Warm, artfully styled home interior"
        />
        <div className="home-hero-copy">
          <div className="eyebrow" style={{ color: "#f0e5d7" }}>
            Objects for considered living
          </div>
          <h1>
            Thoughtfully made.
            <br />
            Beautifully lived in.
          </h1>
          <p>
            Hand-finished accents, tactile materials and thoughtful forms — made
            to bring quiet character to your home.
          </p>
          <button className="button light" onClick={() => onCategory("wall")}>
            Discover the collection ↗
          </button>
        </div>
      </section>
      <section className="home-categories" aria-label="Shop collections">
        {[
          ["wall", "Wall Décor", pics.wall],
          ["table", "Table Accessories", pics.table],
          ["gift", "Thoughtful Gifting", pics.gift],
        ].map(([cat, label, img]) => (
          <button
            key={cat}
            className="home-category"
            onClick={() => onCategory(cat)}
          >
            <img src={img} alt={label} />
            <span>{label} ↗</span>
          </button>
        ))}
      </section>
      <section className="home-arrivals">
        <div className="home-section-head">
          <div>
            <div className="eyebrow muted">Selected for your home</div>
            <h2>New arrivals</h2>
          </div>
          <button className="button outline" onClick={() => onCategory("wall")}>
            Shop all pieces ↗
          </button>
        </div>
        <div className="home-product-grid">
          {picks.map((p) => (
            <button
              className="home-product"
              key={p.id}
              onClick={() => onProduct(p)}
            >
              <div className="home-product-media">
                <img src={p.image[0]} alt={p.name} loading="lazy" />
              </div>
              <h3>{p.name}</h3>
              <p>{formatPrice(p.price)}</p>
            </button>
          ))}
        </div>
      </section>
      <section className="home-manifesto">
        <div className="eyebrow muted">The craft</div>
        <p>
          Every piece is shaped, painted and finished with care. Small
          variations are part of the beauty — no two homes, or objects, are
          exactly alike.
        </p>
      </section>
      <section className="home-story">
        <img
          src="https://images.unsplash.com/photo-1615874694520-474822394e73?auto=format&fit=crop&w=1400&q=85"
          alt="Natural textures in a calm home"
          loading="lazy"
        />
        <div className="home-story-copy">
          <div className="eyebrow muted">The Maison Kala way</div>
          <h2>
            Made slowly.
            <br />
            Kept forever.
          </h2>
          <p>
            We believe the most meaningful homes are built over time. Discover
            thoughtful objects, natural textures and the artisans behind them.
          </p>
          <button className="button outline" onClick={() => onCategory("wall")}>
            Discover our craft ↗
          </button>
        </div>
      </section>
      <div className="eyebrow muted" style={{ padding: "0 5% 18px" }}>
        @maisonkala · A little inspiration
      </div>
      <section className="home-insta">
        {[
          pics.table,
          pics.wall,
          pics.hero,
          pics.gift,
          pics.wall,
          pics.table,
        ].map((img, i) => (
          <img
            key={i}
            src={img}
            alt="Maison Kala home inspiration"
            loading="lazy"
          />
        ))}
      </section>
    </main>
  );
}
