const providers = {
  bilibili: (id) => (/^BV[\w]+$/.test(id) ? `https://player.bilibili.com/player.html?bvid=${id}&page=1` : null),
  youtube: (id) => (/^[\w-]{11}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null),
};

const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escapeAttribute = (value) => value.replace(/[&<>"']/g, (character) => entities[character]);
const playerSize = ({ width, height }) =>
  /^[1-9]\d*$/.test(width) && /^[1-9]\d*$/.test(height)
    ? {
        sizedAttribute: " data-video-sized",
        style: ` style="max-inline-size:${width}px;aspect-ratio:${width}/${height}"`,
      }
    : { sizedAttribute: "", style: "" };

export default {
  name: "video",
  leafDirective(node) {
    const attributes = node.attributes ?? {};

    const { id } = attributes;
    const src = id && providers[node.name]?.(id);

    if (!src) return;

    const size = playerSize(attributes);
    const title = escapeAttribute(attributes.title ?? `${node.name} video`);

    return {
      raw: [
        `<div class="video-player" data-video-kind="embed"${size.sizedAttribute}${size.style}><iframe src="${escapeAttribute(src)}" title="${title}" loading="lazy"`,
        ` allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`,
      ].join(""),
      mdxExpressions: false,
    };
  },
};
