import ProductCard from "../components/ProductCard/ProductCard.jsx";
import "./Home/HomeProduct.css";

function HomeProduct({ products = [], onSeeMore }) {
  return (
    <section className="home-products">
      <p className="home-products__title">
        Popular products
      </p>

      <div className="home-products__grid">
        {products.map((product, index) => (
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