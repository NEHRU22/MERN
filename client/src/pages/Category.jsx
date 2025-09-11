import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/Category.css";
export default function Category() {
  const { topic } = useParams();
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    // Example data
    setArticles([
      { title: `Top ${topic} News`, description: "This is a news article about " + topic }
    ]);
  }, [topic]);

  return (
    <div className="category-container">
      <h2>{topic.toUpperCase()} News</h2>
      {articles.map((art, i) => (
        <div key={i} className="category-card">
          <h3>{art.title}</h3>
          <p>{art.description}</p>
        </div>
      ))}
    </div>
  );
}
