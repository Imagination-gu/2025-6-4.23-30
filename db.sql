CREATE DATABASE imagination;
USE imagination;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    student_id VARCHAR(20) UNIQUE,
    password VARCHAR(255)
);
