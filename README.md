# ShopDeck - E-commerce Backend

ShopDeck is a backend implementation of an e-commerce platform, providing a set of RESTful APIs for managing users, products, shopping carts, orders, user profiles, and product reviews. It is built using Node.js, Express.js, and MySQL.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Endpoints](#endpoints)
- [SQL Queries](#sql-queries)
- [License](#license)

## Features

- User authentication (registration, login, logout) with bcrypt for password hashing and JWT for session management.
- Product management (add, update, delete, get all products).
- Shopping cart management (view cart, add item, remove item).
- Checkout process (create order, save order items, calculate total amount).
- Order management (get user's orders, cancel order).
- User profile management (view profile, update profile).
- Product review submission and retrieval.

## Prerequisites

Before running this application, ensure you have the following installed:

- Node.js (https://nodejs.org)
- MySQL (https://www.mysql.com/)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/pratikkhulge/ShopDeckMain.git
    ```

2. Navigate to the project directory:

    ```bash
    cd ShopDeckMain
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

## Configuration

1. Set up MySQL:
   
   - Create a MySQL database named `shopdeck`.
   - Update the MySQL connection details in `index.js` to match your MySQL server configuration.

2. Session Secret Key:
   
   - Update the `secret` value in the `express-session` middleware configuration in `index.js`.

## Usage

To start the server, run:

```bash
npm start
```

The server will start running at `http://localhost:3001`.

## Folder Structure 

- controllers
  - authController.js
  - productController.js
  - cartController.js
  - orderController.js
  - profileController.js
  - reviewController.js

- routes
  - authRoutes.js
  - productRoutes.js
  - cartRoutes.js
  - orderRoutes.js
  - profileRoutes.js
  - reviewRoutes.js

- services
  - authService.js
  - productService.js
  - cartService.js
  - orderService.js
  - profileService.js
  - reviewService.js

- models
  - userModel.js
  - productModel.js
  - cartModel.js
  - orderModel.js
  - reviewModel.js

- test.js

- app.js (or index.js)



## Endpoints

- **POST /users/register**: Register a new user.
- **POST /users/login**: Log in an existing user.
- **POST /users/logout**: Log out the current user.
- **GET /users/protected**: Access a protected endpoint (requires authentication).
- **GET /products/all**: Get all products.
- **POST /product/add**: Add a new product.
- **PUT /products/update/:id**: Update a product.
- **DELETE /products/delete/:id**: Delete a product.
- **GET /cart/all**: Get the shopping cart for the current user.
- **POST /cart/add**: Add an item to the shopping cart.
- **DELETE /cart/delete/:itemId**: Remove an item from the shopping cart.
- **POST /checkout**: Process checkout and create an order.
- **GET /orders/all**: Get the orders for the current user.
- **PUT /orders/cancel/:id**: Cancel an order.
- **GET /profile**: Get the profile information for the current user.
- **PUT /profile/update**: Update the profile information for the current user.
- **POST /reviews/products/:productId**: Submit a review for a product.
- **GET /reviews/products/:productId**: Get reviews for a product.

## SQL Queries 
```sql
CREATE DATABASE IF NOT EXISTS shopdeck;
USE shopdeck;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    images JSON
);

CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    shipping_address JSON NOT NULL,
    billing_address JSON NOT NULL,
    payment_method VARCHAR(255) NOT NULL,
    status VARCHAR(255) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```



