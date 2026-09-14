import { getCollection, type CollectionEntry } from "astro:content";
import { isPublished } from "@lib/publication";

type Post = CollectionEntry<"posts">;

// 默认按发布日期倒序排列, 保证各文章入口顺序一致
export const byDateDesc = (a: Post, b: Post) => b.data.date.valueOf() - a.data.date.valueOf();

// 返回全部公开文章, 分页由具体页面自行处理
export async function getPublishedPosts() {
  return (await getCollection("posts", (post) => isPublished(post))).sort(byDateDesc);
}

// 统一生成文章永久链接, 避免不同入口出现 URL 规则分裂
export function getPostHref(id: number) {
  return `/${id}.html`;
}
