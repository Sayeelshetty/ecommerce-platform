import React from "react";
import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__container">

        <a href="/" className="navbar__brand">
          <img
            src="/assets/logo/technova-logo.png"
            alt="TechNova"
          />
        </a>

        <nav className="navbar__nav">
          <a
            href="/"
            className="navbar__nav-link"
          >
            Home
          </a>

          <a
            href="/shop"
            className="navbar__nav-link"
          >
            Shop
          </a>

          <a
            href="/categories"
            className="navbar__nav-link"
          >
            Categories
          </a>

          <a
            href="/about"
            className="navbar__nav-link"
          >
            About
          </a>

          <a
            href="/contact"
            className="navbar__nav-link"
          >
            Contact
          </a>
        </nav>

        <div className="navbar__right">

          <button
            className="navbar__icon-button"
            type="button"
            aria-label="Search"
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
          >
            <img
              src="/assets/icons/cart_icon.svg"
              alt=""
            />

            <span className="navbar__cart-count">
              0
            </span>
          </button>

          <button
            className="navbar__login"
            type="button"
          >
            Login
          </button>

        </div>

      </div>
    </header>
  );
}

export default Navbar;