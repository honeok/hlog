import getReadingTime from "reading-time";
import { defineMdastPlugin } from "satteri";

export default defineMdastPlugin({
  name: "reading-time",
  after(root, context) {
    const { words, minutes } = getReadingTime(context.textContent(root));

    if (context.data.astro) {
      context.data.astro.frontmatter.readingTime = { words, minutes: Math.ceil(minutes) };
    }
  },
});
