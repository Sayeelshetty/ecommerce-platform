import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./pages.css";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form);

      navigate(
        location.state?.from || "/account",
        { replace: true }
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <form
        className="form-card"
        onSubmit={submit}
      >
        <h1>Welcome back</h1>

        <p>
          Sign in to manage your TechNova account.
        </p>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <div className="form-grid">
          <label className="form-field">
            Email

            <input
              type="email"
              required
              value={form.email}
              onChange={(event) =>
                setForm({
                  ...form,
                  email: event.target.value,
                })
              }
            />
          </label>

          <label className="form-field">
            Password

            <div
              style={{
                position: "relative",
              }}
            >
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                required
                value={form.password}
                onChange={(event) =>
                  setForm({
                    ...form,
                    password: event.target.value,
                  })
                }
                style={{
                  width: "100%",
                  paddingRight: "44px",
                  boxSizing: "border-box",
                }}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (previous) => !previous
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "12px",
                  transform: "translateY(-50%)",
                  padding: "4px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#667085",
                  fontSize: "16px",
                }}
              >
                {showPassword ? "◉" : "◌"}
              </button>
            </div>
          </label>

          <button
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign in"}
          </button>
        </div>

        <p className="auth-switch">
          New to TechNova?{" "}
          <Link to="/register">
            Create an account
          </Link>
        </p>
      </form>
    </main>
  );
}

export default Login;