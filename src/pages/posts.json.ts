import type { APIRoute } from "astro";
import { getPostHref, getPublishedPosts } from "@lib/posts";

export const GET: APIRoute = async () => {
  // JSON 字段映射保留在接口内, 文章范围和链接规则统一复用共享定义
  const posts = (await getPublishedPosts()).map(({ data }) => ({
    id: data.id,
    title: data.title,
    description: data.description,
    date: data.date.toISOString(),
    updated: data.updated?.toISOString() ?? null,
    tags: data.tags,
    href: getPostHref(data.id),
  }));

  const data = {
    generatedAt: new Date().toISOString(),
    total: posts.length,
    posts,
  };

  return new Response(JSON.stringify(data, null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
};
