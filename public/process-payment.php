<?php
require 'vendor/autoload.php'; // Include the Stripe PHP library (composer autoload)

session_start();

// Set your Stripe secret key
\Stripe\Stripe::setApiKey('YOUR_STRIPE_SECRET_KEY'); // Replace with your secret key

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Retrieve the token ID from the submitted form
    $token = $_POST['stripeToken'];

    try {
        // Create a charge: this will charge the user's card
        $charge = \Stripe\PaymentIntent::create([
            'amount' => 5000, // Amount in cents (e.g., 5000 cents = $50)
            'currency' => 'usd', // Your currency
            'payment_method' => $token,
            'confirmation_method' => 'manual',
            'confirm' => true,
        ]);

        // Payment successful
        if ($charge->status == 'succeeded') {
            // Set session variable to indicate payment success
            $_SESSION['payment_success'] = true;
            header("Location: paid-page.php");
            exit();
        } else {
            throw new Exception("Payment failed. Please try again.");
        }

    } catch (Exception $e) {
        // Handle errors (e.g., payment failure)
        $_SESSION['payment_success'] = false;
        $_SESSION['error_message'] = $e->getMessage();
        header("Location: payment-failed.php");
        exit();
    }
}
?>
