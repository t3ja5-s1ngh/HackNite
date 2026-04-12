const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
	.then(() => console.log("MongoDB Connected Successfully"))
    .catch(err => console.error("MongoDB Connection Error:", err));

app.get('/',(req, res)=> {
	res.send("News scrapper Api is running ...");
});

app.listen(PORT,'0.0.0.0', ()=> {
	console.log(`Server started on http://localhost:${PORT}`);
});

/////////////////////////////////////////////////////////////////////

const User = require('./models/user');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const verifyToken = require('./services/AuthService');

const scraperLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  keyGenerator: (req) => req.user.id,
  handler: (req, res) => {
    res.status(429).json({ message: "Limit reached for this user." });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || user.password !== password) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id }, "demo_secret_key_123", { expiresIn: '1h' });
  res.json({ token: `Bearer ${token}` });
});
////////////////////////////////////////////////////////////////////
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: "Username taken" });

    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ message: "User created successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
});


////////////////////////////////////////////////////////////////////
const {scrape4chan} =require('./services/4chanService');
const {scrapeNews} =require('./services/NewsService');
const {scrapeReddit} =require('./services/RedditService');
const {scrapeMastodon} =require('./services/MastodonService');

app.get('/scrape/:keyword' ,verifyToken, scraperLimiter, async (req,res)=> {
	const keyword = req.params.keyword;
    try {

        const [chan,news,reddit,mastodon] = await Promise.all([
		scrape4chan(keyword),
		scrapeNews(keyword),
		scrapeReddit(keyword),
		scrapeMastodon(keyword)
	]);

        res.json({ 
	    user : req.user.id,
            message: "Scraping complete!", 
            keyword: keyword,
            news : news,
	    chan : chan,
	    reddit : reddit,
	    mastodon : mastodon
        });
    } catch (error) {
	    console.log(error);
        res.status(500).json({ error: "Scraping failed" });
    }
});
///////////////////////////////////////////////////////////////////
const db = require('./models/data');

app.get('/collect', async (req, res) => {
    try {
        const { status, keyword } = req.query;
	    let query = {};

        if (status) query.status = status;
        if (keyword) query.keyword = new RegExp(keyword, 'i'); 

        const newsFeed = await db.find(query).sort({ scrapedAt: -1 });
        res.json(newsFeed);
    } catch (err) {
        res.status(500).json({ message: "Error fetching news" });
    }
});
//////////////////////////////////////////////////////////////////
app.delete('/api/admin/clear-database', async (req, res) => {
    try {
        await db.deleteMany({});
        res.json({ message: "Database cleared successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to clear database" });
    }
});
/////////////////////////////////////////////////////////////////
const UNSPLASH_KEY = '5ABu_RcaBcX3XKAuWpC8GiQ8BvnLXcVM_h1W9Fuv1XE';

app.get('/trending', verifyToken, async (req, res) => {
  try {
    const trendingData = await db.aggregate([
      { $group: { _id: "$keyword", count: { $sum: 1 }, latestTitle: { $first: "$title" } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const topics = await Promise.all(trendingData.map(async (item) => {
      const keyword = item._id || "news";
      
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(keyword)}&per_page=1&client_id=${UNSPLASH_KEY}`
      );
      const data = await response.json();
      
      const imageUrl = data.results[0]?.urls?.regular || "https://via.placeholder.com/1080x720?text=No+Image+Found";

      return {
        title: keyword.toUpperCase(),
        count: item.count,
        imageUrl: imageUrl
      };
    }));

    res.json({
      user: req.user.id,
      topics: topics
    });

  } catch (error) {
    console.error("Trending API Error:", error);
    res.status(500).json({ error: "Failed to fetch trending topics or images" });
  }
});
