export const formatRelativeDate = (dateStr: string): string => {
  const date    = new Date(dateStr)
  const now     = new Date()
  const diffMs  = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffH   = Math.floor(diffMin / 60)
  const diffD   = Math.floor(diffH   / 24)

  if (diffSec < 60)  return "just now"
  if (diffMin < 60)  return `${diffMin}m ago`
  if (diffH   < 24)  return `${diffH}h ago`
  if (diffD   < 7)   return `${diffD}d ago`
  if (diffD   < 365) {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export const formatFullDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  })
