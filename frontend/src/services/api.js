const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000";

const TOKEN_KEY = "technova_access_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});

  if (
    options.body &&
    !(options.body instanceof FormData)
  ) {
    headers.set("Content-Type", "application/json");
  }

  const token = getToken();

  if (token) {
    headers.set(
      "Authorization",
      `Bearer ${token}`
    );
  }

  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      ...options,
      headers,
      body:
        options.body &&
        !(options.body instanceof FormData)
          ? JSON.stringify(options.body)
          : options.body,
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    if (response.status === 401) {
      clearToken();
      window.dispatchEvent(
        new Event("technova:unauthorized")
      );
    }

    const message = Array.isArray(data?.detail)
      ? data.detail
          .map((item) => item.msg)
          .join(", ")
      : data?.detail ||
        "Something went wrong. Please try again.";

    const error = new Error(message);
    error.status = response.status;

    throw error;
  }

  return data;
}

function queryString(params) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        query.set(key, value);
      }
    }
  );

  const result = query.toString();

  return result ? `?${result}` : "";
}

/* =========================
   PRODUCTS
========================= */

export const getProducts = (
  params = {}
) =>
  request(
    `/product/${queryString(params)}`
  );

export const getProduct = (id) =>
  request(`/product/${id}`);

export const createProduct = (payload) =>
  request("/product/", {
    method: "POST",
    body: payload,
  });

export const updateProduct = (
  id,
  payload
) =>
  request(`/product/${id}`, {
    method: "PUT",
    body: payload,
  });

export const deleteProduct = (id) =>
  request(`/product/${id}`, {
    method: "DELETE",
  });

/* =========================
   CATEGORIES
========================= */

export const getCategories = () =>
  request("/category/");

export const createCategory = (
  payload
) =>
  request("/category/", {
    method: "POST",
    body: payload,
  });

/* =========================
   AUTHENTICATION
========================= */

export const register = (payload) =>
  request("/auth/register", {
    method: "POST",
    body: payload,
  });

export const login = (payload) =>
  request("/auth/login", {
    method: "POST",
    body: payload,
  });

export const getCurrentUser = () =>
  request("/auth/me");

/* =========================
   CART
========================= */

export const getCart = () =>
  request("/cart/");

export const addToCart = (payload) =>
  request("/cart/", {
    method: "POST",
    body: payload,
  });

export const updateCartItem = (
  productId,
  quantity
) =>
  request(`/cart/${productId}`, {
    method: "PUT",
    body: {
      quantity,
    },
  });

export const removeCartItem = (
  productId
) =>
  request(`/cart/${productId}`, {
    method: "DELETE",
  });

export const clearCart = () =>
  request("/cart/", {
    method: "DELETE",
  });

/* =========================
   ORDERS
========================= */

export const createOrder = (
  payload
) =>
  request("/order/", {
    method: "POST",
    body: payload,
  });

export const getOrders = () =>
  request("/order/");

export const getOrder = (id) =>
  request(`/order/${id}`);

export const cancelOrder = (id) =>
  request(`/order/${id}`, {
    method: "DELETE",
  });

/* =========================
   ADMIN ORDERS
========================= */

export const getAdminOrders = () =>
  request("/order/admin/all");

export const getAdminOrder = (id) =>
  request(`/order/admin/${id}`);

export const updateOrderStatus = (
  id,
  status
) =>
  request(`/order/${id}/status`, {
    method: "PATCH",
    body: {
      status,
    },
  });

/* =========================
   WISHLIST
========================= */

export const getWishlist = () =>
  request("/wishlist/");

export const addWishlistItem = (
  productId
) =>
  request("/wishlist/", {
    method: "POST",
    body: {
      product_id: productId,
    },
  });

export const removeWishlistItem = (
  productId
) =>
  request(`/wishlist/${productId}`, {
    method: "DELETE",
  });