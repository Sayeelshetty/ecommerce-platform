import { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { getCart } from "../../services/api.js";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const refreshCartCount = () => Promise.resolve().then(() => {
      if (!user) return setCartCount(0);
      return getCart().then((cart) => setCartCount((cart.items || []).reduce((sum, item) => sum + item.quantity, 0))).catch(() => setCartCount(0));
    });

    refreshCartCount();
    window.addEventListener("technova:cart-updated", refreshCartCount);
    return () => window.removeEventListener("technova:cart-updated", refreshCartCount);
  }, [user]);

  return (
    <header className="navbar">
      <div className="navbar__container">

        <Link to="/" className="navbar__brand">
          <img
            src="/assets/logo/technova-logo.png"
            alt="TechNova"
          />
        </Link>

        <button className="navbar__menu-button" type="button" aria-label="Toggle navigation" onClick={() => setMobileOpen((open) => !open)}>
          <img src="/assets/icons/menu_icon.svg" alt="" />
        </button>

        <nav className={mobileOpen ? "navbar__nav navbar__nav--open" : "navbar__nav"}>
          <NavLink to="/" className="navbar__nav-link" onClick={() => setMobileOpen(false)}>
            Home
          </NavLink>

          <NavLink to="/shop" className="navbar__nav-link" onClick={() => setMobileOpen(false)}>
            Shop
          </NavLink>

          <NavLink to="/categories" className="navbar__nav-link" onClick={() => setMobileOpen(false)}>
            Categories
          </NavLink>

          <NavLink to="/account" className="navbar__nav-link" onClick={() => setMobileOpen(false)}>Account</NavLink>
          {user?.role === "admin" && <NavLink to="/admin" className="navbar__nav-link" onClick={() => setMobileOpen(false)}>Admin</NavLink>}
        </nav>

        <div className="navbar__right">

          <button
            className="navbar__icon-button"
            type="button"
            aria-label="Search"
            onClick={() => navigate("/shop")}
          >
            <img
              src="/assets/icons/search_icon.svg"
              alt=""
            />
          </button>

          <button
            className="navbar__icon-button navbar__cart"
            type="button"
            aria-label="Shopping cart"
            onClick={() => navigate(user ? "/cart" : "/login")}
          >
            <img
              src="/assets/icons/cart_icon.svg"
              alt=""
            />

            <span className="navbar__cart-count">
              {cartCount}
            </span>
          </button>

          {user ? (
            <button className="navbar__login" type="button" onClick={() => { logout(); navigate("/"); }}>
              Log out
            </button>
          ) : (
            <button className="navbar__login" type="button" onClick={() => navigate("/login")}>Login</button>
          )}

        </div>

      </div>
    </header>
  );
}

export default Navbar;