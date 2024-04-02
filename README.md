# ShopDeck - E-commerce Backend

ShopDeck is a backend implementation of an e-commerce platform, providing a set of RESTful APIs for managing users, products, shopping carts, orders, user profiles, and product reviews. It is built using Node.js, Express.js, and MySQL.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Endpoints](#endpoints)
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
    git clone https://github.com/pratikkhulge/ShopDeck.git
    ```

2. Navigate to the project directory:

    ```bash
    cd ShopDeck
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

## Configuration

1. Set up MySQL:
   
   - Create a MySQL database named `shopdeck`.
   - Update the MySQL connection details in `main.js` to match your MySQL server configuration.

2. Session Secret Key:
   
   - Update the `secret` value in the `express-session` middleware configuration in `index.js`.

## Usage

To start the server, run:

```bash
npm start
```

The server will start running at `http://localhost:3001`.

## Endpoints

- **POST /register**: Register a new user.
- **POST /login**: Log in an existing user.
- **POST /logout**: Log out the current user.
- **GET /protected**: Access a protected endpoint (requires authentication).
- **GET /products**: Get all products.
- **POST /products**: Add a new product.
- **PUT /products/:id**: Update a product.
- **DELETE /products/:id**: Delete a product.
- **GET /cart**: Get the shopping cart for the current user.
- **POST /cart**: Add an item to the shopping cart.
- **DELETE /cart/:itemId**: Remove an item from the shopping cart.
- **POST /checkout**: Process checkout and create an order.
- **GET /orders**: Get the orders for the current user.
- **PUT /orders/:id/cancel**: Cancel an order.
- **GET /profile**: Get the profile information for the current user.
- **PUT /profile**: Update the profile information for the current user.
- **POST /products/:productId/reviews**: Submit a review for a product.
- **GET /products/:productId/reviews**: Get reviews for a product.

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


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
