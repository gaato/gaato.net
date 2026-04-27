export default class Sitemap {
  data() {
    return {
      permalink: "/sitemap.xml",
      eleventyExcludeFromCollections: true,
    };
  }

  render({ collections, site }) {
    const urls = new Set(["/"]);
    for (const language of site.languages) {
      urls.add(`/${language.code}/`);
      urls.add(`/${language.code}/posts/`);
    }
    for (const post of collections.posts) {
      urls.add(post.url);
    }
    for (const category of collections.postCategories) {
      urls.add(`/${category.lang}/posts/categories/${category.slug}/`);
    }
    for (const tag of collections.postTags) {
      urls.add(`/${tag.lang}/posts/tags/${tag.slug}/`);
    }

    const entries = [...urls]
      .sort()
      .map((url) => `  <url>\n    <loc>${new URL(url, site.baseUrl).href}</loc>\n  </url>`)
      .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
  }
}
