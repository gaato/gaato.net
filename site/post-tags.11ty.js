export default class PostTags {
  data() {
    return {
      pagination: {
        data: "collections.postTags",
        size: 1,
        alias: "tag",
      },
      permalink: ({ tag }) => `/${tag.lang}/posts/tags/${tag.slug}/`,
      layout: "layouts/list.njk",
      eleventyComputed: {
        lang: ({ tag }) => tag.lang,
        title: ({ tag }) => tag.label,
        description: ({ tag }) => `Posts tagged ${tag.label}.`,
        emptyMessage: () => "",
        posts: ({ tag }) => tag.items,
        alternates: () => [],
      },
    };
  }

  render() {
    return "";
  }
}
