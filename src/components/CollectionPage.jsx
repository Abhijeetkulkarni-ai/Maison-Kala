import React, { useMemo, useState } from "react";
import ProductCard from "./ProductCard.jsx";
import { products, categoryName } from "../data/products.js";
const descriptions = {
  wall: "Give your walls a point of view. Discover hand-finished plates, woven textures, sculptural accents and mirrors made to bring quiet character to your space.",
  table:
    "Everyday objects with considered materials and tactile finishes, made to bring a little ritual to the everyday.",
  gift: "Small-batch objects and keepsakes, thoughtfully chosen and beautifully ready to give.",
};
export default function CollectionPage({
  category,
  onCategory,
  onOpen,
  onToggleWishlist,
  onAdd,
  wishlist,
  hidden,
}) {
  const [sort, setSort] = useState("featured"),
    [query, setQuery] = useState("");
  const items = useMemo(() => {
    let a = products.filter(
      (p) =>
        p.cat === category &&
        (p.name + " " + p.sub + " " + p.colors.join(" "))
          .toLowerCase()
          .includes(query.toLowerCase()),
    );
    if (sort === "price-asc") a.sort((x, y) => x.price - y.price);
    if (sort === "price-desc") a.sort((x, y) => y.price - x.price);
    if (sort === "name") a.sort((x, y) => x.name.localeCompare(y.name));
    if (sort === "newest") a.sort((x, y) => y.id - x.id);
    return a;
  }, [category, sort, query]);
  return (
    <main id="app" className={hidden ? "page home-hidden" : "page"}>
      <div className="breadcrumbs">
        <button onClick={() => onCategory("wall")}>Home</button> /{" "}
        {categoryName(category)}
      </div>
      <section className="collection-intro">
        <div>
          <div className="eyebrow muted">The Maison Kala collection</div>
          <h2>
            {categoryName(category)}
            <br />
            <span className="serif">with intention.</span>
          </h2>
        </div>
        <p>{descriptions[category]}</p>
      </section>
      <div className="category-pills">
        {[
          ["wall", "Wall Décor"],
          ["table", "Table Accessories"],
          ["gift", "Gifting"],
        ].map(([c, l]) => (
          <button
            className={`pill ${category === c ? "active" : ""}`}
            key={c}
            onClick={() => onCategory(c)}
          >
            {l}
          </button>
        ))}
      </div>
      <section className="catalogue">
        <div className="toolbar">
          <div className="toolbar-left">
            <span className="product-count">
              {items.length} {items.length === 1 ? "piece" : "pieces"}
            </span>
            <input
              aria-label="Filter collection"
              placeholder="Filter products…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                maxWidth: 190,
                border: 0,
                borderBottom: "1px solid var(--line)",
                padding: "7px",
                background: "transparent",
              }}
            />
          </div>
          <div className="toolbar-right">
            <label className="eyebrow" htmlFor="sortProducts">
              Sort
            </label>
            <select
              id="sortProducts"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
        <div className="product-grid">
          {items.length ? (
            items.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                saved={wishlist.includes(p.id)}
                onOpen={onOpen}
                onToggleWishlist={onToggleWishlist}
                onAdd={onAdd}
              />
            ))
          ) : (
            <div className="empty-results">
              <h3>Nothing found just yet.</h3>
              <p>Try another search.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
