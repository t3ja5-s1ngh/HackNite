const axios = require('axios');
const db = require('../models/data');

const scrapeReddit = async (keyword) => {
  const encodedKeyword = encodeURIComponent(keyword);
  const url = `https://www.reddit.com/r/worldnews/search.json?q=${encodedKeyword}&restrict_sr=on&sort=relevance&t=day&limit=8`;

  try {
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Conspire' }
    });

    const posts = response.data.data.children;
    let count = 0;

    for (let post of posts) {
      const newsItem = {
        title: post.data.title || "Reddit",
        content: post.data.selftext,
        url: post.data.url_overridden_by_dest || post.data.url,
        source: 'Reddit',
        keyword: keyword,
	filter: "media"
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

    return count;
  } catch (error) {
    console.error("Reddit scraping failed:", error.response?.status || error.message);
    return 0;
  }
};

module.exports = { scrapeReddit };
