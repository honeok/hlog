import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getPostHref, getPublishedPosts } from "@lib/posts";
import { SITE } from "../config";

export const GET: APIRoute = async (context) => {
  const posts = await getPublishedPosts();

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site!,
    customData: `<language>${SITE.lang}</language>`,
    // RSS item 映射保留在接口内, 只复用文章范围和永久链接规则
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: getPostHref(post.data.id),
    })),
  });
};
