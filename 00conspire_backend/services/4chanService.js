const axios = require('axios');
const db = require('../models/data');

const scrape4chan = async (keyword) => {
	try {
		const response = await axios.get('https://a.4cdn.org/pol/catalog.json');
		const pages = response.data;
		let count = 0;

		for (let page of pages) {
			for (let thread of page.threads) {

				const title = thread.sub || "No Title";
				const body = thread.com || "";

				if (title.toLowerCase().includes(keyword.toLowerCase()) || body.toLowerCase().includes(keyword.toLowerCase())) {

					const newsItem = {
						title: title,
						content: body.replace(/<[^>]*>?/gm, ''),
						url: `https://boards.4channel.org/pol/thread/${thread.no}`,
						source: '4chan',
						keyword: keyword
					};

					try {
						await db.updateOne(
							{ url: newsItem.url },
							{ $set: newsItem },
							{ upsert: true }
						);
						count++;
					} catch (dbError) { }
				}
			}
		}
		return count;
	} catch (error) {
		console.error("4chan Scrape Error:", error);
		throw error;
	}
};

module.exports = { scrape4chan };
