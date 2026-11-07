import { defineHastPlugin, hastToHtml, htmlToHast } from 'satteri'

const postsDirectory = new URL('../content/posts/', import.meta.url).href

export default ({ fileURL }) => {
  if (!fileURL?.href.startsWith(postsDirectory)) return

  let hasLocalImages = false

  return defineHastPlugin({
    name: 'post-html-images',
    raw(node, context) {
      const collectImages = (child) => {
        if (child.type === 'element' && child.tagName === 'img') {
          const src = child.properties.src

          if (typeof src === 'string' && src && !URL.canParse(src) && !src.startsWith('/')) {
            context.data.astro.localImagePaths.add(decodeURI(src))
            hasLocalImages = true
          }
        }

        if ('children' in child) child.children.forEach(collectImages)
      }

      collectImages(htmlToHast(node.value, { fragment: true }))
    },
    after(root, context) {
      if (!hasLocalImages) return

      // 区分原有 Markdown 图片, 只为 HTML 图片保存作者指定的属性
      const markMarkdownImages = (node) => ({
        ...node,
        ...('children' in node ? { children: node.children.map(markMarkdownImages) } : {}),
        ...(node.type === 'element' && node.tagName === 'img'
          ? { properties: { ...node.properties, 'data-post-markdown-image': '' } }
          : {}),
      })

      // 整体解析以保留跨 raw 节点打开和关闭的 HTML 容器
      const tree = htmlToHast(hastToHtml(markMarkdownImages(root)), { fragment: true })
      const prepareImages = (node) => {
        if (node.type === 'element' && node.tagName === 'img') {
          if ('dataPostMarkdownImage' in node.properties) {
            delete node.properties.dataPostMarkdownImage
          } else {
            const { src, ...properties } = node.properties

            if (typeof src === 'string' && src && !URL.canParse(src) && !src.startsWith('/')) {
              const attributes = Object.fromEntries(
                Object.entries(properties).map(([key, value]) => {
                  let name = key.toLowerCase()

                  if (key === 'className') name = 'class'
                  else if (key === 'htmlFor') name = 'for'
                  else if (key.startsWith('aria')) name = `aria-${key.slice(4).toLowerCase()}`
                  else if (key.startsWith('data'))
                    name = key.replace(/[A-Z]/g, (character) => `-${character.toLowerCase()}`)

                  return [name, Array.isArray(value) ? value.join(' ') : value]
                }),
              )

              node.properties = { src, postHtmlAttributes: JSON.stringify(attributes) }
            }
          }
        }

        if ('children' in node) node.children.forEach(prepareImages)
      }

      prepareImages(tree)
      context.replaceNode(root, tree)
    },
  })
}
