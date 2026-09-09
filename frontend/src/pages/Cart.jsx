import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearCart, getCart, getProduct, removeCartItem, updateCartItem } from "../services/api.js";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import "./pages.css";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate(); const [items, setItems] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const [confirming, setConfirming] = useState(false); const [clearing, setClearing] = useState(false);
  const load = async () => { try { const current = await getCart(); const details = await Promise.all((current.items || []).map(async (item) => ({ ...item, product: await getProduct(item.product_id) }))); setItems(details); } catch (err) { setError(err.message); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const change = async (item, quantity) => { try { if (quantity < 1) await removeCartItem(item.product_id); else await updateCartItem(item.product_id, quantity); await load(); } catch (err) { setError(err.message); } };
  const emptyCart = async () => { setClearing(true); try { await clearCart(); await load(); setConfirming(false); } catch (err) { setError(err.message); } finally { setClearing(false); } };
  if (loading) return <div className="page-state">Loading your cart...</div>;
  if (error) return <div className="page-state error">{error}</div>;
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  return <main className="page-shell"><div className="page-heading"><h1>Your cart</h1><p>Review your picks before checkout.</p></div>{items.length === 0 ? <div className="empty-panel"><h2>Your cart is empty</h2><p>Discover something useful for your setup.</p><Link className="primary-button" to="/shop">Browse products</Link></div> : <div className="cart-layout"><section className="cart-items"><div className="cart-actions"><button className="danger-button" type="button" onClick={() => setConfirming(true)}>Clear cart</button></div>{items.map((item) => <article className="cart-item" key={item.product_id}><img src={item.product.image_url || "/assets/products/apple_earphone_image.png"} alt={item.product.name} /><div className="cart-item__body"><Link to={`/product/${item.product_id}`}><h2>{item.product.name}</h2></Link><p>₹{item.product.price} each</p><div className="cart-item__actions"><div className="quantity-control"><button type="button" onClick={() => change(item, item.quantity - 1)}>−</button><span>{item.quantity}</span><button type="button" onClick={() => change(item, item.quantity + 1)}>+</button></div><button className="text-button" type="button" onClick={() => change(item, 0)}>Remove</button></div></div><strong>₹{(item.product.price * item.quantity).toFixed(2)}</strong></article>)}</section><aside className="summary-card"><h2>Order summary</h2><div><span>Subtotal</span><strong>₹{subtotal.toFixed(2)}</strong></div><div><span>Shipping</span><strong>Free</strong></div><div className="summary-total"><span>Total</span><strong>₹{subtotal.toFixed(2)}</strong></div><button className="primary-button" onClick={() => navigate("/checkout")}>Continue to checkout</button></aside></div>}{confirming && <ConfirmDialog title="Clear cart?" message="All items will be removed from your cart." onCancel={() => setConfirming(false)} onConfirm={emptyCart} busy={clearing} />}</main>;
}
export default Cart;
