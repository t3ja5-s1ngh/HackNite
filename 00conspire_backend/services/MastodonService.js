const axios = require('axios');
const db = require('../models/data');

const scrapeMastodon = async (keyword) => {
  const url = `https://mastodon.social/api/v1/timelines/tag/${keyword}?limit=10`;

  try {
    const response = await axios.get(url);
    const posts = response.data;
    let count = 0;

    for (let post of posts) {
      const newsItem = {
        title: `Mastodon post by ${post.account.display_name}`,
        content: post.content.replace(/<[^>]*>/g, ''),
        url: post.url,
        source: 'Mastodon',
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
    return count;
  } catch (error) {
    console.error("Mastodon scraping failed:", error.message);
    return 0;
  }
};

module.exports = { scrapeMastodon };
