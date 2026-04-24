# API Documentation – Ecommerce Marketplace

## 1. Base Configuration

Base URL:

```
/api/v1
```

Authentication:

* JWT Bearer Token
* Header: Authorization: Bearer <token>

Roles:

* ADMIN
* VENDOR
* CUSTOMER

---

# 2. Authentication

## Register (Customer)

POST /auth/register

Request:
{
"name": "string",
"email": "string",
"password": "string"
}

Response:
201 Created
{
"id": "uuid",
"email": "string",
"role": "CUSTOMER"
}

---

## Login

POST /auth/login

Request:
{
"email": "string",
"password": "string"
}

Response:
200 OK
{
"accessToken": "jwt_token",
"role": "CUSTOMER"
}

---

# 3. Users

## Get Profile

GET /users/me
Auth: Required

Response:
200 OK
{
"id": "uuid",
"name": "string",
"email": "string",
"role": "CUSTOMER"
}

---

# 4. Vendor Management

## Apply as Vendor

POST /vendors
Auth: CUSTOMER

Request:
{
"shopName": "string"
}

Response:
201 Created

---

## Approve Vendor

PATCH /vendors/:id/approve
Auth: ADMIN

Response:
200 OK

---

# 5. Categories

## Create Category

POST /categories
Auth: ADMIN

Request:
{
"name": "string",
"parentId": "uuid | null"
}

Response:
201 Created

---

## Get Categories

GET /categories

Response:
200 OK
[
{
"id": "uuid",
"name": "string"
}
]

---

# 6. Products

## Create Product

POST /products
Auth: VENDOR

Request:
{
"name": "string",
"description": "string",
"categoryId": "uuid",
"variants": [
{
"variantName": "Size M",
"price": 1200,
"stockQuantity": 10,
"sku": "SKU123"
}
]
}

Response:
201 Created

---

## Get All Products

GET /products

Query Params:

* categoryId
* minPrice
* maxPrice
* page
* limit

Response:
200 OK
{
"data": [],
"pagination": {
"page": 1,
"limit": 10,
"total": 100
}
}

---

## Get Product By ID

GET /products/:id

Response:
200 OK
{
"id": "uuid",
"name": "string",
"variants": []
}

---

# 7. Orders

## Create Order

POST /orders
Auth: CUSTOMER

Request:
{
"items": [
{
"productId": "uuid",
"variantId": "uuid",
"quantity": 2
}
]
}

Response:
201 Created
{
"orderId": "uuid",
"totalAmount": 2400,
"status": "PENDING"
}

---

## Get My Orders

GET /orders
Auth: CUSTOMER

Response:
200 OK
[
{
"id": "uuid",
"status": "PENDING",
"totalAmount": 2400
}
]

---

## Update Order Status

PATCH /orders/:id/status
Auth: VENDOR or ADMIN

Request:
{
"status": "SHIPPED"
}

Response:
200 OK

---

# 8. Reviews

## Add Review

POST /products/:id/reviews
Auth: CUSTOMER

Request:
{
"rating": 4,
"comment": "Good quality"
}

Response:
201 Created

Rules:

* One review per user per product
* Vendor cannot review own product

---

## Get Product Reviews

GET /products/:id/reviews

Response:
200 OK
[
{
"userName": "string",
"rating": 4,
"comment": "Good quality"
}
]

---

# 9. Error Format

All errors follow this structure:

{
"message": "Error message",
"statusCode": 400
}

---

# 10. API Change Rule

If any of the following changes:

* Request body shape
* Response shape
* Status codes
* Authentication rules

Then:

* Update this file
* Update OpenAPI specification

Code explains implementation.
This document defines contract.
