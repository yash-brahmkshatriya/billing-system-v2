export function calculateAmountOfItem(item) {
  return (item.rate * item.quantity) / item.qtyPerUnit;
}

export function calculateGrandTotal(items) {
  return items.reduce((acc, item) => acc + calculateAmountOfItem(item), 0);
}

export function getCurrentFinancialYear(dateString = null) {
  let date = dateString ? new Date(dateString) : new Date();

  let financialBeginYear =
    date.getMonth() < 3 ? date.getFullYear() - 1 : date.getFullYear();

  return { financialBeginYear, financialEndYear: financialBeginYear + 1 };
}
