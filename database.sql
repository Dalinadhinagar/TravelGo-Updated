-- =======================================================
-- TravelGo Database Setup Script
-- Designed for: MySQL Workbench 8.0 / MySQL Server 8.0
-- Database Name: travelgo_db
-- =======================================================
-- INSTRUCTIONS FOR MYSQL WORKBENCH:
-- 1. Open MySQL Workbench and connect to your local MySQL instance.
-- 2. Click File -> Open SQL Script... (or Ctrl + Shift + O).
-- 3. Select this file (database.sql).
-- 4. Click the yellow lightning bolt icon (⚡) or press Ctrl + Shift + Enter to execute.
-- =======================================================

-- 1. Create Database
CREATE DATABASE IF NOT EXISTS travelgo_db;
USE travelgo_db;

-- 2. Create 'bookings' Table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    message TEXT,
    status VARCHAR(50) DEFAULT 'Confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create 'destinations' Table
CREATE TABLE IF NOT EXISTS destinations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    country VARCHAR(100) NOT NULL,
    description TEXT,
    price_starting DECIMAL(10, 2),
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Insert Popular Destinations (Sample Catalog - 6 Destinations)
INSERT INTO destinations (name, country, description, price_starting, image_url)
VALUES 
    ('Bali', 'Indonesia', 'Beautiful beaches, tropical views and relaxing resorts.', 9999.00, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80'),
    ('Paris', 'France', 'Experience art, culture and the famous Eiffel Tower.', 19999.00, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80'),
    ('Switzerland', 'Switzerland', 'Enjoy beautiful mountains, snow and peaceful scenery.', 29999.00, 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=600&q=80'),
    ('Maldives', 'Maldives', 'Relax on beautiful beaches with crystal-clear water.', 24999.00, 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80'),
    ('Japan', 'Japan', 'Discover traditional culture, food and modern cities.', 27999.00, 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=600&q=80'),
    ('Dubai', 'UAE', 'Enjoy luxury shopping, modern architecture and desert adventures.', 34999.00, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80')
ON DUPLICATE KEY UPDATE 
    description = VALUES(description),
    price_starting = VALUES(price_starting);

-- 5. Insert Sample Bookings for Initial Testing
INSERT INTO bookings (name, email, destination, message, status)
VALUES 
    ('Aarav Sharma', 'aarav.sharma@example.com', 'Bali', 'Looking for a relaxing 4-day trip for 2 guests.', 'Confirmed'),
    ('Sophia Davis', 'sophia.davis@example.com', 'Paris', 'Honeymoon vacation package inquiry.', 'Confirmed'),
    ('Rahul Verma', 'rahul.verma@example.com', 'Switzerland', 'Adventure tour and ski passes requested.', 'Pending'),
    ('Kenji Sato', 'kenji.sato@example.com', 'Japan', 'Tokyo cherry blossom tour booking.', 'Confirmed')
ON DUPLICATE KEY UPDATE id = id;

-- =======================================================
-- Quick Verification Queries (Run these in MySQL Workbench):
-- =======================================================
SELECT * FROM travelgo_db.bookings ORDER BY created_at DESC;
SELECT * FROM travelgo_db.destinations;
