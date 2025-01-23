<?php
require 'config.php'; // Include the config file for API keys
require 'vendor/autoload.php'; // Include the Stripe PHP library

session_start();

// Set your Stripe secret key
\Stripe\Stripe::setApiKey(STRIPE_SECRET_KEY); // Use the defined constant for the secret key

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
            header("Location: paid-page.php"); // Redirect to the protected paid page
            exit();
        } else {
            throw new Exception("Payment failed. Please try again.");
        }

    } catch (Exception $e) {
        // Handle errors (e.g., payment failure)
        $_SESSION['payment_success'] = false;
        $_SESSION['error_message'] = $e->getMessage();
        header("Location: payment-failed.php"); // Redirect to the payment failed page
        exit();
    }
}
