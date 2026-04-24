# Database Documentation – Ecommerce Marketplace (SQL Version)

## 1. Database Overview

Database Type: Relational Database (PostgreSQL / MySQL)

Design Principles:

* Normalized schema (avoid data duplication)
* Foreign key constraints for integrity
* Indexed for performance
* Orders store price snapshot for historical accuracy

---

# 2. Core Relationships Overview

* A User can be a Customer, Vendor, or Admin.
* A Vendor is linked to a User.
* A Vendor owns Products.
* A Product belongs to a Category.
* A Product has multiple Variants.
* A Customer places Orders.
* An Order contains Order Items.
* A Customer can review a Product (one review per product).

---

# 3. Tables

---

## users

### Purpose

Stores authentication and role information.

### Relationships

* One-to-one with vendors (if role = VENDOR)
* One-to-many with orders
* One-to-many with reviews

### Important Columns

* id (Primary Key)
* email (Unique)
* role (ADMIN | VENDOR | CUSTOMER)
* is_active
* created_at

### Indexes

* UNIQUE(email)
* INDEX(role)
* INDEX(created_at)

---

## vendors

### Purpose

Stores vendor shop details.

### Relationships

* Belongs to users
* One-to-many with products

### Important Columns

* id (Primary Key)
* user_id (Foreign Key → users.id)
* shop_name
* is_approved

### Indexes

* UNIQUE(user_id)
* INDEX(is_approved)

---

## categories

### Purpose

Organizes products.

### Relationships

* One-to-many with products

### Important Columns

* id (Primary Key)
* name (Unique)
* parent_id (nullable for hierarchy)

### Indexes

* UNIQUE(name)
* INDEX(parent_id)

---

## products

### Purpose

Stores base product information.

### Relationships

* Belongs to vendors
* Belongs to categories
* One-to-many with product_variants
* One-to-many with reviews

### Important Columns

* id (Primary Key)
* vendor_id (Foreign Key → vendors.id)
* category_id (Foreign Key → categories.id)
* name
* description
* base_price
* is_active
* created_at

### Indexes

* INDEX(vendor_id)
* INDEX(category_id)
* INDEX(base_price)
* INDEX(is_active)

---

## product_variants

### Purpose

Represents variations like size, color.

### Relationships

* Belongs to products

### Important Columns

* id (Primary Key)
* product_id (Foreign Key → products.id)
* variant_name
* price
* stock_quantity
* sku

### Indexes

* INDEX(product_id)
* UNIQUE(product_id, sku)

---

## orders

### Purpose

Represents customer purchase.

### Relationships

* Belongs to users
* One-to-many with order_items

### Important Columns

* id (Primary Key)
* user_id (Foreign Key → users.id)
* total_amount
* status (PENDING | SHIPPED | DELIVERED | CANCELLED)
* created_at

### Indexes

* INDEX(user_id)
* INDEX(status)
* INDEX(created_at)

---

## order_items

### Purpose

Stores purchased products snapshot.

### Relationships

* Belongs to orders
* References product and variant

### Important Columns

* id (Primary Key)
* order_id (Foreign Key → orders.id)
* product_id (Foreign Key → products.id)
* variant_id (Foreign Key → product_variants.id)
* quantity
* price_at_purchase

### Indexes

* INDEX(order_id)
* INDEX(product_id)

### Notes

* price_at_purchase ensures historical accuracy.
* Product edits do not affect old orders.

---

## reviews

### Purpose

Stores customer feedback.

### Relationships

* Belongs to users
* Belongs to products

### Important Columns

* id (Primary Key)
* user_id (Foreign Key → users.id)
* product_id (Foreign Key → products.id)
* rating
* comment
* created_at

### Indexes

* INDEX(product_id)
* UNIQUE(user_id, product_id)

### Notes

* One review per user per product.
* Vendor cannot review own product (handled in service layer).

---

# 4. Design Decisions

## 1. Variants as Separate Table

Reason:

* Proper normalization
* Easier inventory tracking
* Supports filtering by variant

## 2. Order Items Store Snapshot Price

Reason:

* Prevents future product price updates affecting old orders.

## 3. Role-Based Users Table

Reason:

* Avoids unnecessary separate admin table.
* Simplifies authentication logic.

---

# 5. Performance Assumptions

* Email lookup must be fast (unique index).
* Product filtering relies on category and price indexes.
* Orders frequently queried by user_id.
* Reviews frequently queried by product_id.

Indexes may be adjusted as data grows.
