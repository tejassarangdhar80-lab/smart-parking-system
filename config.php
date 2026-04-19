<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');  // Change if different
define('DB_PASS', '');      // Change if different
define('DB_NAME', 'parking_db');

// Create connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Start session
session_start();
?><?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');  // Change if different
define('DB_PASS', '');      // Change if different
define('DB_NAME', 'parking_db');

// Create connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Start session
session_start();
?>