-- Rental Finder Database Schema
-- MySQL Database for Railway deployment

-- Create database
CREATE DATABASE IF NOT EXISTS rental_finder;
USE rental_finder;

-- Users table
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone_number VARCHAR(15),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Houses table
CREATE TABLE houses (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  owner_id BIGINT NOT NULL,
  type VARCHAR(10) NOT NULL,
  phone_number VARCHAR(15) NOT NULL,
  district VARCHAR(50) NOT NULL,
  city VARCHAR(50) NOT NULL,
  image_data LONGBLOB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_houses_owner ON houses(owner_id);
CREATE INDEX idx_houses_district ON houses(district);
CREATE INDEX idx_houses_city ON houses(city);
CREATE INDEX idx_houses_type ON houses(type);

-- Insert sample data (optional)
INSERT INTO users (username, email, password, phone_number) VALUES
('john_doe', 'john@example.com', '$2a$10$encrypted_password_hash', '9876543210'),
('jane_smith', 'jane@example.com', '$2a$10$encrypted_password_hash', '9876543211');

-- Sample house listings
INSERT INTO houses (owner_id, type, phone_number, district, city) VALUES
(1, '2BHK', '9876543210', 'Hyderabad', 'Hyderabad'),
(2, '1BHK', '9876543211', 'Warangal Urban', 'Warangal'); 