import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addToCart, getProduct, getProducts } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import ProductCard from "../components/ProductCard/ProductCard.jsx";
import { getProductImage, handleProductImageError } from "../utils/productImage.js";
import "./pages.css";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams(); const navigate = useNavigate(); const { user } = useAuth();
  const [product, setProduct] = useState(null); const [related, setRelated] = useState([]); const [quantity, setQuantity] = useState(1); const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const [message, setMessage] = useState("");
  useEffect(() => { let active = true; Promise.all([getProduct(id), getProducts({ limit: 4 })]).then(([item, data]) => { if (!active) return; setProduct(item); setRelated((data.items || []).filter((candidate) => candidate.id !== item.id).slice(0, 3)); }).catch((err) => active && setError(err.message)).finally(() => active && setLoading(false)); return () => { active = false; }; }, [id]);
  const add = async (buyNow = false) => { if (!user) { navigate("/login", { state: { from: `/product/${id}` } }); return; } setMessage(""); try { await addToCart({ product_id: product.id, quantity }); if (buyNow) navigate("/checkout"); else setMessage("Added to your cart."); } catch (err) { setMessage(err.message); } };
  if (loading) return <div className="page-state">Loading product...</div>;
  if (error || !product) return <div className="page-state error">{error || "Product not found."}<div><Link className="primary-button" to="/shop">Back to shop</Link></div></div>;
  const price = product.offer_price ?? product.offerPrice ?? product.price;
  return <main className="page-shell"><div className="product-detail"><div className="product-detail__media"><img src={getProductImage(product)} alt={product.name} onError={handleProductImageError} /></div><div className="product-detail__content"><p className="eyebrow">TechNova product</p><h1>{product.name}</h1><p className="product-detail__description">{product.description}</p><div className="product-detail__price">₹{price} {product.offer_price && product.offer_price < product.price && <del>₹{product.price}</del>}</div><p className={product.stock > 0 ? "stock in-stock" : "stock out-stock"}>{product.stock > 0 ? `${product.stock} available` : "Currently out of stock"}</p><div className="quantity-control"><button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button><span>{quantity}</span><button type="button" onClick={() => setQuantity((value) => Math.min(product.stock || 1, value + 1))}>+</button></div>{message && <div className={message === "Added to your cart." ? "form-success" : "form-error"}>{message}</div>}<div className="inline-actions"><button className="primary-button" disabled={!product.stock} onClick={() => add(false)}>Add to cart</button><button className="secondary-button" disabled={!product.stock} onClick={() => add(true)}>Buy now</button></div></div></div>{related.length > 0 && <section className="related-section"><div className="page-heading"><h2>You may also like</h2></div><div className="related-grid">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></section>}</main>;
}
export default ProductDetails;
