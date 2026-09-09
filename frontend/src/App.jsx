import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar.jsx";
import HeaderSlider from "./components/HeaderSlider/HeaderSlider.jsx";
import HomeProduct from "./pages/HomeProduct.jsx";
import FeaturedProducts from "./components/FeaturedProducts/FeaturedProducts.jsx";
import Banner from "./components/Banner/Banner.jsx";
import { getProducts } from "./services/api.js";
import Footer from "./components/Footer/Footer.jsx";

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

            <FeaturedProducts products={products} />

            <Banner />
          </>
        )}

        <Footer/>
      </main>
    </div>
  );
}

export default App;