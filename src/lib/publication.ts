type PublishableEntry = {
  data: {
    date: Date
    draft: boolean
  }
}

export function isPublished(entry: PublishableEntry, now = new Date()) {
  return !entry.data.draft && entry.data.date.valueOf() <= now.valueOf()
}
