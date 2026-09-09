import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminOrders } from "../services/api.js";
import "./pages.css";
import "./Admin.css";

function AdminOrders() { const [orders, setOrders] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(""); useEffect(() => { getAdminOrders().then(setOrders).catch((err) => setError(err.message)).finally(() => setLoading(false)); }, []); if (loading) return <div className="page-state">Loading orders...</div>; if (error) return <div className="page-state error">{error}</div>; return <main className="page-shell admin-shell"><div className="page-heading"><h1>Orders</h1><p>Manage fulfillment across the store.</p></div>{!orders.length ? <div className="empty-panel">No orders found.</div> : <div className="order-list">{orders.map((order) => <Link className="order-row" to={`/admin/orders/${order.id}`} key={order.id}><div><strong>#{order.id.slice(-8)}</strong><span>{order.user_id}</span></div><div><b className={`status status--${order.status}`}>{order.status}</b><strong>₹{order.total_amount.toFixed(2)}</strong></div></Link>)}</div>}</main>; }
export default AdminOrders;
