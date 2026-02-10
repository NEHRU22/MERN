import { useState } from "react";
import "../styles/Search.css";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");

  const handleSearch = async () => {
    setMessage("");
    if (!query.trim()) {
      setMessage("Please enter a category to search");
      setResults([]);
      return;
    }

    try {
      const res = await fetch(`/api/realtime-news?category=${query}`);  // FIXED: Use existing news route
      if (!res.ok) {
        const errData = await res.json();
        setMessage(errData.message || "Search failed");
        setResults([]);
        return;
      }
      const data = await res.json();
      if (data.articles?.length === 0) setMessage("No results found for this category");
      setResults(data.articles || []);  // NewsAPI returns 'articles'
    } catch (err) {
      console.error("Search error:", err);
      setMessage("Search error. Please try again.");
      setResults([]);
    }
  };

  return (
    <div className="search-container">
      <h3>Search by Category</h3>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Type category keyword (e.g. tech, sports)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <p style={{ color: "red" }}>{message}</p>
      <div className="results-grid">
        {results.map((article, index) => (
          <div key={index} className="search-card">
            <h3>{article.title}</h3>
            <p>{article.description}</p>
            {article.urlToImage && <img src={article.urlToImage} alt={article.title} />}
            <p><i>Category: {query}</i></p>
          </div>
        ))}
      </div>
    </div>
  );
}
