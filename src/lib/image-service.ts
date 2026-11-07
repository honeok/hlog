import type { LocalImageService } from 'astro'
import sharpService from 'astro/assets/services/sharp'
import { imageMetadata } from 'astro/assets/utils'

const imageService: LocalImageService = {
  ...sharpService,
  validateOptions(options, config, logger) {
    if (typeof options.src !== 'string') {
      const format = options.src.format

      if (format === 'avif' || format === 'gif' || format === 'svg') {
        options.format = format
      } else if (['jpg', 'jpeg', 'png', 'webp'].includes(format)) {
        options.format = 'avif'
        options.quality = 60
      }
    }

    return sharpService.validateOptions?.(options, config, logger) ?? options
  },
  async transform(inputBuffer, transform, config, logger) {
    if ((transform.format === 'avif' || transform.format === 'gif') && !URL.canParse(transform.src)) {
      const metadata = await imageMetadata(inputBuffer)

      // 本地 AVIF 和 GIF 只探测格式, 保留原始字节及动画
      if (metadata.format === 'avif' || metadata.format === 'gif') {
        return { data: inputBuffer, format: metadata.format }
      }
    }

    return sharpService.transform(inputBuffer, transform, config, logger)
  },
}

export default imageService
