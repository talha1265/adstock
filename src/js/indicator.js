const nifty50Symbols = ["AXISBANK", "BAJAJ-AUTO"];
const urlTemplate = 'https://real-time-finance-data.p.rapidapi.com/stock-overview?symbol={symbol}%3ANSE&language=en';
const options = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': '8b8dba35a2msh81a6fb2f86718b3p15474ejsn0cfc3be72820',
    'x-rapidapi-host': 'real-time-finance-data.p.rapidapi.com'
  }
};

// Function to generate moving average
function calculateMovingAverage(data, period) {
  return data.map((value, index, arr) => {
    if (index < period - 1) return null; // Not enough data for moving average
    const subset = arr.slice(index - period + 1, index + 1);
    return subset.reduce((a, b) => a + b, 0) / subset.length;
  });
}

// Function to fetch stock data
async function fetchStockData(symbol) {
  const url = urlTemplate.replace('{symbol}', symbol);

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return { symbol, data: result.data }; // Assuming 'data' contains the required stock data
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    return { symbol, data: null };
  }
}

// Function to fetch and render data for all symbols
async function fetchAllStockData() {
  const stockDataPromises = nifty50Symbols.map(symbol => fetchStockData(symbol));
  const stockData = await Promise.all(stockDataPromises);

  const stockListContainer = document.getElementById('stock-list');

  stockData.forEach(stock => {
    const stockItem = document.createElement('div');
    stockItem.classList.add('stock-item');

    if (stock.data) {
      const { price, company_market_cap, company_pe_ratio } = stock.data;

      stockItem.innerHTML = `
        <h2>${stock.symbol}</h2>
        <p>Price: ₹${price}</p>
        <p>Market Cap: ₹${company_market_cap.toLocaleString()}</p>
        <p class="data">P/E: ${company_pe_ratio}</p>
        <canvas id="${stock.symbol}-chart" width="900" height="650"></canvas>
      `;        

      // Simulated price history for demonstration
      const priceHistory = Array.from({ length: 50 }, () => Math.random() * (price * 1.1 - price * 0.9) + price * 0.9);
      const movingAvgShort = calculateMovingAverage(priceHistory, 5); // Short-term (5 days)
      const movingAvgLong = calculateMovingAverage(priceHistory, 20); // Long-term (20 days)

      // Create a chart for the stock
      const ctx = stockItem.querySelector(`#${stock.symbol}-chart`).getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: Array.from({ length: priceHistory.length }, (_, i) => i + 1),
          datasets: [
            {
              label: 'Price',
              data: priceHistory,
              borderColor: 'blue',
              fill: false
            },
            {
              label: '5-Day MA',
              data: movingAvgShort,
              borderColor: 'green',
              fill: false
            },
            {
              label: '20-Day MA',
              data: movingAvgLong,
              borderColor: 'purple',
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true },
          },
          scales: {
            x: { title: { display: true, text: 'Days' } },
            y: { title: { display: true, text: 'Price (₹)' } }
          }
        }
      });
    } else {
      stockItem.innerHTML = `
        <h2>${stock.symbol}</h2>
        <p>No data available</p>
      `;
    }
    stockListContainer.appendChild(stockItem);
  });
}

// Fetch and display data
fetchAllStockData();
