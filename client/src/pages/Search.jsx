import { useState } from "react";
import "../styles/Search.css";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    const res = await fetch(`https://newsapi.org/v2/everything?q=${query}&apiKey=${import.meta.env.VITE_NEWS_API_KEY}`);
    const data = await res.json();
    setResults(data.articles || []);
  };

  return (
    <div className="search-container">
      <h2>🔍 Search News</h2>
      <div className="search-bar">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enter topic..." />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="results-grid">
        {results.map((article, i) => (
          <div key={i} className="search-card">
            <img src={article.urlToImage || "https://via.placeholder.com/300x180"} />
            <h3>{article.title}</h3>
            <p>{article.description}</p>
            <a href={article.url} target="_blank" rel="noreferrer">
              <button>View</button>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
