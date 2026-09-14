// 网站基础信息
export const SITE = {
  url: "https://blog.honeok.com", // 网站地址 用于 canonical、RSS 和 sitemap
  lang: "zh-CN", // 页面语言
  author: "honeok", // 作者名称 用于首页标题
  title: "我不是611", // 网站名称 用于标签页和 RSS
  description: "一个无趣者的自我放逐之地", // 网站描述
  github: "https://github.com/honeok", // GitHub 主页
} as const;

// Content frontmatter 中日期时间采用的写作时区
export const CONTENT_TIME_ZONE = "Asia/Shanghai";

// 每页显示的文章数量, 仅用于文章列表分页
export const POSTS_PER_PAGE = 10;

// 每页显示的 Moments 数量
export const MOMENTS_PER_PAGE = 20;

// 备案信息 设置为 null 时不显示
export const FILING: { label: string; href: string } | null = {
  label: "萌ICP备20256611号",
  href: "https://icp.gov.moe/?keyword=20256611",
};

// 网站统计 设置为 null 时不加载
export const ANALYTICS: { src: string; websiteId: string } | null = {
  src: "https://u.honeok.com/script.js",
  websiteId: "b630bd25-ae61-4321-97bb-017bbbf1eb35",
};

// 顶部导航
export const NAV_ITEMS = [
  { href: "/", label: "首页" },
  { href: "/moments", label: "瞬间" },
  { href: "/tags", label: "标签" },
  { href: "/archives", label: "归档" },
  { href: "/about", label: "关于" },
] as const;
