const fs = require("fs");
const https = require("https");

https.get("https://merupu-news.onrender.com/api/news", (res) => {
  let data = "";
  res.on("data", chunk => data += chunk);
  res.on("end", () => {
    try {
      const items = JSON.parse(data).filter(i => i.published).slice(0, 30);
      const feedItems = items.map(item => `
        <item>
          <title><![CDATA[${item.title}]]></title>
          <link>https://news.merupulu.com/api/news/${item._id}</link>
          <description><![CDATA[${item.content}]]></description>
          ${item.url ? `<enclosure url="${item.url}" type="image/jpeg" />` : ""}
          <pubDate>${new Date(item.date || Date.now()).toUTCString()}</pubDate>
        </item>
      `).join("");

      const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Merupu Short News</title>
    <link>https://news.merupulu.com</link>
    <description>Latest Telugu short news</description>
    ${feedItems}
  </channel>
</rss>`;

      fs.writeFileSync("feed.xml", rss.trim());
    } catch (e) {
      console.error("Error generating feed:", e.message);
    }
  });
});
