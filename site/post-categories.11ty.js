export default class PostCategories {
  data() {
    return {
      pagination: {
        data: "collections.postCategories",
        size: 1,
        alias: "category",
      },
      permalink: ({ category }) => `/${category.lang}/posts/categories/${category.slug}/`,
      layout: "layouts/list.njk",
      eleventyComputed: {
        lang: ({ category }) => category.lang,
        title: ({ category, site }) => site.categories[category.slug]?.[category.lang] ?? category.label,
        description: ({ category }) => `Posts in ${category.label}.`,
        emptyMessage: () => "",
        posts: ({ category }) => category.items,
        alternates: () => [],
      },
    };
  }

  render() {
    return "";
  }
}
