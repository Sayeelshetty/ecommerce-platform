import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminOrders, getProducts } from "../services/api.js";
import "./pages.css";
import "./Admin.css";

function AdminDashboard() { const [stats, setStats] = useState(null); const [error, setError] = useState(""); useEffect(() => { Promise.all([getProducts({ limit: 1 }), getAdminOrders()]).then(([products, orders]) => setStats({ products: products.total, orders: orders.length, revenue: orders.reduce((sum, order) => sum + order.total_amount, 0) })).catch((err) => setError(err.message)); }, []); if (error) return <div className="page-state error">{error}</div>; if (!stats) return <div className="page-state">Loading dashboard...</div>; return <main className="page-shell admin-shell"><div className="page-heading"><h1>Admin dashboard</h1><p>A clear view of the TechNova store.</p></div><div className="admin-stats"><div><span>Products</span><strong>{stats.products}</strong></div><div><span>Orders</span><strong>{stats.orders}</strong></div><div><span>Order value</span><strong>₹{stats.revenue.toFixed(2)}</strong></div></div><div className="admin-links"><Link to="/admin/products"><strong>Manage products</strong><span>Create, edit, and retire inventory.</span></Link><Link to="/admin/orders"><strong>Manage orders</strong><span>Review fulfillment and update status.</span></Link></div></main>; }
export default AdminDashboard;
