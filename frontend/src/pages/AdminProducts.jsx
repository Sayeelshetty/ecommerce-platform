import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteProduct, getProducts } from "../services/api.js";
import "./pages.css";
import "./Admin.css";

function AdminProducts() {
  const [products, setProducts] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const load = () => { getProducts({ limit: 100 }).then((data) => setProducts(data.items || [])).catch((err) => setError(err.message)).finally(() => setLoading(false)); };
  useEffect(load, []);
  const remove = async (id) => { if (!window.confirm("Delete this product?")) return; try { await deleteProduct(id); setLoading(true); load(); } catch (err) { setError(err.message); } };
  if (loading) return <div className="page-state">Loading products...</div>;
  return <main className="page-shell admin-shell"><div className="admin-heading"><div className="page-heading"><h1>Products</h1>
  <p>Keep the TechNova catalogue current.</p></div><Link className="primary-button" to="/admin/products/new">New product</Link></div>{error && <div className="form-error">{error}</div>}<div className="admin-table-wrap">
    <table className="admin-table"><thead><tr><th>Product</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td>
      <div className="table-product"><img src={product.image_url || "/assets/products/apple_earphone_image.png"} alt="" /><span>{product.name}</span></div></td><td>₹{product.price}</td><td>{product.stock}</td><td>
        <div className="inline-actions"><Link className="secondary-button" to={`/admin/products/edit/${product.id}`}>Edit</Link><button className="danger-button" onClick={() => remove(product.id)}>Delete</button></div></td></tr>)}</tbody></table>{!products.length && <div className="empty-panel">No products found.</div>}</div></main>;
}

export default AdminProducts;
