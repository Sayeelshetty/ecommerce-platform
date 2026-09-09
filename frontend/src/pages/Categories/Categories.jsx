import React from "react";
import "./Categories.css";

const categories = [
  {
    id: 1,
    name: "Laptops",
    description: "Powerful devices for work, study and creativity.",
    image: "/assets/products/asus_laptop_image.png",
  },
  {
    id: 2,
    name: "Smartphones",
    description: "Stay connected with the latest mobile technology.",
    image: "/assets/products/samsung_s23phone_image.png",
  },
  {
    id: 3,
    name: "Audio",
    description: "Immersive sound for music, gaming and everyday life.",
    image: "/assets/products/bose_headphone_image.png",
  },
  {
    id: 4,
    name: "Gaming",
    description: "Level up your gaming setup with powerful gear.",
    image: "/assets/products/playstation_image.png",
  },
  {
    id: 5,
    name: "Monitors",
    description: "Sharper visuals for work, entertainment and gaming.",
    image: "/assets/products/macbook_image.png",
  },
  {
    id: 6,
    name: "Wearables",
    description: "Smart technology that keeps up with your lifestyle.",
    image: "/assets/products/venu_watch_image.png",
  },
  {
    id: 7,
    name: "Computer Accessories",
    description: "Essential accessories to complete your setup.",
    image: "/assets/products/md_controller_image.png",
  },
  {
    id: 8,
    name: "Accessories",
    description: "Useful tech accessories for everyday convenience.",
    image: "/assets/products/apple_earphone_image.png",
  },
];

function Categories() {
  return (
    <main className="categories-page">
      <div className="categories-page__container">
        <header className="categories-page__header">
          <span className="categories-page__eyebrow">
            Explore TechNova
          </span>

          <h1 className="categories-page__title">
            Shop by Category
          </h1>

          <p className="categories-page__subtitle">
            Find the right technology for your work, entertainment,
            gaming and everyday life.
          </p>
        </header>

        <section className="categories-page__grid">
          {categories.map((category) => (
            <article
              className="category-card"
              key={category.id}
            >
              <div className="category-card__image-wrapper">
                <img
                  className="category-card__image"
                  src={category.image}
                  alt={category.name}
                  onError={(event) => {
                    event.currentTarget.src =
                      "/assets/products/apple_earphone_image.png";
                  }}
                />
              </div>

              <div className="category-card__content">
                <h2 className="category-card__title">
                  {category.name}
                </h2>

                <p className="category-card__description">
                  {category.description}
                </p>

                <button
                  type="button"
                  className="category-card__button"
                >
                  Explore
                  <span>→</span>
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

export default Categories;