import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { CONTENT_TIME_ZONE } from './config'

const contentTimeZoneFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
  timeZone: CONTENT_TIME_ZONE,
})

function getContentTimeZoneOffset(date: Date) {
  const parts = Object.fromEntries(
    contentTimeZoneFormatter
      .formatToParts(date)
      .filter(({ type }) => type !== 'literal')
      .map(({ type, value }) => [type, value]),
  )
  const zonedTimestamp = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  )

  return zonedTimestamp - (date.valueOf() - date.getUTCMilliseconds())
}

function contentWallTimeToDate(wallTime: Date) {
  if (Number.isNaN(wallTime.valueOf())) return wallTime

  const wallTimestamp = wallTime.valueOf()
  const firstGuess = new Date(wallTimestamp - getContentTimeZoneOffset(wallTime))

  return new Date(wallTimestamp - getContentTimeZoneOffset(firstGuess))
}

const contentDate = z.preprocess((value) => (value instanceof Date ? contentWallTimeToDate(value) : value), z.date())

const posts = defineCollection({
  loader: glob({
    pattern: '**/index.md',
    base: './src/content/posts',
  }),
  schema: z.object({
    id: z.number().int().positive(),
    title: z.string(),
    description: z.string(),
    date: contentDate,
    updated: contentDate.optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
})

const moments = defineCollection({
  loader: glob({
    pattern: '**/index.md',
    base: './src/content/moments',
  }),
  schema: z.object({
    date: contentDate,
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
})

export const collections = { posts, moments }
