<?php
// config/Database.php

namespace Config;

use PDO;
use PDOException;

class Database {
    private static $instance = null;
    private $connection;
    
    private function __construct() {
        $host = 'localhost';
        $dbname = 'selen_restaurant';
        $username = 'root';
        $password = '';
        
        try {
            // First, connect to MySQL without specifying database
            $pdo = new PDO("mysql:host=$host;charset=utf8mb4", $username, $password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            ]);
            
            // Create database if not exists
            $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname`");
            
            // Now connect to the specific database
            $this->connection = new PDO(
                "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
                $username,
                $password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]
            );
            
            // Check if tables exist, if not, create and populate
            $this->setupDatabase();
            
        } catch (PDOException $e) {
            die("Database connection failed: " . $e->getMessage());
        }
    }
    
    private function setupDatabase() {
        // Check if all required tables exist
        $requiredTables = [
            'users', 'user_activity', 'stock_in', 'stock_out', 'stock', 'stock_category', 'stock_item_category', 'stock_item_category_group',
            'orders', 'order_items', 'order_type', 'special_order', 'payments',
            'menu', 'menu_category', 'menu_category_group', 'menu_item',
            'tables_available', 'tables_group', 'roles'
        ];
        $missingTables = [];
        
        foreach ($requiredTables as $table) {
            $result = $this->connection->query("SHOW TABLES LIKE '$table'");
            if ($result->rowCount() == 0) {
                $missingTables[] = $table;
            }
        }
        
        if (!empty($missingTables)) {
            // Some tables are missing, recreate all tables
            $this->createTables();
            $this->insertSampleData();
        } else {
            // Tables exist, check if users table is empty
            $count = $this->connection->query("SELECT COUNT(*) as count FROM users")->fetch()['count'];
            if ($count == 0) {
                $this->insertSampleData();
            }
        }
    }
    
    private function createTables() {
        $sql = "
        CREATE TABLE roles (
            role_id INT AUTO_INCREMENT PRIMARY KEY,
            role_name VARCHAR(255) NOT NULL
        );
        CREATE TABLE users (
            userid INT AUTO_INCREMENT PRIMARY KEY,
            firstname VARCHAR(255) NOT NULL,
            lastname VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            user_password VARCHAR(255) NOT NULL,
            user_role VARCHAR(255),
            user_status ENUM('active', 'inactive') DEFAULT 'active',
            user_created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            user_updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
        CREATE TABLE user_activity (
            activity_id INT AUTO_INCREMENT PRIMARY KEY,
            userid INT,
            activity_type VARCHAR(255),
            activity_desc TEXT,
            activity_created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userid) REFERENCES users(userid)
        );

        CREATE TABLE stock_category (
            stockcat_id INT AUTO_INCREMENT PRIMARY KEY,
            stockcat_name VARCHAR(255) NOT NULL,
            stockcat_status ENUM('active', 'inactive') DEFAULT 'active',
            stockcat_date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            stockcat_date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );

        CREATE TABLE stock_item_category_group (
            stock_item_cat_group_id INT AUTO_INCREMENT PRIMARY KEY,
            stock_item_cat_group_name VARCHAR(255) NOT NULL,
            stock_item_cat_group_desc TEXT,
            stock_item_cat_group_status ENUM('active', 'inactive') DEFAULT 'active',
            stock_item_cat_group_created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            stock_item_cat_group_updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );

        CREATE TABLE stock_item_category (
            stock_item_cat_id INT AUTO_INCREMENT PRIMARY KEY,
            stockcat_id INT,
            stock_item_cat_group_id INT,
            stock_item_cat_name VARCHAR(255) NOT NULL,
            stock_item_cat_desc TEXT,
            stock_item_cat_status ENUM('active', 'inactive') DEFAULT 'active',
            stock_item_cat_created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            stock_item_cat_updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (stockcat_id) REFERENCES stock_category(stockcat_id),
            FOREIGN KEY (stock_item_cat_group_id) REFERENCES stock_item_category_group(stock_item_cat_group_id)
        );

        CREATE TABLE stock (
            stock_id INT AUTO_INCREMENT PRIMARY KEY,
            stock_item_cat_id INT,
            stock_name VARCHAR(255) NOT NULL,
            stock_desc TEXT,
            stock_status ENUM('available', 'unavailable') DEFAULT 'available',
            stock_qty INT DEFAULT 0,
            stock_created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            stock_updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (stock_item_cat_id) REFERENCES stock_item_category(stock_item_cat_id)
        );

        CREATE TABLE stock_in (
            stockin_id INT AUTO_INCREMENT PRIMARY KEY,
            stock_id INT,
            stockin_qty INT NOT NULL,
            stockin_price_init DECIMAL(10,2),
            stockin_status ENUM('active', 'inactive') DEFAULT 'active',
            stock_current_qty INT,
            stockin_created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            stockin_updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            userid INT,
            FOREIGN KEY (stock_id) REFERENCES stock(stock_id),
            FOREIGN KEY (userid) REFERENCES users(userid)
        );

        CREATE TABLE stock_out (
            stockout_id INT AUTO_INCREMENT PRIMARY KEY,
            stock_id INT,
            stockout_qty INT NOT NULL,
            stockout_price_init DECIMAL(10,2),
            stockout_status ENUM('active', 'inactive') DEFAULT 'active',
            stockout_current_qty INT,
            stockout_created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            stockout_updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            userid INT,
            FOREIGN KEY (stock_id) REFERENCES stock(stock_id),
            FOREIGN KEY (userid) REFERENCES users(userid)
        );

        CREATE TABLE menu_category_group (
            menu_cat_group_id INT AUTO_INCREMENT PRIMARY KEY,
            menu_cat_group_name VARCHAR(255) NOT NULL,
            menu_cat_group_desc TEXT,
            menu_cat_created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            menu_cat_update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );

        CREATE TABLE menu_category (
            menu_cat_id INT AUTO_INCREMENT PRIMARY KEY,
            menu_cat_group_id INT,
            menu_cat_name VARCHAR(255) NOT NULL,
            menu_cat_desc TEXT,
            menu_cat_created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            menu_cat_updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (menu_cat_group_id) REFERENCES menu_category_group(menu_cat_group_id)
        );

        CREATE TABLE menu (
            menu_id INT AUTO_INCREMENT PRIMARY KEY,
            menu_cat_id INT,
            menu_name VARCHAR(255) NOT NULL,
            menu_desc TEXT,
            menu_status ENUM('available', 'unavailable') DEFAULT 'available',
            menu_price DECIMAL(10,2) NOT NULL,
            menu_created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            menu_updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );

        CREATE TABLE menu_item (
            menu_item_id INT AUTO_INCREMENT PRIMARY KEY,
            menu_id INT,
            stock_id INT,
            menu_item_name VARCHAR(255) NOT NULL,
            menu_item_desc TEXT,
            menu_item_created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            menu_item_updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (menu_id) REFERENCES `menu`(menu_id),
            FOREIGN KEY (stock_id) REFERENCES stock(stock_id)
        );


        CREATE TABLE tables_group (
            table_group_id INT AUTO_INCREMENT PRIMARY KEY,
            table_group_name VARCHAR(255) NOT NULL
        );

        CREATE TABLE tables_available (
            table_id INT AUTO_INCREMENT PRIMARY KEY,
            table_group_id INT,
            table_group_name VARCHAR(255),
            table_desc TEXT,
            userid INT,
            table_created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            table_updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (table_group_id) REFERENCES tables_group(table_group_id)
        );

        CREATE TABLE order_type (
            order_type_id INT AUTO_INCREMENT PRIMARY KEY,
            order_type_name VARCHAR(255) NOT NULL,
            order_type_status ENUM('active', 'inactive') DEFAULT 'active',
            order_type_created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            order_type_date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );

        CREATE TABLE special_order (
            special_order_id INT AUTO_INCREMENT PRIMARY KEY,
            special_order_name VARCHAR(255) NOT NULL,
            special_order_desc TEXT,
            special_order_price DECIMAL(10,2),
            special_order_status ENUM('active', 'inactive') DEFAULT 'active'
        );

        CREATE TABLE orders (
            order_id INT AUTO_INCREMENT PRIMARY KEY,
            order_code VARCHAR(255) UNIQUE NOT NULL,
            order_type_id INT,
            userid INT,
            table_id INT,
            order_status ENUM('pending', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled') DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (order_type_id) REFERENCES order_type(order_type_id),
            FOREIGN KEY (userid) REFERENCES users(userid),
            FOREIGN KEY (table_id) REFERENCES tables_available(table_id)
        );

        CREATE TABLE order_items (
            order_item_id INT AUTO_INCREMENT PRIMARY KEY,
            order_id INT,
            order_qty INT NOT NULL,
            menu_id INT,
            order_id_special_id INT,
            order_item_price DECIMAL(10,2) NOT NULL,
            order_item_created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            order_item_updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (order_id) REFERENCES orders(order_id)
        );

        CREATE TABLE payments (
            payment_id INT AUTO_INCREMENT PRIMARY KEY,
            order_id INT,
            payment_method ENUM('cash', 'card', 'mobile') DEFAULT 'cash',
            amount_paid DECIMAL(10,2) NOT NULL,
            payment_status ENUM('paid', 'partial', 'unpaid') DEFAULT 'unpaid',
            payment_txid VARCHAR(255),
            payment_txref VARCHAR(255),
            payment_created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            payment_updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (order_id) REFERENCES orders(order_id)
        );
        ";
        $this->connection->exec($sql);
    }
    
    private function insertSampleData() {
        $hashed = password_hash('123456', PASSWORD_DEFAULT);
        
        $this->connection->exec("INSERT INTO roles (role_name) VALUES ('Admin'), ('Manager'), ('Waiter'), ('Cashier')");
        
        $this->connection->exec("INSERT INTO users (firstname, lastname, email, user_password, user_role, user_status) VALUES 
        ('John', 'Doe', 'admin@mail.com', '$hashed', 'Admin', 'active'),
        ('Jane', 'Smith', 'manager@mail.com', '$hashed', 'Manager', 'active')");
        
        $this->connection->exec("INSERT INTO stock_category (stockcat_name, stockcat_status) VALUES 
        ('Vegetables', 'active'),
        ('Fruits', 'active')");
        
        $this->connection->exec("INSERT INTO stock_item_category_group (stock_item_cat_group_name, stock_item_cat_group_desc, stock_item_cat_group_status) VALUES 
        ('Fresh Items', 'Daily fresh produce', 'active'),
        ('Dairy', 'Milk and dairy products', 'active')");
        
        $this->connection->exec("INSERT INTO stock_item_category (stockcat_id, stock_item_cat_group_id, stock_item_cat_name, stock_item_cat_status) VALUES 
        (1, 1, 'Tomatoes', 'active'),
        (2, 1, 'Apples', 'active')");
        
        $this->connection->exec("INSERT INTO stock (stock_item_cat_id, stock_name, stock_qty, stock_status) VALUES 
        (1, 'Fresh Tomatoes', 50, 'available'),
        (2, 'Red Apples', 30, 'available')");
        
        $this->connection->exec("INSERT INTO menu_category_group (menu_cat_group_name, menu_cat_group_desc) VALUES 
        ('Main Course', 'Main dishes'),
        ('Beverages', 'Drinks and beverages')");
        
        $this->connection->exec("INSERT INTO menu_category (menu_cat_group_id, menu_cat_name) VALUES 
        (1, 'Lunch'),
        (2, 'Cold Drinks')");
        
        $this->connection->exec("INSERT INTO menu (menu_cat_id, menu_name, menu_price, menu_status) VALUES 
        (1, 'Chicken Rice', 3500.00, 'available'),
        (2, 'Coca Cola', 500.00, 'available')");
        
        $this->connection->exec("INSERT INTO menu_item (menu_id, stock_id, menu_item_name) VALUES 
        (1, 1, 'Rice'),
        (1, 2, 'Chicken')");
        
        $this->connection->exec("INSERT INTO tables_group (table_group_name) VALUES 
        ('VIP'),
        ('Standard')");
        
        $this->connection->exec("INSERT INTO tables_available (table_group_id, table_group_name, table_desc) VALUES 
        (1, 'VIP', 'VIP Table 1'),
        (2, 'Standard', 'Table 1')");
        
        $this->connection->exec("INSERT INTO order_type (order_type_name, order_type_status) VALUES 
        ('Dine In', 'active'),
        ('Take Away', 'active')");
        
        $this->connection->exec("INSERT INTO special_order (special_order_name, special_order_desc, special_order_price, special_order_status) VALUES 
        ('Extra Cheese', 'Add extra cheese', 200.00, 'active'),
        ('Spicy', 'Make it spicy', 100.00, 'active')");
        
        $this->connection->exec("INSERT INTO orders (order_code, order_type_id, userid, table_id, order_status) VALUES 
        ('ORD-2026-001', 1, 1, 1, 'pending'),
        ('ORD-2026-002', 2, 2, 2, 'completed')");
        
        $this->connection->exec("INSERT INTO order_items (order_id, order_qty, menu_id, order_item_price) VALUES 
        (1, 2, 1, 3500.00),
        (2, 1, 2, 500.00)");
        
        $this->connection->exec("INSERT INTO payments (order_id, payment_method, amount_paid, payment_status) VALUES 
        (2, 'cash', 500.00, 'paid'),
        (1, 'cash', 7000.00, 'paid')");
    }
    
    public static function getConnection() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance->connection;
    }
}
