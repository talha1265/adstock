const url = 'https://google-news13.p.rapidapi.com/business?lr=en-IND';
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

    // Debug the API response to check the structure
    console.log('API Response:', result);

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

  articles.forEach((article, index) => {
    const newsCard = document.createElement('div');
    newsCard.className = 'news-card';

    const timeAgo = getTimeAgo(new Date(Number(article.timestamp))); // Convert timestamp to date

    // Debugging image URL
    console.log(`Article ${index} thumbnail:`, article.images?.thumbnail);

    newsCard.innerHTML = `
      ${
        article.images && article.images.thumbnail
          ? `<img src="${article.images.thumbnail}" alt="${article.title}" class="news-banner">`
          : '<img src="default-image.jpg" alt="Default Image" class="news-banner">' // Placeholder image if no thumbnail is provided
      }
      <h3>${article.title}</h3>
      <p>${article.snippet || 'No snippet available.'}</p>
      <p class="news-publisher">Published by: ${article.publisher}</p>
      <p class="news-date">${timeAgo}</p>
      <a href="${article.newsUrl}" target="_blank" rel="noopener noreferrer">Read More</a>
    `;

    newsContainer.appendChild(newsCard);

    // Handle subnews if available
    if (article.hasSubnews && article.subnews) {
      article.subnews.forEach((subArticle, subIndex) => {
        const subNewsCard = document.createElement('div');
        subNewsCard.className = 'subnews-card';

        const subTimeAgo = getTimeAgo(new Date(Number(subArticle.timestamp)));

        // Debugging subnews image URL
        console.log(`Subnews ${index}-${subIndex} thumbnail:`, subArticle.images?.thumbnail);

        subNewsCard.innerHTML = `
          ${
            subArticle.images && subArticle.images.thumbnail
              ? `<img src="${subArticle.images.thumbnail}" alt="${subArticle.title}" class="subnews-banner">`
              : '<img src="default-subnews.jpg" alt="Default Subnews Image" class="subnews-banner">'
          }
          <h4>${subArticle.title}</h4>
          <p>${subArticle.snippet || 'No snippet available.'}</p>
          <p class="subnews-publisher">Published by: ${subArticle.publisher}</p>
          <p class="subnews-date">${subTimeAgo}</p>
          <a href="${subArticle.newsUrl}" target="_blank" rel="noopener noreferrer">Read More</a>
        `;

        newsContainer.appendChild(subNewsCard);
      });
    }
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
