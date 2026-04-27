function sortNewestFirst(a, b) {
  return b.date - a.date;
}

function slugifyValue(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function groupPostsBy(posts, key) {
  const groups = new Map();
  for (const post of posts) {
    const values = Array.isArray(post.data[key]) ? post.data[key] : [post.data[key]];
    for (const value of values.filter(Boolean)) {
      const slug = slugifyValue(value);
      const groupKey = `${post.data.lang}:${slug}`;
      if (!groups.has(groupKey)) {
        groups.set(groupKey, {
          label: value,
          lang: post.data.lang,
          slug,
          items: [],
        });
      }
      groups.get(groupKey).items.push(post);
    }
  }
  return [...groups.values()].map((group) => ({
    ...group,
    items: group.items.toSorted(sortNewestFirst),
  }));
}

export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ public: "." });
  eleventyConfig.addPassthroughCopy({ "site/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "styles.css": "styles.css" });

  eleventyConfig.addFilter("absoluteUrl", (url) => new URL(url, "https://gaato.net").href);
  eleventyConfig.addFilter("htmlDate", (date) => date.toISOString().slice(0, 10));
  eleventyConfig.addFilter("readableDate", (date, lang = "ja") =>
    new Intl.DateTimeFormat(lang, { dateStyle: "medium" }).format(date),
  );
  eleventyConfig.addFilter("slug", slugifyValue);
  eleventyConfig.addFilter("postsByLang", (posts, lang) =>
    posts.filter((post) => post.data.lang === lang),
  );

  eleventyConfig.addCollection("posts", (collectionApi) =>
    collectionApi.getFilteredByGlob("site/*/posts/**/*.md").toSorted(sortNewestFirst),
  );

  eleventyConfig.addCollection("postCategories", (collectionApi) =>
    groupPostsBy(
      collectionApi.getFilteredByGlob("site/*/posts/**/*.md"),
      "category",
    ).sort((a, b) => a.lang.localeCompare(b.lang) || a.slug.localeCompare(b.slug)),
  );

  eleventyConfig.addCollection("postTags", (collectionApi) =>
    groupPostsBy(
      collectionApi.getFilteredByGlob("site/*/posts/**/*.md"),
      "tags",
    ).sort((a, b) => a.lang.localeCompare(b.lang) || a.slug.localeCompare(b.slug)),
  );
}

export const config = {
  dir: {
    input: "site",
    includes: "_includes",
    data: "_data",
    output: "dist",
  },
  htmlTemplateEngine: "njk",
  markdownTemplateEngine: "njk",
  templateFormats: ["html", "md", "njk", "11ty.js"],
};
