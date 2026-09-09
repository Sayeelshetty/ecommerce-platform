import React from "react";
import "./Banner.css";

function Banner() {
  return (
    <section className="banner">
      <div className="banner__content">
        <span className="banner__badge">
          TechNova Collection
        </span>

        <h2 className="banner__title">
          Upgrade Your
          <span> Tech Experience</span>
        </h2>

        <p className="banner__description">
          Discover powerful gadgets, immersive audio and smart
          technology designed for the way you live, work and play.
        </p>

        <div className="banner__actions">
          <button
            type="button"
            className="banner__primary-button"
          >
            Shop now
          </button>

          <button
            type="button"
            className="banner__secondary-button"
          >
            Explore collection
            <span>→</span>
          </button>
        </div>
      </div>

      <div className="banner__visual">
        <div className="banner__glow banner__glow--one"></div>
        <div className="banner__glow banner__glow--two"></div>

        <img
          className="banner__soundbox"
          src="/assets/products/jbl_soundbox_image.png"
          alt="JBL Soundbox"
        />

        <img
          className="banner__controller"
          src="/assets/products/md_controller_image.png"
          alt="Gaming controller"
        />
      </div>
    </section>
  );
}

export default Banner;