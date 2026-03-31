@@ -1,16 +1,282 @@

# React + Vite

Fullstack Web-Based E-Commerce System: TeaHerbShop
━━━━━━━━━━━━━━━━━━━━

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

# Project Description

Currently, two official plugins are available:
This project is a fullstack web-based e-commerce platform designed specifically for selling premium teas and herbal products.

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)
  The system provides a visual and intuitive storefront that enables users to browse products, manage their shopping carts, and checkout efficiently. Behind the scenes, it features a robust Admin Control Panel that allows store owners to manage inventory, track revenue statistics visually, process orders, and manage customer accounts in a structured manner.

## React Compiler

The primary goal of this project is to simulate a real-world e-commerce business model similar to modern shopping platforms, while demonstrating fullstack development capabilities using JavaScript technologies and relational databases.

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

# Project Objectives

## Expanding the ESLint configuration

Develop a fullstack web application using modern JavaScript technologies
Implement secure authentication and authorization mechanisms
Provide dynamic shopping cart and checkout features integrated with local administrative APIs
Design an intuitive Admin Dashboard with real-time statistical charts
Apply RESTful API, MVC architecture, and Service-Layer design pattern

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Technologies Used

**Frontend**
React.js
TypeScript
tailwind css
Context API
Recharts (Data Visualization)

**Backend**
Node.js
Express.js

**Database**
MySQL

**Authentication & Security**
bcrypt / bcryptjs
jsonwebtoken (JWT)

**Backend Utilities**
cors
dotenv
multer (for image uploads)

**Database Libraries**
mysql2

**Development Tools**
nodemon
MySQL Workbench / XAMPP

# System Architecture

The system follows a Client–Server architecture:
The frontend (React) handles UI, global state (Cart/User), and user interactions
The backend (Node.js + Express) processes business logic and secure routing
MySQL stores application data (Users, Products, Orders)
Communication is handled via RESTful APIs with Axios interceptors

# Features

**Authentication**
User registration and login
Secure password hashing using bcryptjs
JWT-based authentication
Token interception via Axios

**Shopping Cart System**
Add, remove, and update item quantities
Real-time total calculation
Local storage synchronization
Empty state handling

**Order & Checkout Management**
Multi-step checkout with integrated Vietnam Open API for addresses
Create and track orders
View detailed personal order history
Status badging (Pending, Processing, Delivered, Cancelled)

**Admin Control Panel (Dashboard)**
Visual revenue and order statistics using AreaCharts
Top-selling products tracking

**Product & Inventory Management**
Create, update, and delete products with image upload
Manage stock levels with dynamic progress bars and low-stock alerts
Toggle product visibility (Active/Hidden)

**User Management**
View customer list
Ban/Unban user accounts
Permanently delete users

**Authorization**
Role-based permissions (Admin vs User)
Protected routes in both Frontend (React Router) and Backend (Express Middleware)

**Planned Features (Future Development)**
Online payment gateway integration (VNPay/MoMo)
Product reviews and ratings
Email notifications for order status

**User Roles**
**Guest**
Access public store, view products, and manage local cart
**Registered User**
Place orders, view order history, update profile and password
**Admin (Store Owner)**
Full access to the Control Panel, manage inventory, users, and orders

# Installation & Setup

1. Navigate to backend
   cd backend

2. Install dependencies
   npm install

3. Environment variables
   Create a .env file in the backend folder:
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=123456
   DB_NAME=teaherbshop_db
   JWT_SECRET=chuoi_ky_tu_bi_mat_rat_dai_va_phuc_tap_teaherbshop_2026!@#

4. MySQL Database Setup
   Make sure MySQL (via XAMPP or Workbench) is installed and running. Execute the following SQL script:

