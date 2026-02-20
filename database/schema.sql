-- Kodbank database schema (MySQL)
-- Run this in your Aiven MySQL (defaultdb) to create tables

CREATE TABLE KodUser (
  uid INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  email VARCHAR(100),
  password VARCHAR(255),
  phone VARCHAR(20),
  balance INT DEFAULT 100000,
  role VARCHAR(20)
);

CREATE TABLE UserToken (
  tid INT AUTO_INCREMENT PRIMARY KEY,
  token TEXT,
  uid INT,
  expiry DATETIME,
  FOREIGN KEY (uid) REFERENCES KodUser(uid)
);
