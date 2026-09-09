import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import { getCategories, getProducts } from "../../services/api.js";
import "./Shop.css";

function Shop() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ search: "", category_id: searchParams.get("category_id") || "", min_price: "", max_price: "", sort: "newest" });
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const limit = 12;

  useEffect(() => { getCategories().then(setCategories).catch(() => setCategories([])); }, []);

  useEffect(() => {
    let active = true;
    getProducts({ ...filters, page, limit })
      .then((data) => { if (!active) return; setProducts(data.items || []); setMeta({ pages: data.pages || 1, total: data.total || 0 }); })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [filters, page]);

  const updateFilter = (key, value) => { setLoading(true); setPage(1); setFilters((current) => ({ ...current, [key]: value })); };

  return (
    <main className="shop-page"><div className="shop-page__container">
      <div className="shop-page__header"><div><h1 className="shop-page__title">Shop</h1><p className="shop-page__subtitle">Discover products made for your everyday tech needs.</p></div></div>
      <div className="shop-page__toolbar">
        <div className="shop-page__search"><img src="/assets/icons/search_icon.svg" alt="" /><input value={filters.search} onChange={(event) => updateFilter("search", event.target.value)} placeholder="Search products..." /></div>
        <select aria-label="Category" value={filters.category_id} onChange={(event) => updateFilter("category_id", event.target.value)}><option value="">All categories</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>
        <input aria-label="Minimum price" type="number" min="0" placeholder="Min ₹" value={filters.min_price} onChange={(event) => updateFilter("min_price", event.target.value)} />
        <input aria-label="Maximum price" type="number" min="0" placeholder="Max ₹" value={filters.max_price} onChange={(event) => updateFilter("max_price", event.target.value)} />
        <div className="shop-page__sort"><label htmlFor="sort">Sort by</label><select id="sort" value={filters.sort} onChange={(event) => updateFilter("sort", event.target.value)}><option value="newest">Newest</option><option value="price_asc">Price: Low to High</option><option value="price_desc">Price: High to Low</option></select></div>
      </div>
      {loading && <div className="shop-page__message">Loading products...</div>}
      {error && <div className="shop-page__message shop-page__message--error">{error}</div>}
      {!loading && !error && products.length === 0 && <div className="shop-page__empty"><h2>No products found</h2><p>Try changing your search or filters.</p></div>}
      {!loading && !error && products.length > 0 && <>
        <div className="shop-page__result-info">Showing <strong>{(page - 1) * limit + 1}</strong> - <strong>{Math.min(page * limit, meta.total)}</strong> of <strong>{meta.total}</strong> products</div>
        <div className="shop-page__grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        {meta.pages > 1 && <div className="shop-page__pagination"><button type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Previous</button><div className="shop-page__page-numbers">{Array.from({ length: meta.pages }, (_, index) => index + 1).map((number) => <button type="button" key={number} className={page === number ? "shop-page__page-number shop-page__page-number--active" : "shop-page__page-number"} onClick={() => setPage(number)}>{number}</button>)}</div><button type="button" disabled={page === meta.pages} onClick={() => setPage((current) => current + 1)}>Next</button></div>}
      </>}
    </div></main>
  );
}

export default Shop;
