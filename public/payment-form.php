<!-- payment-form.php -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Form</title>
    <script src="https://js.stripe.com/v3/"></script>
</head>
<body>
    <h1>Payment Page</h1>
    <form action="process-payment.php" method="POST" id="payment-form">
        <div>
            <label for="card-element">Credit or debit card</label>
            <div id="card-element">
                <!-- A Stripe Element will be inserted here. -->
            </div>
            <!-- Used to display form errors. -->
            <div id="card-errors" role="alert"></div>
        </div>
        <button type="submit">Submit Payment</button>
    </form>

    <script>
        // Create a Stripe client
        var stripe = Stripe('YOUR_STRIPE_PUBLISHABLE_KEY'); // Replace with your publishable key
        var elements = stripe.elements();
        
        // Create an instance of the card Element
        var card = elements.create('card');
        
        // Add the card Element to the DOM
        card.mount('#card-element');

        // Handle form submission
        var form = document.getElementById('payment-form');
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            stripe.createToken(card).then(function(result) {
                if (result.error) {
                    // Inform the user if there was an error
                    var errorElement = document.getElementById('card-errors');
                    errorElement.textContent = result.error.message;
                } else {
                    // Send the token to your server
                    var tokenInput = document.createElement('input');
                    tokenInput.setAttribute('type', 'hidden');
                    tokenInput.setAttribute('name', 'stripeToken');
                    tokenInput.setAttribute('value', result.token.id);
                    form.appendChild(tokenInput);
                    form.submit();
                }
            });
        });
    </script>
</body>
</html>
