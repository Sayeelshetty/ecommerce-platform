import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  createOrder,
  getCart,
  getProduct,
} from "../services/api.js";

import "./pages.css";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    payment_method: "cod",
  });

  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true);
        setError("");

        const cart = await getCart();
        const cartItems = cart.items || [];

        if (cartItems.length === 0) {
          setItems([]);
          return;
        }

        const detailedItems = await Promise.all(
          cartItems.map(async (item) => {
            const product = await getProduct(item.product_id);

            return {
              ...item,
              product,
            };
          })
        );

        setItems(detailedItems);
      } catch (err) {
        console.error("Failed to load checkout cart:", err);

        setError(
          err?.message ||
            "Unable to load your cart for checkout."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const subtotal = items.reduce((sum, item) => {
    const price = Number(item.product?.price ?? 0);

    return sum + price * item.quantity;
  }, 0);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!form.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!form.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (!form.address.trim()) {
      setError("Please enter your delivery address.");
      return;
    }

    if (!form.city.trim()) {
      setError("Please enter your city.");
      return;
    }

    if (!form.postal_code.trim()) {
      setError("Please enter your postal code.");
      return;
    }

    if (!/^\d{10}$/.test(form.phone.trim())) {
      setError(
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    if (!/^\d{6}$/.test(form.postal_code.trim())) {
      setError(
        "Please enter a valid 6-digit postal code."
      );
      return;
    }

    try {
      setPlacingOrder(true);

      const paymentStatus =
        form.payment_method === "mock_card"
          ? "paid"
          : "pending";

      const order = await createOrder({
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        postal_code: form.postal_code.trim(),
        payment_method: form.payment_method,
        payment_status: paymentStatus,
      });

      setSuccess(
        "Your order has been placed successfully."
      );

      window.setTimeout(() => {
        navigate(`/orders/${order.id}`);
      }, 700);
    } catch (err) {
      console.error("Failed to place order:", err);

      setError(
        err?.message ||
          "Unable to place your order. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-page-state">
        <div className="checkout-page-state__card">
          <div className="checkout-page-state__spinner"></div>
          <p>Loading your checkout...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <main className="checkout-page">
        <div className="checkout-page__container">
          <div className="checkout-page__heading">
            <span className="checkout-page__eyebrow">
              TechNova Checkout
            </span>

            <h1>Checkout</h1>

            <p>
              Complete your order with your delivery details.
            </p>
          </div>

          <div className="checkout-empty">
            <div className="checkout-empty__icon">
              🛒
            </div>

            <h2>Your cart is empty</h2>

            <p>
              Add some products to your cart before
              continuing to checkout.
            </p>

            <Link
              className="checkout-button checkout-button--primary"
              to="/shop"
            >
              Browse products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-page__container">
        <div className="checkout-page__heading">
          <span className="checkout-page__eyebrow">
            TechNova Checkout
          </span>

          <h1>Complete your order</h1>

          <p>
            Enter your delivery information and choose your
            preferred payment method.
          </p>
        </div>

        <form
          className="checkout-layout"
          onSubmit={handleSubmit}
        >
          <section className="checkout-card checkout-form">
            <div className="checkout-card__header">
              <div>
                <span className="checkout-card__step">
                  STEP 1
                </span>

                <h2>Delivery information</h2>

                <p>
                  Where should we deliver your order?
                </p>
              </div>
            </div>

            <div className="checkout-fields">
              <div className="checkout-field">
                <label htmlFor="name">
                  Full name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="phone">
                  Phone number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength="10"
                />
              </div>

              <div className="checkout-field checkout-field--full">
                <label htmlFor="address">
                  Delivery address
                </label>

                <textarea
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="House / building, street, area"
                  rows="4"
                  autoComplete="street-address"
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="city">
                  City
                </label>

                <input
                  id="city"
                  name="city"
                  type="text"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                  autoComplete="address-level2"
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="postal_code">
                  Postal code
                </label>

                <input
                  id="postal_code"
                  name="postal_code"
                  type="text"
                  value={form.postal_code}
                  onChange={handleChange}
                  placeholder="6-digit postal code"
                  inputMode="numeric"
                  maxLength="6"
                  autoComplete="postal-code"
                />
              </div>
            </div>

            <div className="checkout-divider"></div>

            <div className="checkout-card__header">
              <div>
                <span className="checkout-card__step">
                  STEP 2
                </span>

                <h2>Payment method</h2>

                <p>
                  Select how you want to complete your order.
                </p>
              </div>
            </div>

            <div className="checkout-payment-options">
              <label
                className={
                  form.payment_method === "cod"
                    ? "checkout-payment checkout-payment--active"
                    : "checkout-payment"
                }
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="cod"
                  checked={form.payment_method === "cod"}
                  onChange={handleChange}
                />

                <span className="checkout-payment__radio"></span>

                <span className="checkout-payment__content">
                  <strong>Cash on Delivery</strong>

                  <small>
                    Pay when your order arrives at your
                    doorstep.
                  </small>
                </span>
              </label>

              <label
                className={
                  form.payment_method === "mock_card"
                    ? "checkout-payment checkout-payment--active"
                    : "checkout-payment"
                }
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="mock_card"
                  checked={
                    form.payment_method === "mock_card"
                  }
                  onChange={handleChange}
                />

                <span className="checkout-payment__radio"></span>

                <span className="checkout-payment__content">
                  <strong>Demo Card Payment</strong>

                  <small>
                    Portfolio demo payment. No real card
                    details are collected.
                  </small>
                </span>
              </label>
            </div>

            {error && (
              <div className="checkout-message checkout-message--error">
                {error}
              </div>
            )}

            {success && (
              <div className="checkout-message checkout-message--success">
                {success}
              </div>
            )}

            <button
              className="checkout-button checkout-button--primary checkout-button--submit"
              type="submit"
              disabled={placingOrder}
            >
              {placingOrder
                ? "Placing your order..."
                : "Place order"}
            </button>
          </section>

          <aside className="checkout-card checkout-summary">
            <div className="checkout-card__header">
              <div>
                <span className="checkout-card__step">
                  SUMMARY
                </span>

                <h2>Your order</h2>

                <p>
                  Review your products before ordering.
                </p>
              </div>
            </div>

            <div className="checkout-summary__items">
              {items.map((item) => {
                const price = Number(
                  item.product?.price ?? 0
                );

                return (
                  <div
                    className="checkout-summary__item"
                    key={item.product_id}
                  >
                    <div className="checkout-summary__product">
                      <div className="checkout-summary__image">
                        <img
                          src={
                            item.product?.image_url ||
                            "/assets/products/apple_earphone_image.png"
                          }
                          alt={
                            item.product?.name ||
                            "Product"
                          }
                        />
                      </div>

                      <div className="checkout-summary__product-info">
                        <strong>
                          {item.product?.name ||
                            "Product"}
                        </strong>

                        <span>
                          Quantity: {item.quantity}
                        </span>
                      </div>
                    </div>

                    <strong>
                      ₹
                      {(
                        price * item.quantity
                      ).toFixed(2)}
                    </strong>
                  </div>
                );
              })}
            </div>

            <div className="checkout-summary__divider"></div>

            <div className="checkout-summary__row">
              <span>Subtotal</span>
              <strong>
                ₹{subtotal.toFixed(2)}
              </strong>
            </div>

            <div className="checkout-summary__row">
              <span>Shipping</span>
              <strong className="checkout-summary__free">
                Free
              </strong>
            </div>

            <div className="checkout-summary__total">
              <span>Total</span>

              <strong>
                ₹{subtotal.toFixed(2)}
              </strong>
            </div>

            <div className="checkout-summary__secure">
              <span>✓</span>

              <p>
                Your order details are securely processed
                through TechNova.
              </p>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}

export default Checkout;