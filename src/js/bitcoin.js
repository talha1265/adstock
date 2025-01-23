

// Bitcoin Price Fetch
async function fetchBitcoinPrice() {
  const priceElement = document.getElementById('bitcoin-price');
  
  try {
    priceElement.innerText = 'price...';
    
    const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice/BTC.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    const price = parseFloat(data.bpi.USD.rate.replace(',', '')).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    priceElement.innerText = price;
  } catch (error) {
    priceElement.innerText = 'Error fetching price';
    console.error('Error fetching Bitcoin price:', error);
  }
}

// Initial fetch and set interval for updates
fetchBitcoinPrice();
setInterval(fetchBitcoinPrice, 10000);
