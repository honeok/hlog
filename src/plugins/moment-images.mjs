import { defineHastPlugin } from 'satteri'

const momentsDirectory = new URL('../content/moments/', import.meta.url).href

export default defineHastPlugin({
  name: 'moment-images',
  after(root, context) {
    if (!context.fileURL?.href.startsWith(momentsDirectory)) return

    const images = []
    const extractImages = (node) => {
      // 手写 HTML 图片对应 raw 节点, 将其与带链接的图片保留在原位置
      if (node.type !== 'element' || node.tagName === 'a') {
        return node
      }

      if (node.tagName === 'img') {
        images.push({
          type: 'element',
          tagName: 'div',
          properties: {},
          children: [{ ...node, properties: { ...node.properties, 'data-moment-image': '' } }],
        })
        return null
      }

      const imageCount = images.length
      const children = node.children.map(extractImages).filter(Boolean)
      if (images.length === imageCount) return node
      if (children.every((child) => child.type === 'text' && !child.value.trim())) return null

      return { ...node, children }
    }

    const children = root.children.map(extractImages).filter(Boolean)
    if (images.length === 0) return

    context.replaceNode(root, {
      type: 'root',
      children: [
        ...children,
        {
          type: 'element',
          tagName: 'div',
          properties: { 'data-moment-images': String(images.length) },
          children: images,
        },
      ],
    })
  },
})
