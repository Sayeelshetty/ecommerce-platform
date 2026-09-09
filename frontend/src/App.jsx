import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar.jsx";
import HeaderSlider from "./components/HeaderSlider/HeaderSlider.jsx";
import HomeProduct from "./pages/HomeProduct.jsx";
import FeaturedProducts from "./components/FeaturedProducts/FeaturedProducts.jsx";
import Banner from "./components/Banner/Banner.jsx";
import Footer from "./components/Footer/Footer.jsx";

import Shop from "./pages/Shop/Shop.jsx";
import Categories from "./pages/Categories/Categories.jsx";

import { getProducts } from "./services/api.js";

function Home({
  products,
  loading,
  error,
}) {
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
          <HomeProduct products={products} />

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

          <Route
            path="/categories"
            element={<Categories />}
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;