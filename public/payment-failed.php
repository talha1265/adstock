<?php
session_start();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Failed</title>
</head>
<body>
    <h1>Payment Failed</h1>
    <p>Sorry, your payment could not be processed. Please try again later.</p>
    <?php
    if (isset($_SESSION['error_message'])) {
        echo "<p>Error: " . $_SESSION['error_message'] . "</p>";
    }
    ?>
</body>
</html>
