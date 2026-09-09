import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar.jsx";
import HeaderSlider from "./components/HeaderSlider/HeaderSlider.jsx";
import HomeProduct from "./pages/HomeProduct.jsx";
import FeaturedProducts from "./components/FeaturedProducts/FeaturedProducts.jsx";
import Banner from "./components/Banner/Banner.jsx";
import Footer from "./components/Footer/Footer.jsx";

import Shop from "./pages/Shop/Shop.jsx";
import Categories from "./pages/Categories/Categories.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Orders from "./pages/Orders.jsx";
import OrderDetails from "./pages/OrderDetails.jsx";
import Account from "./pages/Account.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminProducts from "./pages/AdminProducts.jsx";
import AdminProductForm from "./pages/AdminProductForm.jsx";
import AdminOrders from "./pages/AdminOrders.jsx";
import AdminOrderDetails from "./pages/AdminOrderDetails.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import InfoPage from "./pages/InfoPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

import { getProducts } from "./services/api.js";

function Home({ products, loading, error }) {
  const navigate = useNavigate();
  return (
    <>
      <HeaderSlider />

      {loading && (
        <p
          style={{
            textAlign: "center",
            margin: "40px 0",
          }}
        >
          Loading products...
        </p>
      )}

      {error && (
        <p
          style={{
            textAlign: "center",
            margin: "40px 0",
            color: "#dc2626",
          }}
        >
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <HomeProduct products={products} onSeeMore={() => navigate("/shop")} />

          <FeaturedProducts />

          <Banner />
        </>
      )}
    </>
  );
}

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        setProducts(data.items || []);
      } catch (err) {
        console.error("Failed to load products:", err);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <AuthProvider>
      <div>
        <Navbar />
        <main>
          <Routes>
          <Route
            path="/"
            element={
              <Home
                products={products}
                loading={loading}
                error={error}
              />
            }
          />

          <Route
            path="/shop"
            element={<Shop />}
          />

            <Route path="/categories" element={<Categories />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<InfoPage page="about" />} />
            <Route path="/contact" element={<InfoPage page="contact" />} />
            <Route path="/privacy" element={<InfoPage page="privacy" />} />
            <Route path="/terms" element={<InfoPage page="terms" />} />
            <Route path="/help" element={<InfoPage page="help" />} />
            <Route path="/returns" element={<InfoPage page="returns" />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:id" element={<OrderDetails />} />
              <Route path="/account" element={<Account />} />
              <Route path="/wishlist" element={<Wishlist />} />
            </Route>
            <Route element={<ProtectedRoute admin />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/products/new" element={<AdminProductForm />} />
              <Route path="/admin/products/edit/:id" element={<AdminProductForm />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
            </Route>
            <Route path="*" element={<InfoPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;