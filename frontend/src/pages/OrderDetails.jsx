import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { cancelOrder, getOrder, getProduct } from "../services/api.js";
import "./pages.css";
import "./Orders.css";

function OrderDetails() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { getOrder(id).then(async (value) => { setOrder(value); const entries = await Promise.all(value.items.map(async (item) => [item.product_id, await getProduct(item.product_id).catch(() => null)])); setProducts(Object.fromEntries(entries)); }).catch((err) => setError(err.message)).finally(() => setLoading(false)); }, [id]);
  const cancel = async () => { setBusy(true); try { setOrder(await cancelOrder(id)); } catch (err) { setError(err.message); } finally { setBusy(false); } };
  if (loading) return <div className="page-state">Loading order...</div>;
  if (error || !order) return <div className="page-state error">{error || "Order not found."}<Link to="/orders">Back to orders</Link></div>;
  return <main className="page-shell"><div className="page-heading"><h1>Order #{order.id.slice(-8)}</h1><p>Placed order details and shipping status.</p></div>{location.state?.placed && <div className="notice success">Your order was placed successfully.</div>}<section className="order-detail-card"><div className="order-detail-card__header"><b className={`status status--${order.status}`}>{order.status}</b><span>{order.shipping_info?.address || "Shipping information saved"}</span></div>{order.items.map((item) => <div className="order-item" key={item.product_id}><img src={products[item.product_id]?.image_url || "/assets/products/apple_earphone_image.png"} alt={products[item.product_id]?.name || "Product"} /><div><strong>{products[item.product_id]?.name || `Product ${item.product_id.slice(-6)}`}</strong><span>Quantity: {item.quantity}</span><span>₹{item.price.toFixed(2)} each</span></div><b>₹{(item.price * item.quantity).toFixed(2)}</b></div>)}<div className="order-total"><span>Total</span><strong>₹{order.total_amount.toFixed(2)}</strong></div>{order.status === "pending" && <button className="danger-button" disabled={busy} onClick={cancel}>{busy ? "Cancelling..." : "Cancel order"}</button>}</section></main>;
}

export default OrderDetails;
