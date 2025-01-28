const url = 'https://google-news13.p.rapidapi.com/business?lr=en-US';
const options = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': '8b8dba35a2msh81a6fb2f86718b3p15474ejsn0cfc3be72820',
    'x-rapidapi-host': 'google-news13.p.rapidapi.com',
  },
};

// Function to fetch and render news
const fetchAndRenderNews = async () => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();

    // Validate if the response contains the expected structure
    if (result.status === 'success' && result.items && result.items.length > 0) {
      renderNews(result.items);
    } else {
      console.error('Unexpected API response structure:', result);
      displayError('No news articles found.');
    }
  } catch (error) {
    console.error('Error fetching news:', error);
    displayError('Error fetching news. Please try again later.');
  }
};

// Function to render news items
const renderNews = (articles) => {
  const newsContainer = document.getElementById('news-container');
  if (!newsContainer) {
    console.error('No news-container element found on the page.');
    return;
  }

  newsContainer.innerHTML = ''; // Clear existing content

  articles.forEach((article) => {
    const newsCard = document.createElement('div');
    newsCard.className = 'news-card';

    const timeAgo = getTimeAgo(new Date(Number(article.timestamp))); // Convert timestamp to date

    newsCard.innerHTML = `
      ${
        article.images && article.images.length > 0
          ? `<img src="${article.images[0]}" alt="${article.title}" class="news-banner">`
          : '<img src="default-image.jpg" alt="Default Image" class="news-banner">' // Placeholder image if no image is provided
      }
      <h3>${article.title}</h3>
      <p>${article.snippet || 'No snippet available.'}</p>
      <p class="news-publisher">Published by: ${article.publisher}</p>
      <p class="news-date">${timeAgo}</p>
      <a href="${article.newsUrl}" target="_blank" rel="noopener noreferrer">Read More</a>
    `;

    newsContainer.appendChild(newsCard);
  });
};

// Function to calculate time ago
const getTimeAgo = (date) => {
  const now = new Date();
  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  return `${diffInDays} days ago`;
};

// Function to display errors
const displayError = (message) => {
  const newsContainer = document.getElementById('news-container');
  if (newsContainer) {
    newsContainer.innerHTML = `<p>${message}</p>`;
  }
};

// Fetch and render news on page load
fetchAndRenderNews();
