import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./pages.css";
import "./Account.css";

function Account() { const { user, logout } = useAuth(); const navigate = useNavigate(); const signOut = () => { logout(); navigate("/"); }; return <main className="page-shell"><div className="page-heading"><h1>Your account</h1><p>Manage your profile and TechNova activity.</p></div><div className="account-grid"><section className="account-card"><span className="account-card__label">Profile</span><h2>{user.name}</h2><p>{user.email}</p><span className="role-badge">{user.role}</span></section><Link className="account-card" to="/orders"><span className="account-card__label">Purchase history</span><h2>My orders</h2><p>Track and manage your orders.</p></Link><Link className="account-card" to="/cart"><span className="account-card__label">Shopping</span><h2>Cart</h2><p>Review your saved products.</p></Link>{user.role === "admin" && <Link className="account-card account-card--accent" to="/admin"><span className="account-card__label">Workspace</span><h2>Admin dashboard</h2><p>Manage the TechNova store.</p></Link>}</div><button className="danger-button" onClick={signOut}>Log out</button></main>; }
export default Account;
