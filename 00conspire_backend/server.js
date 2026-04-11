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

////////////////////////////////////////////////////////////////////
const {scrape4chan} =require('./services/4chanService');
const {scrapeNews} =require('./services/NewsService');
const {scrapeReddit} =require('./services/RedditService');
const {scrapeMastodon} =require('./services/MastodonService');

app.get('/scrape/:keyword' , async (req,res)=> {
	const keyword = req.params.keyword;
    try {

        const [chan,news,reddit,mastodon] = await Promise.all([
		scrape4chan(keyword),
		scrapeNews(keyword),
		scrapeReddit(keyword),
		scrapeMastodon(keyword)
	]);

        res.json({ 
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
