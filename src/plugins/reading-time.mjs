import { readingTime } from "reading-time-estimator";
import { defineMdastPlugin } from "satteri";

export default defineMdastPlugin({
  name: "reading-time",
  after(root, context) {
    // 解析并清理文本后统计词数
    const { words } = readingTime(context.textContent(root));

    if (context.data.astro) {
      // https://github.com/lbenie/reading-time-estimator/blob/main/lib/reading-time-estimator.ts#L108
      // 200 WPM 为默认值, 阅读分钟数使用向上取整
      context.data.astro.frontmatter.readingTime = { words, minutes: Math.ceil(words / 200) };
    }
  },
});
