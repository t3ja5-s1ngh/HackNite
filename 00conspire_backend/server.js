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

app.listen(PORT, ()=> {
	console.log(`Server started on http://localhost:${PORT}`);
});

////////////////////////////////////////////////////////////////////
const {scrape4chan} = require('./services/4chanService');
const {scrapeNews} = require('./services/NewsService');

app.get('/scrape/:keyword' , async (req,res)=> {
	const keyword = req.params.keyword;
    try {

        const [media,news] = await Promise.all([
		scrape4chan(keyword),
		scrapeNews(keyword)
	]);

        res.json({ 
            message: "Scraping complete!", 
            keyword: keyword,
            confirmed : news,
	    unconfirmed : media
        });
    } catch (error) {
        res.status(500).json({ error: "Scraping failed" });
    }
});
///////////////////////////////////////////////////////////////////
