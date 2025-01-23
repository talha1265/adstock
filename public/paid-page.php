<?php
session_start();

// Ensure payment was successful before accessing this page
if (!isset($_SESSION['payment_success']) || $_SESSION['payment_success'] !== true) {
    // Redirect to payment form if no payment has been confirmed
    header("Location: payment-form.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Paid Page</title>
</head>
<body>
    <h1>Congratulations! Payment Successful</h1>
    <p>Thank you for your payment. You now have access to this page.</p>
</body>
</html>