```sql
CREATE DATABASE IF NOT EXISTS teaherbshop_db;
USE teaherbshop_db;

CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Role ENUM('user', 'admin') DEFAULT 'user',
    FullName VARCHAR(100),
    Phone VARCHAR(20),
    Address TEXT,
    Status ENUM('active', 'banned') DEFAULT 'active',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Products (
    ProductID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Type ENUM('tea', 'herb') DEFAULT 'tea',
    Description TEXT,
    Price DECIMAL(10,2) NOT NULL,
    Stock INT DEFAULT 0,
    ImageURL VARCHAR(255),
    Status ENUM('active', 'hidden') DEFAULT 'active',
    TotalSold INT DEFAULT 0,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Orders (
    OrderID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    TotalAmount DECIMAL(10,2) NOT NULL,
    Status ENUM('Chờ xác nhận', 'Đang xử lý', 'Đã giao', 'Đã hủy') DEFAULT 'Chờ xác nhận',
    ShippingAddress TEXT NOT NULL,
    ReceiverPhone VARCHAR(20) NOT NULL,
    PaymentMethod VARCHAR(50) DEFAULT 'COD',
    OrderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE TABLE OrderDetails (
    OrderDetailID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID) ON DELETE CASCADE,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE
);

-- Insert Default Admin
INSERT INTO Users (Username, Password, Role, FullName, Status)
VALUES ('admin', '$2a$10$YourHashedPasswordHere', 'admin', 'System Administrator', 'active');

Run backend
npm run dev
Backend: http://localhost:3000

Frontend Setup

Navigate to frontend
cd frontend

Install dependencies
npm install

Run frontend
npm run dev
Frontend: http://localhost:5173

Running the Project
Start MySQL Database (XAMPP/MySQL Service)
Run backend server
Run frontend
Open http://localhost:5173

Project Structure
project-root/
│
├── frontend/      # React.js frontend
├── backend/       # Node.js backend
└── README.md

Project Purpose
This project was developed to demonstrate:
Fullstack development skills using the MERN/PERN stack equivalent (React + Node + MySQL)
System design, MVC architecture, and Service Layer pattern
Real-world e-commerce application structure
It also serves as a portfolio project for future development.

Future Improvements
Online Payment Gateway (VNPay)
Real-time notifications
Advanced product filtering and search
UI/UX enhancements for mobile views

API Overview
The system provides a set of RESTful APIs to handle authentication, user management, product catalog, and order processing.

Authentication APIs
| Endpoint | Method | Description |
|---|---|---|
| /api/auth/register | POST | Register a new user |
| /api/auth/login | POST | Authenticate user and return JWT |

User & Profile APIs
| Endpoint | Method | Description |
|---|---|---|
| /api/users/profile | GET | Get current user profile |
| /api/users/profile | PUT | Update user profile |
| /api/users/change-password | PUT | Change user password |

Product APIs
| Endpoint | Method | Description |
|---|---|---|
| /api/products | GET | Get all active products |
| /api/products/:id | GET | Get specific product details |

Order APIs (Customer)
| Endpoint | Method | Description |
|---|---|---|
| /api/orders | POST | Create a new order (Checkout) |
| /api/orders/me | GET | Get current user's order history |
| /api/orders/me/:id | GET | Get details of a specific order |

Admin APIs (Requires Admin JWT)
| Endpoint | Method | Description |
|---|---|---|
| /api/admin/dashboard | GET | Get revenue, order, and user statistics |
| /api/admin/products | GET | Get all products (including hidden) |
| /api/admin/products | POST | Create a new product (with image upload) |
| /api/admin/products/:id | PUT | Update product details |
| /api/admin/products/:id/stock| PUT | Update inventory stock levels |
| /api/admin/products/:id/status| PUT | Toggle product visibility |
| /api/admin/products/:id | DELETE| Delete a product |
| /api/admin/orders | GET | Get all system orders |
| /api/admin/orders/:id | GET | Get detailed order info for admin |
| /api/admin/orders/:id/status | PUT | Update order status (Approve, Ship, Cancel) |
| /api/admin/users | GET | Get all registered users |
| /api/admin/users/:id/status | PUT | Ban or unban a user |
| /api/admin/users/:id | DELETE| Permanently delete a user |

Authorization
All protected endpoints require a valid JWT token in the request header:
Authorization: Bearer <token>

Team MembersNoFull
[Nguyễn Hoàng Nam]Database / Backend
[Võ Trần Minh Đạt]Frontend / UI-UX
NotesEnsure MySQL is running before starting backendEnvironment variables must be configured correctlyEnsure the uploads folder exists in the backend for image processingReferencesReact.js DocumentationNode.js & Express.js DocumentationMySQL DocumentationJWT Authentication GuideOpen API VN (Provinces API)
```
