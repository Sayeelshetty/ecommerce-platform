import React, { useEffect, useState } from "react";
import "./Shop.css";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import { getProducts } from "../../services/api.js";

const productImages = [
  "/assets/products/apple_earphone_image.png",
  "/assets/products/asus_laptop_image.png",
  "/assets/products/bose_headphone_image.png",
  "/assets/products/cannon_camera_image.png",
  "/assets/products/jbl_soundbox_image.png",
  "/assets/products/macbook_image.png",
  "/assets/products/md_controller_image.png",
  "/assets/products/playstation_image.png",
  "/assets/products/projector_image.png",
  "/assets/products/samsung_s23phone_image.png",
  "/assets/products/sm_controller_image.png",
  "/assets/products/sony_airbuds_image.png",
  "/assets/products/venu_watch_image.png",
];

function Shop() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const limit = 10;

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

  const productsWithImages = products.map((product, index) => ({
    ...product,
    image: productImages[index % productImages.length],
  }));

  const filteredProducts = productsWithImages
    .filter((product) =>
      product.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "price_asc") {
        return (
          (a.offerPrice ?? a.price ?? 0) -
          (b.offerPrice ?? b.price ?? 0)
        );
      }

      if (sort === "price_desc") {
        return (
          (b.offerPrice ?? b.price ?? 0) -
          (a.offerPrice ?? a.price ?? 0)
        );
      }

      return 0;
    });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / limit)
  );

  const currentPage = Math.min(page, totalPages);

  const startIndex = (currentPage - 1) * limit;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + limit
  );

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
    setPage(1);
  };

  const handleProductClick = (product) => {
    console.log("Selected product:", product);
  };

  return (
    <main className="shop-page">
      <div className="shop-page__container">

        <div className="shop-page__header">
          <div>
            <h1 className="shop-page__title">
              Shop
            </h1>

            <p className="shop-page__subtitle">
              Discover products made for your everyday tech needs.
            </p>
          </div>
        </div>

        <div className="shop-page__toolbar">

          <div className="shop-page__search">
            <img
              src="/assets/icons/search_icon.svg"
              alt=""
            />

            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search products..."
            />
          </div>

          <div className="shop-page__sort">
            <label htmlFor="sort">
              Sort by
            </label>

            <select
              id="sort"
              value={sort}
              onChange={handleSortChange}
            >
              <option value="newest">
                Newest
              </option>

              <option value="price_asc">
                Price: Low to High
              </option>

              <option value="price_desc">
                Price: High to Low
              </option>
            </select>
          </div>

        </div>

        {loading && (
          <div className="shop-page__message">
            Loading products...
          </div>
        )}

        {error && (
          <div className="shop-page__message shop-page__message--error">
            {error}
          </div>
        )}

        {!loading && !error && currentProducts.length === 0 && (
          <div className="shop-page__empty">
            <h2>
              No products found
            </h2>

            <p>
              Try a different search term.
            </p>
          </div>
        )}

        {!loading && !error && currentProducts.length > 0 && (
          <>
            <div className="shop-page__result-info">
              Showing{" "}
              <strong>
                {startIndex + 1}
              </strong>
              {" - "}
              <strong>
                {Math.min(
                  startIndex + limit,
                  filteredProducts.length
                )}
              </strong>{" "}
              of{" "}
              <strong>
                {filteredProducts.length}
              </strong>{" "}
              products
            </div>

            <div className="shop-page__grid">
              {currentProducts.map((product, index) => (
                <ProductCard
                  key={product.id || index}
                  product={product}
                  onClick={() => handleProductClick(product)}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="shop-page__pagination">

                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => {
                    setPage((prev) =>
                      Math.max(1, prev - 1)
                    );
                  }}
                >
                  Previous
                </button>

                <div className="shop-page__page-numbers">
                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      className={
                        currentPage === pageNumber
                          ? "shop-page__page-number shop-page__page-number--active"
                          : "shop-page__page-number"
                      }
                      onClick={() => {
                        setPage(pageNumber);
                      }}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setPage((prev) =>
                      Math.min(totalPages, prev + 1)
                    );
                  }}
                >
                  Next
                </button>

              </div>
            )}
          </>
        )}

      </div>
    </main>
  );
}

export default Shop;