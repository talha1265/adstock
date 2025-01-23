const fetchNews = async () => {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=5a80ecf6c29f4879bcc69cb53f9b58cb`
    );
    const data = await response.json();
    console.log(data);
    renderNews(data.articles);
  } catch (error) {
    console.error('Error fetching news:', error);
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '<p>Error fetching news. Please try again later.</p>';
  }
};

const renderNews = (articles) => {
  const newsContainer = document.getElementById('news-container');
  newsContainer.innerHTML = ''; // Clear any existing news

  articles.slice(0, 10).forEach((article) => {
    const newsCard = document.createElement('div');
    newsCard.className = 'news-card';

    const timeAgo = getTimeAgo(article.publishedAt);

    newsCard.innerHTML = `
      ${article.urlToImage ? `<img src="${article.urlToImage}" alt="${article.title}" class="news-banner">` : ''}
      <h3>${article.title}</h3>
      <p>${article.description || 'No description available'}</p>
      <p class="news-date">${timeAgo}</p>
      <a href="${article.url}" target="_blank" rel="noopener noreferrer">Read More</a>
    `;
    newsContainer.appendChild(newsCard);
  });
};

const getTimeAgo = (date) => {
  const now = new Date();
  const newsDate = new Date(date);
  const diffInMs = now - newsDate;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  return `${diffInDays} days ago`;
};

// Fetch news on page load
fetchNews();
