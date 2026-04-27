const labels = {
  ja: {
    title: "Posts",
    description: "gaato.net に置いている記事です。",
    emptyMessage: "記事はまだありません。",
  },
  en: {
    title: "Posts",
    description: "Posts on gaato.net.",
    emptyMessage: "No posts yet.",
  },
  id: {
    title: "Tulisan",
    description: "Tulisan di gaato.net.",
    emptyMessage: "Belum ada tulisan.",
  },
};

export default class PostsIndex {
  data() {
    return {
      pagination: {
        data: "site.languages",
        size: 1,
        alias: "language",
      },
      permalink: ({ language }) => `/${language.code}/posts/`,
      layout: "layouts/list.njk",
      eleventyComputed: {
        lang: ({ language }) => language.code,
        title: ({ language }) => labels[language.code].title,
        description: ({ language }) => labels[language.code].description,
        emptyMessage: ({ language }) => labels[language.code].emptyMessage,
        posts: ({ collections, language }) => collections.posts.filter((post) => post.data.lang === language.code),
        alternates: ({ site }) => site.languages.map((entry) => ({
          lang: entry.code,
          url: `/${entry.code}/posts/`,
        })),
      },
    };
  }

  render() {
    return "";
  }
}
