import React from "react";
import ProductCard from "../components/ProductCard/ProductCard.jsx";
import "./Home/HomeProduct.css";

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

function HomeProduct({ products = [], onSeeMore }) {
  const productsWithImages = products.map((product, index) => ({
    ...product,
    image: productImages[index % productImages.length],
  }));

  return (
    <section className="home-products">
      <p className="home-products__title">
        Popular products
      </p>

      <div className="home-products__grid">
        {productsWithImages.map((product, index) => (
          <ProductCard
            key={product.id || index}
            product={product}
          />
        ))}
      </div>

      <button
        type="button"
        className="home-products__see-more"
        onClick={onSeeMore}
      >
        See more
      </button>
    </section>
  );
}

export default HomeProduct;