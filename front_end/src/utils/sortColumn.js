export const sortColumn = (originalItems, itemOrderIds, key) => {
  if (!originalItems || !itemOrderIds || !key) return [];
  const orderMap = new Map(itemOrderIds.map((item, index) => [item, index]));
  return [...originalItems].sort((a, b) => {
    return orderMap.get(a[key] || 0) - orderMap.get(b[key] || 0);
  });
};
