import { useEffect, useState, useRef, useCallback } from "react";
import "../styles/Home.css";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState("technology");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef(null);
  const apiKey = "4779fc6ddd461b6c09227f571f8eb263";

  const fetchNews = async (pageNum = 1, reset = false) => {
    setLoading(true);
    try {
      const url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=in&max=10&page=${pageNum}&token=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.articles && Array.isArray(data.articles)) {
        setArticles(prev =>
          reset ? data.articles : [...prev, ...data.articles]
        );
      } else {
        if (reset) setArticles([]);
      }
    } catch (err) {
      console.error("Error fetching news:", err); // Use error variable
      if (pageNum === 1) setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchNews(1, true);
    // eslint-disable-next-line
  }, [category]);

  useEffect(() => {
    if (page > 1) {
      fetchNews(page);
    }
    // eslint-disable-next-line
  }, [page]);

  const lastNewsRef = useCallback(
    node => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          setPage(prev => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading]
  );

  return (
    <div className="home-container">
      <h2>📰 Latest News - {category.toUpperCase()}</h2>
      <div className="category-filters">
        {[
          "general",
          "world",
          "business",
          "sports",
          "technology",
          "entertainment",
          "science",
          "health",
        ].map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
      {articles.length === 0 && !loading ? (
        <p>No news found for this category.</p>
      ) : (
        <div className="news-grid">
          {articles.map((a, i) => {
            const isLast = i === articles.length - 1;
            return (
              <div
                ref={isLast ? lastNewsRef : null}
                key={a.url + i}
                className="news-card"
              >
                <img
                  src={a.image || "https://via.placeholder.com/300x180"}
                  alt="News"
                  className="news-image"
                />
                <div className="news-content">
                  <h3>{a.title}</h3>
                  <p>{a.description || "No description available."}</p>
                  <p>
                    <small>
                      {a.publishedAt
                        ? new Date(a.publishedAt).toLocaleString()
                        : ""}
                    </small>
                  </p>
                  <a href={a.url} target="_blank" rel="noopener noreferrer">
                    <button className="view-button">View Full Article</button>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {loading && <p>Loading more news...</p>}
    </div>
  );
}
