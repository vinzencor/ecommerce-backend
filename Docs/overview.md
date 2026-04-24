# Ecommerce Marketplace Backend – Overview

## 1. Project Purpose

This project is a multi-vendor ecommerce backend system built using a relational database (SQL).

It allows:

* Customers to browse and purchase products
* Vendors to manage and sell their products
* Admin to control and monitor the entire platform

The system is designed to be scalable and support multiple product categories (not limited to dresses or makeup).

---

## 2. User Roles

### 1. Customer

* Register and login
* Browse products
* Add to cart
* Place orders
* Track order status
* Review products

### 2. Vendor

* Create and manage products
* Add product variants (size, color, etc.)
* Manage inventory
* View and process orders
* View product reviews

### 3. Admin

* Approve or block vendors
* Block users
* Manage categories
* Monitor orders
* Platform-level control

---

## 3. Core Features

### Authentication

* JWT-based authentication
* Role-based authorization
* Protected routes

### Product Management

* Products created by vendors
* Support for multiple variants
* Inventory tracking per variant
* Category-based filtering

### Order System

* Customer checkout flow
* Order status updates
* Vendor order processing
* Admin monitoring
* Historical price preservation at purchase time

### Review System

* Customers can review products
* One review per user per product
* Vendor cannot review own product
* Optional helpful interaction system

---

## 4. Architecture Overview

The backend follows a layered architecture:

Controller → Service → Repository → Database

Responsibilities:

* Controllers handle HTTP requests
* Services contain business logic
* Repositories interact with database
* Models define database schema

This structure improves scalability, testability, and maintainability.

---

## 5. Database Strategy

* A relational SQL database (PostgreSQL/MySQL) is used.
* Proper normalization is followed to reduce data duplication.
* Foreign key constraints enforce data integrity.
* Product variants are stored in a separate table.
* Order items store snapshot price to preserve historical accuracy.
* Indexing is applied for performance (email, product filtering, order lookup).

---

## 6. Project Goals

* Maintain clean API contracts
* Keep relational data structured and normalized
* Support secure multi-role access control
* Ensure scalability for future expansion
* Keep documentation minimal and practical

---

## 7. Documentation Rule

We document:

* Features
* Database structure
* API contracts
* Architecture decisions
* Important lessons

We do not document:

* Minor refactors
* Internal helper functions
* Small variable changes

Code explains HOW.
Documentation explains WHAT and WHY.
