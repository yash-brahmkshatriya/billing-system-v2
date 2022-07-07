export function calculateAmountOfItem(item) {
  return (item.rate * item.quantity) / item.qtyPerUnit;
}

export function calculateGrandTotal(items) {
  return items.reduce((acc, item) => acc + calculateAmountOfItem(item), 0);
}
