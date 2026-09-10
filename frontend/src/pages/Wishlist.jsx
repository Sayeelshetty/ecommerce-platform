import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProduct, getWishlist, removeWishlistItem } from "../services/api.js";
import ProductCard from "../components/ProductCard/ProductCard.jsx";
import "./pages.css";
import "./Wishlist.css";

function Wishlist() { const [products, setProducts] = useState([]);
     const [loading, setLoading] = useState(true); const [error, setError] = useState(""); 
     const load = async () => { try { const list = await getWishlist(); 
        setProducts((await Promise.all((list.product_ids || []).map((id) => getProduct(id).catch(() => null)))).filter(Boolean)); } catch (err) { setError(err.message); } finally { setLoading(false); } }; useEffect(() => { load(); }, []);
         const remove = async (id) => { try { await removeWishlistItem(id); await load(); } catch (err) { setError(err.message); } }; if (loading) return <div className="page-state">Loading wishlist...</div>; if (error) return <div className="page-state error">{error}</div>; return <main className="page-shell"><div className="page-heading"><h1>Wishlist</h1><p>Keep the products you are considering close.</p></div>{!products.length ? <div className="empty-panel"><h2>Your wishlist is empty</h2><Link className="primary-button" to="/shop">Browse products</Link></div> : <div className="wishlist-grid">{products.map((product) => <div className="wishlist-item" key={product.id}><ProductCard product={product} /><button className="text-button" type="button" onClick={() => remove(product.id)}>Remove from wishlist</button></div>)}</div>}</main>; }
export default Wishlist;
