import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // 1. STATE: This is where React "remembers" the news data
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  // 2. FETCH FUNCTION: Talking to your Node server
  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/news');
      setNews(response.data);
    } catch (error) {
      console.error("Error fetching data from backend:", error);
    }
    setLoading(false);
  };

  // 3. EFFECT: Run the fetch automatically when the page first opens
  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="container">
      <header>
        <h1>CONSPIRE</h1>
        <button onClick={fetchNews} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh Feed"}
        </button>
      </header>

      <main className="columns-container">
        {/* LEFT COLUMN: 4chan / Unconfirmed */}
        <section className="column unconfirmed">
          <h2>⚠️ Unconfirmed (Social Media)</h2>
          {news.filter(item => item.status === 'unconfirmed').map(item => (
            <div key={item._id} className="news-card">
              <h3>{item.title || "Anonymous Post"}</h3>
              <p>{item.content?.substring(0, 150)}...</p>
              <span className="source-tag">{item.source}</span>
            </div>
          ))}
        </section>

        {/* RIGHT COLUMN: NewsAPI / Confirmed */}
        <section className="column confirmed">
          <h2>✅ Confirmed (Trusted Sources)</h2>
          {news.filter(item => item.status === 'confirmed').map(item => (
            <div key={item._id} className="news-card">
              <h3>{item.title}</h3>
              <p>{item.source}</p>
              <a href={item.url} target="_blank" rel="noreferrer">Read Official Report</a>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;
