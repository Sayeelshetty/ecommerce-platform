import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__main">

          {/* Brand */}
          <div className="footer__brand">
            <img
              src="/assets/logo/technova-logo.png"
              alt="TechNova"
              className="footer__logo"
            />

            <p className="footer__description">
              Modern technology for modern living. Discover premium
              gadgets built to power your work, play, and everyday life.
            </p>

            <div className="footer__socials">

              {/* Facebook */}
              <a
                href="#"
                className="footer__social"
                aria-label="Facebook"
              >
                <img
                  src="/assets/icons/facebook_icon.svg"
                  alt="Facebook"
                />
              </a>

              {/* Instagram */}
              <a
                href="#"
                className="footer__social"
                aria-label="Instagram"
              >
                <img
                  src="/assets/icons/instagram_icon.svg"
                  alt="Instagram"
                />
              </a>

              {/* Email */}
              <a
                href="mailto:technova@example.com"
                className="footer__social"
                aria-label="Email TechNova"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="17"
                  height="17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />

                  <path
                    d="M4 7L12 13L20 7"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>

            </div>
          </div>

          {/* Shop */}
          <div className="footer__column">
            <h3 className="footer__heading">
              Shop
            </h3>

            <a href="/shop">All Products</a>
            <a href="/categories">Categories</a>
            <a href="/shop">Best Sellers</a>
            <a href="/shop">New Arrivals</a>
          </div>

          {/* Company */}
          <div className="footer__column">
            <h3 className="footer__heading">
              Company
            </h3>

            <a href="/about">About Us</a>
            <a href="/contact">Contact</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms & Conditions</a>
          </div>

          {/* Customer Care */}
          <div className="footer__column">
            <h3 className="footer__heading">
              Customer Care
            </h3>

            <a href="/orders">My Orders</a>
            <a href="/cart">Shopping Cart</a>
            <a href="/help">Help Center</a>
            <a href="/returns">Returns & Refunds</a>
          </div>

        </div>

        <div className="footer__bottom">
          <p>
            © {new Date().getFullYear()} TechNova. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;