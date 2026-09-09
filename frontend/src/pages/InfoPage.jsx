import { Link, useParams } from "react-router-dom";
import "./pages.css";

const content = {
  about: ["About TechNova", "TechNova brings dependable technology, thoughtful service, and a calmer way to shop for your setup."],
  contact: ["Contact us", "Need help with an order or product? Email technova@example.com and our team will respond soon."],
  privacy: ["Privacy policy", "We use your account and order information only to provide authentication, fulfilment, and support."],
  terms: ["Terms and conditions", "Orders are subject to product availability, accurate customer information, and the status shown in your account."],
  help: ["Help center", "For product, cart, checkout, or order questions, contact technova@example.com with your order ID."],
  returns: ["Returns and refunds", "Pending orders can be cancelled from the order details page. Contact support for return eligibility questions."],
};

function InfoPage({ page }) { const { slug } = useParams(); const [title, description] = content[page || slug] || ["Page not found", "The page you requested is not available."]; return <main className="page-shell"><div className="form-card"><h1>{title}</h1><p>{description}</p><Link className="primary-button" to="/shop">Continue shopping</Link></div></main>; }
export default InfoPage;
