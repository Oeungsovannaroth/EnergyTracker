export function normalizeId(item) {
  if (!item) return item;
  return {
    ...item,
    id: item.id ?? item._id,
  };
}

export function normalizeList(items) {
  const list = Array.isArray(items) ? items : items?.data;

  return (Array.isArray(list) ? list : []).map(normalizeId);
}
