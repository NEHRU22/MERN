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
      const res = await fetch(`https://https://mern-backend-pf4m.onrender.com//api/search?query=${query}`);
      if (!res.ok) {
        const errData = await res.json();
        setMessage(errData.message || "Search failed");
        setResults([]);
        return;
      }
      const data = await res.json();
      if (data.results.length === 0) setMessage("No results found for this category");
      setResults(data.results);
    } catch {
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
        {results.map(({ _id, title, description, imageUrl, category }) => (
          <div key={_id} className="search-card">
            <h3>{title}</h3>
            <p>{description}</p>
            {imageUrl && <img src={imageUrl} alt={title} />}
            <p><i>Category: {category}</i></p>
          </div>
        ))}
      </div>
    </div>
  );
}
