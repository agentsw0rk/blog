export default function eleventyConfig(config) {
  config.addPassthroughCopy({ "src/assets": "assets" });

  config.addFilter("readableDate", (date) =>
    new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }).format(date)
  );

  config.addFilter("htmlDate", (date) => date.toISOString().slice(0, 10));

  config.addFilter("dateToRfc822", (date) => date.toUTCString());

  config.addFilter("wordCount", (content) => {
    const words = String(content)
      .replace(/<[^>]*>/g, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    return words.length;
  });

  config.addFilter("head", (items, count) => items.slice(0, count));

  config.addFilter("absoluteUrl", (url, siteUrl) => new URL(url, siteUrl).href);

  config.addCollection("posts", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/posts/*.md")
      .filter((item) => !item.data.draft)
      .sort((a, b) => b.date - a.date)
  );

  config.addCollection("tagList", (collectionApi) => {
    const tags = new Set();

    for (const item of collectionApi.getFilteredByGlob("src/posts/*.md")) {
      for (const tag of item.data.tags || []) {
        if (tag !== "post") {
          tags.add(tag);
        }
      }
    }

    return Array.from(tags).sort((a, b) => a.localeCompare(b));
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk"]
  };
}
