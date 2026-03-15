-- Store Management System Database Schema
-- Run this script after creating the database:
--   CREATE DATABASE store_management;
--   USE store_management;

CREATE DATABASE IF NOT EXISTS store_management;
USE store_management;

-- ─────────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'staff') NOT NULL DEFAULT 'staff',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────
-- CATEGORIES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────
-- SUPPLIERS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS suppliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  contact_person VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(150),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────
-- ITEMS (Inventory)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  category_id INT,
  quantity INT NOT NULL DEFAULT 0,
  unit VARCHAR(30) DEFAULT 'pcs',
  reorder_level INT NOT NULL DEFAULT 10,
  supplier_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
);

-- ─────────────────────────────────────────────
-- REQUESTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_id INT NOT NULL,
  requested_by INT NOT NULL,
  quantity INT NOT NULL,
  purpose TEXT,
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  admin_note TEXT,
  reviewed_by INT,
  reviewed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
  FOREIGN KEY (requested_by) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ─────────────────────────────────────────────
-- TRANSACTIONS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('received', 'issued') NOT NULL,
  item_id INT NOT NULL,
  quantity INT NOT NULL,
  reference_no VARCHAR(100),
  supplier_id INT,
  request_id INT,
  performed_by INT NOT NULL,
  notes TEXT,
  transaction_date DATE NOT NULL DEFAULT (CURDATE()),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
  FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE SET NULL,
  FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────
-- SEED DATA
-- ─────────────────────────────────────────────

-- Default admin user (password: Admin@123)
INSERT INTO users (name, email, password_hash, role) VALUES
('System Admin', 'admin@store.gov', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('John Staff', 'staff@store.gov', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'staff');

-- note: password hash above = 'password' via bcrypt. Real Admin@123 hash inserted below via app init.

-- Categories
INSERT INTO categories (name, description) VALUES
('Office Supplies', 'Pens, paper, notebooks, staples etc.'),
('Electronics', 'Computers, printers, cables, batteries'),
('Furniture', 'Chairs, tables, shelves, cabinets'),
('Cleaning Supplies', 'Brooms, mops, detergents, sanitizers'),
('Stationery', 'Stamps, folders, files, binders');

-- Suppliers
INSERT INTO suppliers (name, contact_person, phone, email, address) VALUES
('GovSupplies Ltd', 'Ravi Kumar', '9876543210', 'ravi@govsupplies.in', '12 Industrial Area, New Delhi'),
('OfficeWorld', 'Priya Sharma', '9123456789', 'priya@officeworld.in', '45 Market Street, Mumbai'),
('TechMart India', 'Arjun Nair', '9988776655', 'arjun@techmart.in', '78 Tech Park, Bangalore');

-- Items
INSERT INTO items (name, description, category_id, quantity, unit, reorder_level, supplier_id) VALUES
('A4 Paper Ream', '500 sheets per ream, 75 GSM', 1, 150, 'reams', 20, 2),
('Ball Point Pen (Blue)', 'Pack of 10 pens', 1, 80, 'packs', 15, 2),
('Stapler', 'Heavy duty metal stapler', 1, 25, 'pcs', 5, 2),
('Laptop - Dell', '15 inch, i5, 8GB RAM', 2, 12, 'pcs', 2, 3),
('Printer Ink Cartridge', 'HP compatible black ink', 2, 30, 'pcs', 10, 3),
('Office Chair', 'Ergonomic with armrests', 3, 40, 'pcs', 5, 1),
('Filing Cabinet', '4 drawer steel cabinet', 3, 15, 'pcs', 3, 1),
('Floor Mop', 'Microfiber mop with bucket', 4, 20, 'pcs', 5, 1),
('Hand Sanitizer 500ml', 'WHO approved formula', 4, 60, 'bottles', 20, 1),
('Ring Binder A4', '2 inch D-ring binder', 5, 100, 'pcs', 25, 2);
