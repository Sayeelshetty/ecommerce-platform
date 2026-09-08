# E-Commerce Backend API

FastAPI and MongoDB backend for the e-commerce platform.

## Run locally

1. Create and activate a virtual environment.
2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Add a `.env` file in this `backend` folder:

   ```env
   MONGODB_URI=mongodb://localhost:27017
   DATABASE_NAME=ecommerce
   SECRET_KEY=replace-with-a-long-random-secret
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

4. Start the API from the `backend` folder:

   ```bash
   uvicorn app.main:app --reload
   ```

The API runs at `http://127.0.0.1:8000`. Interactive Swagger documentation is available at `/docs`.

## Authentication

Register with `POST /auth/register`, then sign in with `POST /auth/login`. The login response contains an access token. Send it on protected endpoints:

```http
Authorization: Bearer <access_token>
```

Product creation, editing, and deletion also require the authenticated user to have the `admin` role. All cart and order routes require an authenticated user.

## Endpoints

### Service

| Method | Path | Authentication | Description |
| --- | --- | --- | --- |
| GET | `/` | No | Confirms that the API is running. |
| GET | `/db-test` | No | Pings MongoDB and reports connection status. |

### Authentication

| Method | Path | Authentication | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | No | Creates a user. Returns `409` if the email already exists. |
| POST | `/auth/login` | No | Signs in and returns a JWT access token. |
| GET | `/auth/me` | Bearer token | Returns the current user's public profile. |

Create an account:

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "secure-password"
}
```

Sign in:

```json
{
  "email": "ada@example.com",
  "password": "secure-password"
}
```

Successful login response:

```json
{
  "access_token": "<jwt>",
  "token_type": "bearer"
}
```

### Categories

| Method | Path | Authentication | Description |
| --- | --- | --- | --- |
| POST | `/category/` | No | Creates a category. Returns `409` for an existing name. |
| GET | `/category/` | No | Lists all categories. |

Request body for category creation:

```json
{
  "name": "Electronics",
  "description": "Devices and accessories"
}
```

### Products

| Method | Path | Authentication | Description |
| --- | --- | --- | --- |
| POST | `/product/` | Admin bearer token | Creates a product. The category must exist. |
| GET | `/product/` | No | Lists all products. |
| PUT | `/product/{product_id}` | Admin bearer token | Updates supplied product fields. |
| DELETE | `/product/{product_id}` | Admin bearer token | Deletes a product. |

Create-product body:

```json
{
  "name": "Wireless Mouse",
  "description": "Compact Bluetooth mouse",
  "price": 29.99,
  "category_id": "<category_id>",
  "stock": 20,
  "image_url": "https://example.com/mouse.jpg"
}
```

For `PUT /product/{product_id}`, send only fields that should change. `name`, `description`, `price`, `category_id`, `stock`, and `image_url` are supported. Prices must be greater than zero; stock cannot be negative.

### Cart

| Method | Path | Authentication | Description |
| --- | --- | --- | --- |
| POST | `/cart/` | Bearer token | Adds a product or increases its quantity. Validates stock. |
| GET | `/cart/` | Bearer token | Returns the current user's cart. |
| PUT | `/cart/{product_id}` | Bearer token | Sets an item's quantity. Validates stock. |
| DELETE | `/cart/{product_id}` | Bearer token | Removes an item from the cart. |

Add an item:

```json
{
  "product_id": "<product_id>",
  "quantity": 2
}
```

Update its quantity:

```json
{
  "quantity": 3
}
```

### Orders

| Method | Path | Authentication | Description |
| --- | --- | --- | --- |
| POST | `/order/` | Bearer token | Creates an order from the user's cart, reduces stock, and clears the cart. |
| GET | `/order/` | Bearer token | Lists the current user's orders. |
| GET | `/order/{order_id}` | Bearer token | Returns one of the current user's orders. |
| DELETE | `/order/{order_id}` | Bearer token | Cancels a pending order and restores its stock. |

Creating an order has no request body. It fails with `400` when the cart is empty, a product no longer exists, or available stock is insufficient.

## Common status codes

| Status | Meaning |
| --- | --- |
| `201` | Resource created. |
| `400` | Invalid cart/order operation or stock is unavailable. |
| `401` | Missing, invalid, or expired access token; or invalid login. |
| `403` | Authenticated user is not an admin. |
| `404` | Requested user, product, cart item, or order was not found. |
| `409` | Duplicate email or category. |
