import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";
import * as cheerio from "cheerio";
import { parse as parseYaml } from "yaml";

const site = {
  title: "gaato.net",
  description: "がーとの個人サイトとメモ置き場",
  origin: "https://gaato.net",
  author: "gaato",
};

const contentDir = "content";
const rawDir = ".astra-dist";
const distDir = "dist";

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed with ${result.status}`);
  }
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function parseFrontmatter(source, file) {
  if (!source.startsWith("---\n")) return {};
  const end = source.indexOf("\n---", 4);
  if (end === -1) return {};
  try {
    const data = parseYaml(source.slice(4, end));
    if (!data || typeof data !== "object" || Array.isArray(data)) return {};
    return data;
  } catch (error) {
    throw new Error(`invalid frontmatter in ${file}: ${error.message}`);
  }
}

function urlFromDoc(file) {
  const rel = relative(contentDir, file).replace(/\\/g, "/").replace(/\.mdx?$/, "");
  if (rel === "index") return "/";
  if (rel.endsWith("/index")) return `/${rel.slice(0, -"/index".length)}/`;
  return `/${rel}/`;
}

function outputPathFromUrl(url) {
  if (url === "/") return join(distDir, "index.html");
  return join(distDir, url.replace(/^\/|\/$/g, ""), "index.html");
}

function rawPathFromUrl(url) {
  if (url === "/") return join(rawDir, "index.html");
  return join(rawDir, url.replace(/^\/|\/$/g, ""), "index.html");
}

function extractContent(url) {
  const rawPath = rawPathFromUrl(url);
  const html = readFileSync(rawPath, "utf8");
  const $ = cheerio.load(html);
  const content = $(".post-content.markdown-body").first().html()
    ?? $(".doc-content.markdown-body").first().html()
    ?? $(".main-content[data-pagefind-body]").first().html()
    ?? $(".home-content[data-pagefind-body]").first().html()
    ?? $("main").first().html()
    ?? "";
  const trimmed = content.trim();
  if (!trimmed) {
    throw new Error(`no content extracted from ${rawPath} for ${url}; Astra markup may have changed`);
  }
  return trimmed;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;");
}

function formatDate(date) {
  if (!date) return "";
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Tokyo",
  }).format(new Date(`${date}T00:00:00+09:00`));
}

function absoluteUrl(path) {
  return new URL(path, site.origin).toString();
}

function nav(currentUrl) {
  const items = [
    ["/posts/", "Posts"],
    ["/tags/", "Tags"],
    ["/links/", "Links"],
  ];
  const links = items.map(([href, label]) => {
    const current = currentUrl === href || (href !== "/" && currentUrl.startsWith(href));
    return `<a href="${href}"${current ? " aria-current=\"page\"" : ""}>${label}</a>`;
  }).join("");
  return `<header class="site-header">
  <a class="brand" href="/" aria-label="gaato.net home">gaato.net</a>
  <nav class="site-nav" aria-label="Primary">${links}</nav>
</header>`;
}

function metaHtml(page) {
  const title = page.url === "/" ? site.title : `${page.title} | ${site.title}`;
  const description = page.description || site.description;
  return `<meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="theme-color" content="#f5f4ef" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#151618" media="(prefers-color-scheme: dark)">
  <link rel="canonical" href="${absoluteUrl(page.url)}">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="alternate" type="application/rss+xml" title="gaato.net" href="/feed.xml">
  <meta property="og:type" content="${page.kind === "post" ? "article" : "website"}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${absoluteUrl(page.url)}">
  <meta property="og:site_name" content="${site.title}">
  <meta name="twitter:card" content="summary">
  <link rel="stylesheet" href="/assets/site.css">${page.url === "/" ? "\n  <script type=\"module\" src=\"/islands/gaato-automaton.js\"></script>" : ""}`;
}

function taxonomyLinks(page) {
  const tags = Array.isArray(page.tags) ? page.tags : [];
  const tagLinks = tags.map((tag) => `<a href="/tags/${encodeURIComponent(tag)}/">${escapeHtml(tag)}</a>`).join("");
  if (!tagLinks) return "";
  return `<div class="taxonomy">${tagLinks}</div>`;
}

function postCard(post, headingLevel = 3) {
  const headingTag = `h${headingLevel}`;
  return `<article class="post-card">
    <a href="${post.url}">
      <span class="post-card-date">${formatDate(post.date)}</span>
      <${headingTag}>${escapeHtml(post.title)}</${headingTag}>
      <p>${escapeHtml(post.description)}</p>
    </a>
    ${taxonomyLinks(post)}
  </article>`;
}

function basePage(page, body, extraClass = "") {
  return `<!doctype html>
