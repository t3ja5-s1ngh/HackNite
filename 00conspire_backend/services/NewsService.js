const axios = require('axios');
const db = require('../models/data');

const scrapeNews = async (keyword) => {
	try {
		const response = await axios.get('https://newsapi.org/v2/everything', {
			params: {
				q: keyword,
				apiKey: process.env.NEWS_API_KEY,
				language: 'en',
				sortBy: 'publishedAt',
				pageSize: 10
			}
		});
		const articles = response.data.articles;
		let count = 0;

		for (let article of articles) {
			const newsItem = {
                	title: article.title,
                	content: article.description || article.content,
                	url: article.url,
                	source: article.source.name,
                	keyword: keyword,
			filter: "official",
                        imageUrl: article.urlToImage
            		};
			
			try{
				await db.updateOne(
					{ url: newsItem.url },
					{ $set: newsItem },
					{ upsert: true }
				);
				count++;
			} catch (dbError) { }
		}
		return count;
	} catch (error) {
		console.error("news scrape service error", error);
		throw error;
	}
};

module.exports = { scrapeNews };

