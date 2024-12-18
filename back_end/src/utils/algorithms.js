export const pagingSkipValue = (page, itemsPage) => {
  if (!page || !itemsPage) return 0
  if (page <= 0 || itemsPage <= 0) return 0
  return (page - 1) * itemsPage
}
