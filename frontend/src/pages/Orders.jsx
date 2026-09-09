import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../services/api.js";
import "./pages.css";
import "./Orders.css";

function Orders() { const [orders, setOrders] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(""); useEffect(() => { getOrders().then(setOrders).catch((err) => setError(err.message)).finally(() => setLoading(false)); }, []); if (loading) return <div className="page-state">Loading orders...</div>; if (error) return <div className="page-state error">{error}</div>; return <main className="page-shell"><div className="page-heading"><h1>My orders</h1><p>Track your TechNova purchases and delivery status.</p></div>{!orders.length ? <div className="empty-panel"><h2>No orders yet</h2><Link className="primary-button" to="/shop">Start shopping</Link></div> : <div className="order-list">{orders.map((order) => <Link className="order-row" to={`/orders/${order.id}`} key={order.id}><div><strong>Order #{order.id.slice(-8)}</strong><span>{order.items.length} item(s)</span></div><div><b className={`status status--${order.status}`}>{order.status}</b><strong>₹{order.total_amount.toFixed(2)}</strong></div></Link>)}</div>}</main>; }
export default Orders;