<html lang="ja">
<head>
  ${metaHtml(page)}
</head>
<body>
  ${nav(page.url)}
  <main class="site-main ${extraClass}" data-pagefind-body>
    ${body}
  </main>
  <footer class="site-footer">
    <p>© がーと / gaato</p>
    <p><a href="/feed.xml">RSS</a> <a href="/sitemap.xml">Sitemap</a> <a href="https://github.com/gaato/gaato.net">Source</a></p>
  </footer>
</body>
</html>
`;
}

function renderArticle(page, content) {
  const date = page.date ? `<time datetime="${page.date}">${formatDate(page.date)}</time>` : "";
  const meta = date ? `<div class="article-meta">${date}</div>` : "";
  const header = `<article class="article-shell">
    <header class="article-header">
      ${meta}
      <h1>${escapeHtml(page.title)}</h1>
      ${page.description ? `<p>${escapeHtml(page.description)}</p>` : ""}
      ${taxonomyLinks(page)}
    </header>
    <div class="prose">${content}</div>
  </article>`;
  return basePage(page, header, "article-page");
}

function renderHome(page, content, posts) {
  const latest = posts.slice(0, 5).map((post) => postCard(post, 3)).join("");
  const automaton = (content.match(/<gaato-automaton[\s\S]*?<\/gaato-automaton>/)?.[0] ?? "")
    .replace(/\s+luna:[a-z-]+="[^"]*"/g, "");
  const intro = content.replace(/<gaato-automaton[\s\S]*?<\/gaato-automaton>/, "").trim();
  const body = `<section class="hero">
    <div>
      <h1>がーと / gaato</h1>
      <div class="hero-copy">${intro}</div>
    </div>
    ${automaton}
  </section>
  <section class="section-block" aria-labelledby="latest-posts">
    <div class="section-heading">
      <h2 id="latest-posts">Latest posts</h2>
      <a href="/posts/">All posts</a>
    </div>
    <div class="post-list">${latest}</div>
  </section>
  <section class="standards-badges" aria-label="Internet.nl scores">
    <a href="https://internet.nl/"><img src="/assets/internetnl-website-test-100.svg" width="204" height="38" alt="Internet.nl 100% score in website test"></a>
    <a href="https://internet.nl/"><img src="/assets/internetnl-email-test-100.svg" width="204" height="39" alt="Internet.nl 100% score in email test"></a>
  </section>`;
  return basePage(page, body, "home-page");
}

function renderListing(page, content, posts, title = page.title) {
  const body = `<section class="listing-header">
    <h1>${escapeHtml(title)}</h1>
    ${page.description ? `<p>${escapeHtml(page.description)}</p>` : ""}
    ${content ? `<div class="prose intro">${content}</div>` : ""}
  </section>
  <section class="post-list">${posts.map((post) => postCard(post, 2)).join("")}</section>`;
  return basePage(page, body, "listing-page");
}

function renderTaxonomyIndex(page, content, groups, basePath) {
  const links = [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, posts]) => `<li><a href="${basePath}${encodeURIComponent(name)}/"><span>${escapeHtml(name)}</span><small>${posts.length}</small></a></li>`)
    .join("");
  const body = `<section class="listing-header">
    <h1>${escapeHtml(page.title)}</h1>
    ${page.description ? `<p>${escapeHtml(page.description)}</p>` : ""}
    ${content ? `<div class="prose intro">${content}</div>` : ""}
  </section>
  <ul class="taxonomy-index">${links}</ul>`;
  return basePage(page, body, "listing-page");
}

function writePage(path, html) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, html);
}

function buildSitemap(pages) {
  const urls = pages
    .map((page) => `  <url><loc>${absoluteUrl(page.url)}</loc></url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function buildFeed(posts) {
  const items = posts.slice(0, 20).map((post) => `<item>
      <title>${escapeHtml(post.title)}</title>
      <link>${absoluteUrl(post.url)}</link>
      <guid>${absoluteUrl(post.url)}</guid>
      <pubDate>${new Date(`${post.date}T00:00:00+09:00`).toUTCString()}</pubDate>
      <description>${escapeHtml(post.description)}</description>
    </item>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${site.title}</title>
    <link>${site.origin}/</link>
    <description>${site.description}</description>
    <language>ja</language>
    <atom:link href="${site.origin}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
}

function copyPublic() {
  if (!existsSync("public")) return;
  mkdirSync(distDir, { recursive: true });
  cpSync("public", distDir, { recursive: true });
}

function copyIfExists(from, to) {
  if (!existsSync(from)) return;
  mkdirSync(dirname(to), { recursive: true });
  cpSync(from, to, { recursive: true });
}

function isFuturePost(page) {
  if (page.kind !== "post" || !page.date) return false;
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return page.date > today;
}

rmSync(rawDir, { recursive: true, force: true });
rmSync(distDir, { recursive: true, force: true });
run("bunx", ["astra", "build", "--mode", "ssg"]);

copyPublic();
mkdirSync(join(distDir, "assets"), { recursive: true });
cpSync("site.css", join(distDir, "assets", "site.css"));
copyIfExists(join(rawDir, "islands"), join(distDir, "islands"));
copyIfExists(
  join("_build", "wasm-gc", "release", "build", "background", "background.wasm"),
  join(distDir, "assets", "background.wasm"),
);

const pages = walk(contentDir)
  .filter((file) => /\.mdx?$/.test(file))
  .map((file) => {
    const source = readFileSync(file, "utf8");
    const frontmatter = parseFrontmatter(source, file);
    const url = urlFromDoc(file);
    return {
      file,
      url,
      kind: url.startsWith("/posts/") && url !== "/posts/" ? "post" : "page",
      title: frontmatter.title || "Untitled",
      description: frontmatter.description || "",
      date: frontmatter.date || "",
      author: frontmatter.author || site.author,
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
      layout: frontmatter.layout || "doc",
      draft: frontmatter.draft === true,
      content: extractContent(url),
    };
  })
  .filter((page) => !page.draft && !isFuturePost(page));

const posts = pages
  .filter((page) => page.kind === "post" && page.date)
  .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, "ja"));

const tags = new Map();
for (const post of posts) {
  for (const tag of post.tags) {
    tags.set(tag, [...(tags.get(tag) || []), post]);
  }
}

const generatedPages = [];
for (const page of pages) {
  let html;
  if (page.url === "/") {
    html = renderHome(page, page.content, posts);
  } else if (page.url === "/posts/") {
    html = renderListing(page, page.content, posts);
  } else if (page.url === "/tags/") {
    html = renderTaxonomyIndex(page, page.content, tags, "/tags/");
  } else if (page.kind === "post") {
    html = renderArticle(page, page.content);
  } else {
    html = renderArticle(page, page.content);
  }
  writePage(outputPathFromUrl(page.url), html);
  generatedPages.push(page);
}

for (const [tag, tagPosts] of tags) {
  const page = {
    url: `/tags/${encodeURIComponent(tag)}/`,
    title: `Tag: ${tag}`,
    description: `${tag} tagged posts`,
    kind: "page",
  };
  writePage(outputPathFromUrl(page.url), renderListing(page, "", tagPosts, `#${tag}`));
  generatedPages.push(page);
}

const notFoundPage = {
  url: "/404.html",
  title: "ページが見つかりません",
  description: "指定されたページは存在しないか、移動しました。",
  kind: "page",
};
writeFileSync(
  join(distDir, "404.html"),
  basePage(notFoundPage, `<section class="listing-header">
    <h1>404</h1>
    <p>ページが見つかりません。URLが変わったか、最初からないかのどちらかです。</p>
    <p><a href="/">トップへ戻る</a> / <a href="/posts/">記事一覧</a></p>
  </section>`, "listing-page"),
);

writeFileSync(join(distDir, "sitemap.xml"), buildSitemap(generatedPages));
writeFileSync(join(distDir, "feed.xml"), buildFeed(posts));

const totalHtml = walk(distDir).filter((file) => file.endsWith(".html")).length;
console.log(`gaato.net build: ${totalHtml} HTML pages, ${posts.length} posts`);
