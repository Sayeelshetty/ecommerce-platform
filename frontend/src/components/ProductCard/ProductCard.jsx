import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProductImage, handleProductImageError } from "../../utils/productImage.js";
import { addWishlistItem, getWishlist, removeWishlistItem } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import "./ProductCard.css";

function ProductCard({ product, onClick }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [wishlisted, setWishlisted] = useState(false);
  const rating = Number(product?.rating ?? 0);
  const reviewCount = Number(product?.review_count ?? 0);

  const productImage = getProductImage(product);

  const price =
    product?.offerPrice ??
    product?.offer_price ??
    product?.price ??
    0;

  useEffect(() => { if (user) getWishlist().then((list) => setWishlisted((list.product_ids || []).includes(product?.id))).catch(() => {}); else setWishlisted(false); }, [user, product?.id]);
  const toggleWishlist = async (event) => { event.stopPropagation(); if (!user) { navigate("/login", { state: { from: `/product/${product.id}` } }); return; } try { if (wishlisted) await removeWishlistItem(product.id); else await addWishlistItem(product.id); setWishlisted(!wishlisted); } catch {} };

  return (
    <div
      className="product-card"
      onClick={onClick || (() => navigate(`/product/${product.id}`))}
    >
      <div className="product-card__image-wrapper">
        {productImage ? (
          <img
            className="product-card__image"
            src={productImage}
            alt={product?.name || "Product"}
            onError={handleProductImageError}
          />
        ) : (
          <div className="product-card__image-placeholder">
            No image
          </div>
        )}

        <button
          type="button"
          className={wishlisted ? "product-card__wishlist product-card__wishlist--active" : "product-card__wishlist"}
          aria-label="Add to wishlist"
          onClick={toggleWishlist}
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
          {rating.toFixed(1)}
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
        {reviewCount > 0 && <span className="product-card__review-count">({reviewCount})</span>}
      </div>

      <div className="product-card__bottom">
        <div className="product-card__prices">
          <p className="product-card__price">₹{price}</p>
          {product?.offer_price && product.offer_price < product.price && <del>₹{product.price}</del>}
        </div>

        <button
          type="button"
          className="product-card__buy"
          onClick={(event) => {
            event.stopPropagation();
            onClick?.();
            if (!onClick) navigate(`/product/${product.id}`);
          }}
        >
          Buy now
        </button>
      </div>
    </div>
  );
}

export default ProductCard;