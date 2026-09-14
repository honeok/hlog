import { getCollection, type CollectionEntry } from "astro:content";
import { isPublished } from "@lib/publication";

type Moment = CollectionEntry<"moments">;

// 默认按发布时间倒序排列, 保证各 Moments 入口顺序一致
export const byDateDesc = (a: Moment, b: Moment) => b.data.date.valueOf() - a.data.date.valueOf();

// 返回全部公开 Moments, 分页和标签过滤由具体页面处理
export async function getPublishedMoments() {
  return (await getCollection("moments", (moment) => isPublished(moment))).sort(byDateDesc);
}
