<?php
include 'config.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] != 'user') {
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['user_id'];

// Handle booking
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['spot_id'])) {
    $spot_id = $_POST['spot_id'];
    
    // Check if spot is available
    $stmt = $conn->prepare("SELECT status FROM parking_spots WHERE id = ?");
    $stmt->bind_param("i", $spot_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $spot = $result->fetch_assoc();
    
    if ($spot['status'] == 'available') {
        // Book the spot
        $conn->begin_transaction();
        try {
            $stmt = $conn->prepare("UPDATE parking_spots SET status = 'occupied' WHERE id = ?");
            $stmt->bind_param("i", $spot_id);
            $stmt->execute();
            
            $stmt = $conn->prepare("INSERT INTO bookings (user_id, spot_id) VALUES (?, ?)");
            $stmt->bind_param("ii", $user_id, $spot_id);
            $stmt->execute();
            
            $conn->commit();
            $message = "Spot booked successfully!";
        } catch (Exception $e) {
            $conn->rollback();
            $message = "Booking failed.";
        }
    } else {
        $message = "Spot is not available.";
    }
}

// Get available spots
$spots = $conn->query("SELECT * FROM parking_spots WHERE status = 'available'");

// Get user's bookings
$bookings = $conn->query("SELECT b.id, p.spot_number, b.start_time, b.status FROM bookings b JOIN parking_spots p ON b.spot_id = p.id WHERE b.user_id = $user_id");
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Dashboard - Smart Parking</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <header>
        <h1>User Dashboard</h1>
        <nav>
            <a href="logout.php">Logout</a>
        </nav>
    </header>
    <main>
        <h2>Available Parking Spots</h2>
        <?php if (isset($message)): ?>
            <p class="message"><?php echo $message; ?></p>
        <?php endif; ?>
        <div class="spots">
            <?php while ($spot = $spots->fetch_assoc()): ?>
                <div class="spot available">
                    <h3>Spot <?php echo $spot['spot_number']; ?></h3>
                    <form method="POST" action="">
                        <input type="hidden" name="spot_id" value="<?php echo $spot['id']; ?>">
                        <button type="submit">Book Now</button>
                    </form>
                </div>
            <?php endwhile; ?>
        </div>
        
        <h2>Your Bookings</h2>
        <table>
            <tr>
                <th>Spot</th>
                <th>Start Time</th>
                <th>Status</th>
            </tr>
            <?php while ($booking = $bookings->fetch_assoc()): ?>
                <tr>
                    <td><?php echo $booking['spot_number']; ?></td>
                    <td><?php echo $booking['start_time']; ?></td>
                    <td><?php echo $booking['status']; ?></td>
                </tr>
            <?php endwhile; ?>
        </table>
    </main>
    <footer>
        <p>&copy; 2023 Smart Parking System</p>
    </footer>
    <script src="js/script.js"></script>
</body>
</html>