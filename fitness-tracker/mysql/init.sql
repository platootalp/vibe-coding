-- Create database if not exists
CREATE DATABASE IF NOT EXISTS fitnessTracker;

-- Use the database
USE fitnessTracker;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  age TINYINT UNSIGNED,
  height SMALLINT UNSIGNED,
  weight SMALLINT UNSIGNED,
  gender ENUM('male', 'female', 'other'),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create workouts table
CREATE TABLE IF NOT EXISTS workouts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  userId INT UNSIGNED NOT NULL,
  name VARCHAR(100) NOT NULL,
  type ENUM('running', 'cycling', 'swimming', 'walking', 'strength', 'yoga', 'other') NOT NULL,
  duration SMALLINT UNSIGNED NOT NULL,
  calories SMALLINT UNSIGNED NOT NULL,
  distance DECIMAL(5,2),
  steps MEDIUMINT UNSIGNED,
  date DATETIME NOT NULL,
  notes TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_workouts_userId ON workouts(userId);
CREATE INDEX idx_workouts_date ON workouts(date);