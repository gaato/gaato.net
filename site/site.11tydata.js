export default {
  eleventyComputed: {
    alternates(data) {
      if (data.alternates) {
        return data.alternates;
      }
      if (!data.translationKey || !data.collections?.posts) {
        return [];
      }
      return data.collections.posts
        .filter((post) => post.data.translationKey === data.translationKey)
        .map((post) => ({
          lang: post.data.lang,
          url: post.url,
        }));
    },
  },
};
