import { useNavigate } from "react-router-dom";
import "./FeaturedProducts.css";

const featuredItems = [
  {
    id: 1,
    image: "/assets/banners/featured_audio.png",
    title: "Unparalleled Sound",
    description:
      "Experience crystal-clear audio with premium headphones.",
  },
  {
    id: 2,
    image: "/assets/banners/featured_earphones.png",
    title: "Stay Connected",
    description:
      "Compact and stylish earphones for every occasion.",
  },
  {
    id: 3,
    image: "/assets/banners/featured_laptop.png",
    title: "Power in Every Pixel",
    description:
      "Shop the latest laptops for work, gaming, and more.",
  },
];

function FeaturedProducts() {
  const navigate = useNavigate();
  return (
    <section className="featured-products">
      <div className="featured-products__container">
        <div className="featured-products__heading">
          <h2>Featured Products</h2>
          <span></span>
        </div>

        <div className="featured-products__grid">
          {featuredItems.map((item) => (
            <article
              className="featured-products__card"
              key={item.id}
            >
              <img
                className="featured-products__image"
                src={item.image}
                alt={item.title}
              />

              <div className="featured-products__overlay"></div>

              <div className="featured-products__content">
                <h3>{item.title}</h3>

                <p>{item.description}</p>

                <button
                  type="button"
                  className="featured-products__button"
                  onClick={() => navigate("/shop")}
                >
                  Buy now
                  <span>↗</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;