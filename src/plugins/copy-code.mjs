import { defineHastPlugin } from "satteri";

const COPY_ICON_PATHS = [
  "M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5" +
    "a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z",
  "M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25" +
    "Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z",
];

const hasClass = (node, className) => {
  const classes = node.properties?.className ?? node.properties?.class;

  if (Array.isArray(classes)) return classes.includes(className);
  if (typeof classes === "string") return classes.split(/\s+/).includes(className);

  return false;
};

const createCopyButton = () => ({
  type: "element",
  tagName: "button",
  properties: {
    type: "button",
    ariaLabel: "Copy code",
    dataCodeCopy: "",
    dataCopyState: "idle",
  },
  children: [
    {
      type: "element",
      tagName: "svg",
      properties: {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        width: 14,
        height: 14,
        fill: "currentColor",
        ariaHidden: "true",
      },
      children: COPY_ICON_PATHS.map((d) => ({
        type: "element",
        tagName: "path",
        properties: { d },
        children: [],
      })),
    },
  ],
});

export default defineHastPlugin({
  name: "code-block",
  element: {
    filter: ["pre"],
    visit(node) {
      if (!hasClass(node, "astro-code")) return;

      return {
        type: "element",
        tagName: "div",
        properties: { className: ["code-block"] },
        children: [createCopyButton(), node],
      };
    },
  },
});
