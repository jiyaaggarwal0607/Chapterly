import { useEffect, useMemo, useState } from "react";
import "./ShoppingPage.css";
import BrandLogo from "../components/BrandLogo";
import { api } from "../api";
const COLORS = ["pink", "purple", "red", "cream", "blue", "orange"];

function toProduct(p) {
  return {
    id: p._id,
    name: p.name,
    category: p.category,
    fandom: p.fandom,
    price: Number(p.price) || 0,
    emoji: p.emoji || "\u{1F6CD}",
    color: COLORS[parseInt(String(p._id).slice(-2), 16) % COLORS.length],
    description: p.description || "",
  };
}

const toCartItems = (c) =>
  c.items.map((i) => ({ ...toProduct(i.product), quantity: i.quantity }));

const categories = ["All", "Anime", "Manga", "Gaming"];
const productTypes = ["All products", "Clothing", "Collectibles", "Accessories"];
const money = (amount) => `₹${amount.toLocaleString("en-IN")}`;

export default function ShoppingPage({ onBack }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [productType, setProductType] = useState("All products");
  const [sort, setSort] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(1500);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [order, setOrder] = useState(null);
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "", address: "" });
  const [formError, setFormError] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const priceLimit = useMemo(
    () => Math.max(1500, Math.ceil(Math.max(0, ...products.map((p) => p.price)) / 50) * 50),
    [products]
  );

  useEffect(() => {
    setMaxPrice(priceLimit);
  }, [priceLimit]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const list = await api("/products");
        if (!cancelled) {
          setProducts(list.map(toProduct));
          setError("");
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
      try {
        const c = await api("/cart");
        if (!cancelled) setCart(toCartItems(c));
        const w = await api("/wishlist");
        if (!cancelled) setWishlist(w.map((x) => x._id));
      } catch (err) {
        if (!cancelled) setNotice(err.message);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const matchesSearch = `${product.name} ${product.category} ${product.fandom}`.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || product.fandom === category;
      const matchesType = productType === "All products" || product.category === productType;
      return matchesSearch && matchesCategory && matchesType && product.price <= maxPrice;
    });
    if (sort === "low") result.sort((a, b) => a.price - b.price);
    else if (sort === "high") result.sort((a, b) => b.price - a.price);
    else if (sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [products, search, category, productType, sort, maxPrice]);

  const applyCart = (c) => setCart(toCartItems(c));

  const addToCart = async (product) => {
    setOrder(null);
    setNotice("");
    try {
      applyCart(await api("/cart", { method: "POST", body: { productId: product.id, quantity: 1 } }));
    } catch (err) {
      setNotice(err.message);
    }
  };

  const changeQuantity = async (id, change) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    setNotice("");
    try {
      applyCart(await api("/cart/" + id, { method: "PUT", body: { quantity: item.quantity + change } }));
    } catch (err) {
      setNotice(err.message);
    }
  };

  const removeFromCart = async (id) => {
    setNotice("");
    try {
      applyCart(await api("/cart/" + id, { method: "DELETE" }));
    } catch (err) {
      setNotice(err.message);
    }
  };

  const toggleWishlist = async (id) => {
    const saved = wishlist.includes(id);
    setNotice("");
    try {
      await api("/wishlist/" + id, { method: saved ? "DELETE" : "POST" });
      setWishlist(saved ? wishlist.filter((i) => i !== id) : [...wishlist, id]);
    } catch (err) {
      setNotice(err.message);
    }
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const placeDemoOrder = (event) => {
    event.preventDefault();
    if (!customer.name.trim() || !customer.email.trim() || !customer.phone.trim() || !customer.address.trim()) {
      setFormError("Please fill in all the delivery details.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      setFormError("Please enter a valid email address.");
      return;
    }
    const orderNumber = `CH-${Date.now().toString().slice(-6)}`;
    setOrder({ number: orderNumber, customer: { ...customer }, items: cart.map((item) => ({ ...item })), total: cartTotal });
    setCart([]);
    api("/cart", { method: "DELETE" }).catch((err) => setNotice(err.message));
    setCheckoutOpen(false);
    setCartOpen(false);
    setFormError("");
  };

  return (
    <main className="shop-page">
      <header className="shop-navbar">
        <div className="shop-brand">
            <BrandLogo className="shop-brand-logo" />
        </div>
        <nav className="shop-nav-links">
          <a href="#shop-home">Home</a>
          <a href="#shop-categories">Categories</a>
          <a href="#shop-products">Shop</a>
        </nav>
        <div className="shop-header-actions">
          {onBack && <button className="shop-cart-button" onClick={onBack}>← Back</button>}
          <button className="shop-cart-button" onClick={() => { setCartOpen(!cartOpen); setOrder(null); }}>
            🛒 Cart <span>{cartCount}</span>
          </button>
        </div>
      </header>

      {cartOpen && (
        <section className="shop-cart-panel">
          <div className="shop-cart-heading">
            <h3>Your cart</h3>
            <button onClick={() => setCartOpen(false)} aria-label="Close cart">✕</button>
          </div>
          {cart.length === 0 ? <p>Your cart is empty. Find something you love!</p> : (
            <>
              {cart.map((item) => (
                <div className="shop-cart-item shop-cart-item-quantity" key={item.id}>
                  <span>{item.emoji}</span>
                  <span className="shop-cart-product-name">{item.name}<small>{money(item.price)} each</small></span>
                  <div className="shop-quantity-controls">
                    <button aria-label={`Decrease ${item.name} quantity`} onClick={() => changeQuantity(item.id, -1)}>−</button>
                    <span>{item.quantity}</span>
                    <button aria-label={`Increase ${item.name} quantity`} onClick={() => changeQuantity(item.id, 1)}>+</button>
                  </div>
                  <strong>{money(item.price * item.quantity)}</strong>
                  <button aria-label={`Remove ${item.name}`} onClick={() => removeFromCart(item.id)}>✕</button>
                </div>
              ))}
              <div className="shop-cart-total"><span>Total</span><strong>{money(cartTotal)}</strong></div>
              <p className="shop-cart-note">Demo checkout only — no payment will be taken.</p>
              <button className="shop-primary-button shop-checkout-button" onClick={() => { setCartOpen(false); setCheckoutOpen(true); setFormError(""); }}>Continue to checkout →</button>
            </>
          )}
        </section>
      )}

      {checkoutOpen && (
        <div className="shop-modal-backdrop" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) setCheckoutOpen(false); }}>
          <section className="shop-checkout-modal" role="dialog" aria-modal="true" aria-labelledby="shop-checkout-title">
            <div className="shop-cart-heading">
              <div><p className="shop-eyebrow">ALMOST YOURS</p><h2 id="shop-checkout-title">Demo checkout</h2></div>
              <button type="button" onClick={() => setCheckoutOpen(false)} aria-label="Close checkout">✕</button>
            </div>
            <p className="shop-checkout-disclaimer">This is a hackathon demo. No real order, payment, or delivery will be created.</p>
            <form onSubmit={placeDemoOrder} className="shop-checkout-form">
              <label>Full name<input value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} required placeholder="Your name" /></label>
              <label>Email address<input type="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} required placeholder="you@example.com" /></label>
              <label>Phone number<input type="tel" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} required placeholder="Contact number" /></label>
              <label>Delivery address<textarea value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} required rows="3" placeholder="Enter a sample address for the demo" /></label>
              <div className="shop-checkout-summary"><span>{cartCount} item(s)</span><strong>{money(cartTotal)}</strong></div>
              {formError && <p className="shop-form-error" role="alert">{formError}</p>}
              <button className="shop-primary-button shop-checkout-button" type="submit">Place demo order ↗</button>
            </form>
          </section>
        </div>
      )}

      {order && (
        <div className="shop-modal-backdrop">
          <section className="shop-checkout-modal shop-order-success" role="status">
            <div className="shop-success-icon">✓</div>
            <p className="shop-eyebrow">DEMO ORDER CREATED</p>
            <h2>Thank you, {order.customer.name.split(" ")[0]}!</h2>
            <p>Your sample order <strong>{order.number}</strong> has been created for the demo.</p>
            <div className="shop-order-summary">
              {order.items.map((item) => <div key={item.id}><span>{item.emoji} {item.name} × {item.quantity}</span><strong>{money(item.price * item.quantity)}</strong></div>)}
              <div className="shop-checkout-summary"><span>Total</span><strong>{money(order.total)}</strong></div>
            </div>
            <p className="shop-checkout-disclaimer">No payment was processed and this is not a real shipment.</p>
            <button className="shop-primary-button shop-checkout-button" onClick={() => setOrder(null)}>Continue shopping</button>
          </section>
        </div>
      )}

      <section className="shop-hero" id="shop-home">
        <div className="shop-hero-content">
          <p className="shop-eyebrow">YOUR FANDOM, YOUR WORLD</p>
          <h1>Wear your <span>fandom.</span><br />Own your story.</h1>
          <p className="shop-hero-description">Discover anime-inspired finds, manga collectibles and little things that make you, you.</p>
          <a className="shop-primary-button" href="#shop-products">Explore merchandise ↗</a>
          <p className="shop-hero-caption">Made for fans. Inspired by stories.</p>
        </div>
        <div className="shop-hero-art" aria-hidden="true">
          <span className="hero-spark spark-one">✦</span><span className="hero-spark spark-two">✧</span>
          <div className="hero-art-circle"><span>推し</span><strong>FAN</strong><span>FAVOURITE THINGS</span></div>
          <div className="hero-art-tag">♡ made for fans</div>
        </div>
      </section>

      <section className="shop-category-section" id="shop-categories">
        <div className="shop-section-heading"><div><p className="shop-eyebrow">FIND YOUR THING</p><h2>Shop by fandom</h2></div><p>There is something for every kind of fan.</p></div>
        <div className="shop-category-list">
          {categories.map((item) => (
            <button key={item} className={`shop-category-chip ${category === item ? "active" : ""}`} onClick={() => setCategory(item)}>
              {item === "All" ? "✦" : item === "Anime" ? "🎌" : item === "Manga" ? "📖" : "🎮"} <span>{item}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="shop-products-section" id="shop-products">
        <div className="shop-section-heading"><div><p className="shop-eyebrow">THE GOOD STUFF</p><h2>Explore merchandise<span>.</span></h2></div><p>{filteredProducts.length} products to explore</p></div>
        <div className="shop-content-layout">
          <aside className="shop-filters">
            <div className="shop-filter-heading"><h3>Filters</h3><button onClick={() => { setSearch(""); setCategory("All"); setProductType("All products"); setMaxPrice(priceLimit); setSort("featured"); }}>Reset</button></div>
            <label className="shop-search-label" htmlFor="shop-search">Search</label>
            <input id="shop-search" className="shop-search-input" placeholder="Find your favourite..." value={search} onChange={(event) => setSearch(event.target.value)} />
            <h4>Product type</h4>
            {productTypes.map((type) => <label className="shop-radio-label" key={type}><input type="radio" name="productType" checked={productType === type} onChange={() => setProductType(type)} />{type}</label>)}
            <div className="shop-price-heading"><h4>Maximum price</h4><span>₹{maxPrice}</span></div>
            <input className="shop-price-slider" type="range" min="100" max={priceLimit} step="50" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} aria-label="Maximum product price" />
            <div className="shop-price-range"><span>₹100</span><span>{money(priceLimit)}</span></div>
          </aside>
          <div className="shop-product-area">
            <div className="shop-toolbar"><span>Showing {filteredProducts.length} items</span><label>Sort by{" "}
              <select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="name">Name</option></select>
            </label></div>
            {loading && <p className="shop-checkout-disclaimer">Loading products...</p>}
            {error && <p className="shop-form-error" role="alert">{error}</p>}
            {notice && <p className="shop-form-error" role="alert">{notice}</p>}
            <div className="shop-product-grid">
              {filteredProducts.map((product) => (
                <article className="shop-product-card" key={product.id}>
                  <div className={`shop-product-art art-${product.color}`}>
                    <span className="shop-product-fandom">{product.fandom}</span>
                    <button className={`shop-wishlist ${wishlist.includes(product.id) ? "saved" : ""}`} onClick={() => toggleWishlist(product.id)} aria-label={wishlist.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}>{wishlist.includes(product.id) ? "♥" : "♡"}</button>
                    <span className="shop-product-emoji">{product.emoji}</span><span className="shop-product-art-caption">CHAPTERLY / FAN EDITION</span>
                  </div>
                  <div className="shop-product-info"><p>{product.category}</p><h3>{product.name}</h3><p className="shop-product-description">{product.description}</p>
                    <div className="shop-product-bottom"><strong>{money(product.price)}</strong><button onClick={() => addToCart(product)}>+ Add</button></div>
                  </div>
                </article>
              ))}
              {!loading && !error && filteredProducts.length === 0 && <div className="shop-empty-state"><span>🔎</span><h3>No products found</h3><p>Try another search or reset your filters.</p></div>}
            </div>
          </div>
        </div>
      </section>

      
        <footer className="shop-footer">
        <div className="shop-brand">
            <BrandLogo className="shop-brand-logo" />
        </div>

        <p>Stories bring us together. Fandom makes it special.</p>

        <span>© 2026 Chapterly · Demo marketplace</span>
        </footer>

    </main>
  );
}

