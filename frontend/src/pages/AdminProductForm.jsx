import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  createProduct,
  getCategories,
  getProduct,
  updateProduct,
} from "../services/api.js";

import "./pages.css";
import "./Admin.css";

function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    offer_price: "",
    rating: "4.5",
    review_count: "0",
    category_id: "",
    stock: "",
    image_url: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const categoryData = await getCategories();

        setCategories(
          Array.isArray(categoryData)
            ? categoryData
            : categoryData?.items || []
        );

        if (isEditMode) {
          const product = await getProduct(id);

          setForm({
            name: product?.name || "",
            description: product?.description || "",
            price: product?.price?.toString() || "",
            offer_price:
              product?.offer_price !== null &&
              product?.offer_price !== undefined
                ? product.offer_price.toString()
                : "",
            rating:
              product?.rating !== null &&
              product?.rating !== undefined
                ? product.rating.toString()
                : "0",
            review_count:
              product?.review_count !== null &&
              product?.review_count !== undefined
                ? product.review_count.toString()
                : "0",
            category_id: product?.category_id || "",
            stock:
              product?.stock !== null &&
              product?.stock !== undefined
                ? product.stock.toString()
                : "",
            image_url: product?.image_url || "",
          });
        }
      } catch (err) {
        console.error("Failed to load product form:", err);

        setError(
          err?.message ||
            "Unable to load the product information."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, isEditMode]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const name = form.name.trim();
    const description = form.description.trim();
    const price = Number(form.price);
    const offerPrice =
      form.offer_price.trim() === ""
        ? null
        : Number(form.offer_price);
    const rating = Number(form.rating);
    const reviewCount = Number(form.review_count);
    const stock = Number(form.stock);
    const categoryId = form.category_id.trim();
    const imageUrl = form.image_url.trim();

    if (name.length < 2) {
      setError("Product name must contain at least 2 characters.");
      return;
    }

    if (description.length < 5) {
      setError(
        "Product description must contain at least 5 characters."
      );
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setError("Please enter a valid product price.");
      return;
    }

    if (
      offerPrice !== null &&
      (!Number.isFinite(offerPrice) || offerPrice <= 0)
    ) {
      setError("Please enter a valid offer price.");
      return;
    }

    if (
      offerPrice !== null &&
      offerPrice > price
    ) {
      setError(
        "Offer price cannot be greater than the original price."
      );
      return;
    }

    if (
      !Number.isFinite(rating) ||
      rating < 0 ||
      rating > 5
    ) {
      setError("Rating must be between 0 and 5.");
      return;
    }

    if (
      !Number.isInteger(reviewCount) ||
      reviewCount < 0
    ) {
      setError(
        "Review count must be a whole number greater than or equal to 0."
      );
      return;
    }

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    if (
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      setError(
        "Stock must be a whole number greater than or equal to 0."
      );
      return;
    }

    const payload = {
      name,
      description,
      price,
      offer_price: offerPrice,
      rating,
      review_count: reviewCount,
      category_id: categoryId,
      stock,
      image_url: imageUrl || null,
    };

    try {
      setSaving(true);

      if (isEditMode) {
        await updateProduct(id, payload);
        setSuccess("Product updated successfully.");
      } else {
        await createProduct(payload);
        setSuccess("Product created successfully.");
      }

      setTimeout(() => {
        navigate("/admin/products");
      }, 700);
    } catch (err) {
      console.error("Failed to save product:", err);

      setError(
        err?.message ||
          "Unable to save the product. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-state">
        Loading product form...
      </div>
    );
  }

  return (
    <main className="page-shell admin-shell">
      <div className="admin-heading">
        <div className="page-heading">
          <h1>
            {isEditMode
              ? "Edit product"
              : "New product"}
          </h1>

          <p>
            {isEditMode
              ? "Update the selected TechNova product."
              : "Add a new product to the TechNova catalogue."}
          </p>
        </div>

        <Link
          className="secondary-button"
          to="/admin/products"
        >
          Back to products
        </Link>
      </div>

      <section className="admin-form">
        <form onSubmit={handleSubmit}>
          <div className="form-card">
            <h2>Product information</h2>

            <div className="form-field">
              <label htmlFor="name">
                Product name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Sony Wireless Earbuds"
              />
            </div>

            <div className="form-field">
              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="5"
                placeholder="Describe the product..."
              />
            </div>

            <div className="two-fields">
              <div className="form-field">
                <label htmlFor="price">
                  Price (₹)
                </label>

                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="24999"
                />
              </div>

              <div className="form-field">
                <label htmlFor="offer_price">
                  Offer price (₹)
                </label>

                <input
                  id="offer_price"
                  name="offer_price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.offer_price}
                  onChange={handleChange}
                  placeholder="19999"
                />
              </div>
            </div>

            <div className="two-fields">
              <div className="form-field">
                <label htmlFor="category_id">
                  Category
                </label>

                <select
                  id="category_id"
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                >
                  <option value="">
                    Select category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="stock">
                  Stock
                </label>

                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="25"
                />
              </div>
            </div>

            <div className="two-fields">
              <div className="form-field">
                <label htmlFor="rating">
                  Rating
                </label>

                <input
                  id="rating"
                  name="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={form.rating}
                  onChange={handleChange}
                  placeholder="4.5"
                />
              </div>

              <div className="form-field">
                <label htmlFor="review_count">
                  Review count
                </label>

                <input
                  id="review_count"
                  name="review_count"
                  type="number"
                  min="0"
                  step="1"
                  value={form.review_count}
                  onChange={handleChange}
                  placeholder="120"
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="image_url">
                Image path
              </label>

              <input
                id="image_url"
                name="image_url"
                type="text"
                value={form.image_url}
                onChange={handleChange}
                placeholder="/assets/products/example.jpg"
              />

              <small>
                Use a local asset path from
                {" "}
                frontend/public/assets/products/
              </small>
            </div>

            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            {success && (
              <div className="form-success">
                {success}
              </div>
            )}

            <div className="form-actions">
              <Link
                className="secondary-button"
                to="/admin/products"
              >
                Cancel
              </Link>

              <button
                className="primary-button"
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : isEditMode
                  ? "Update product"
                  : "Create product"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}

export default AdminProductForm;