import React from "react";
import "./ProductCard.css";

function ProductCard({ product, onClick }) {
  const rating = 4.5;

  const imageName = Array.isArray(product?.image)
    ? product.image[0]
    : product?.image;

  const productImage = imageName
    ? imageName.startsWith("http")
      ? imageName
      : `/assets/products/${imageName.split("/").pop()}`
    : "";

  const price =
    product?.offerPrice ??
    product?.offer_price ??
    product?.price ??
    0;

  return (
    <div
      className="product-card"
      onClick={onClick}
    >
      <div className="product-card__image-wrapper">
        {productImage ? (
          <img
            className="product-card__image"
            src={productImage}
            alt={product?.name || "Product"}
          />
        ) : (
          <div className="product-card__image-placeholder">
            No image
          </div>
        )}

        <button
          type="button"
          className="product-card__wishlist"
          aria-label="Add to wishlist"
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <img
            src="/assets/icons/heart_icon.svg"
            alt=""
          />
        </button>
      </div>

      <p className="product-card__name">
        {product?.name || "Product name"}
      </p>

      <p className="product-card__description">
        {product?.description || ""}
      </p>

      <div className="product-card__rating">
        <span className="product-card__rating-number">
          {rating}
        </span>

        <div className="product-card__stars">
          {Array.from({ length: 5 }).map((_, index) => (
            <img
              key={index}
              src={
                index < Math.floor(rating)
                  ? "/assets/icons/star_icon.svg"
                  : "/assets/icons/star_dull_icon.svg"
              }
              alt=""
            />
          ))}
        </div>
      </div>

      <div className="product-card__bottom">
        <p className="product-card__price">
          ₹{price}
        </p>

        <button
          type="button"
          className="product-card__buy"
          onClick={(event) => {
            event.stopPropagation();
            onClick?.();
          }}
        >
          Buy now
        </button>
      </div>
    </div>
  );
}

export default ProductCard;