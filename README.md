# TechNova — Full-Stack Ecommerce Platform

TechNova is a full-stack ecommerce platform built to provide a modern shopping experience with product discovery, authentication, cart management, checkout, order tracking, wishlist functionality, and administrative management.

The application is designed using a layered architecture with a React frontend, FastAPI backend, and MongoDB database.

---

## Overview

TechNova provides two major application areas:

### Customer

Customers can:

- Browse products
- Search products
- Filter products
- Sort products
- Browse categories
- View product details
- Register and log in
- Add products to cart
- Update cart quantities
- Remove products from cart
- Clear cart
- Checkout
- Place orders
- View order history
- View order details
- Cancel eligible orders
- Manage wishlist
- View account information

### Administrator

Administrators can:

- Access the admin dashboard
- Manage products
- Create products
- Edit products
- Delete products
- Manage categories where supported
- View customer orders
- View order details
- Update order status
- Manage catalogue information

---

# Technology Stack

## Frontend

- React.js
- Vite
- JavaScript
- React Router
- HTML5
- CSS3
- Fetch API

## Backend

- Python
- FastAPI
- Pydantic
- JWT Authentication
- Password Hashing

## Database

- MongoDB
- PyMongo

## Development Tools

- Git
- GitHub
- VS Code

---

# System Architecture

```text
                         ┌──────────────────────┐
                         │       Customer       │
                         │     Web Browser      │
                         └──────────┬───────────┘
                                    │
                                    │ HTTP / JSON
                                    ▼
                    ┌─────────────────────────────┐
                    │       React Frontend        │
                    │                             │
                    │ Pages                       │
                    │ Components                  │
                    │ React Router                │
                    │ Auth Context                │
                    │ API Service Layer            │
                    └──────────────┬──────────────┘
                                   │
                                   │ REST API
                                   ▼
                    ┌─────────────────────────────┐
                    │       FastAPI Backend       │
                    │                             │
                    │ Routes                      │
                    │ Schemas                     │
                    │ Services                    │
                    │ Authentication              │
                    │ Authorization                │
                    └──────────────┬──────────────┘
                                   │
                                   │ Database Queries
                                   ▼
                    ┌─────────────────────────────┐
                    │           MongoDB           │
                    │                             │
                    │ Users                       │
                    │ Products                    │
                    │ Categories                  │
                    │ Carts                       │
                    │ Orders                      │
                    │ Wishlists                   │
                    └─────────────────────────────┘