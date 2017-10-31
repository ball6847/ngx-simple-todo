export function timestamp(date: Date = null) {
  if (!date) {
    date = new Date()
  }

  return date.getTime()
}

export function now() {
  return timestamp()
}
