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

export function getCurrentFinancialYearDates(dateString = null) {
  let date = dateString ? new Date(dateString) : new Date();

  let financialBeginYear =
    date.getMonth() < 3 ? date.getFullYear() - 1 : date.getFullYear();

  let financialYearStartDate = new Date(`04/01/${financialBeginYear} 00:00:00`);
  let financialYearEndDate = new Date(
    `03/31/${financialBeginYear + 1} 23:59:59`
  );

  return { start: financialYearStartDate, end: financialYearEndDate };
}

export function getPrevFinancialYearDates(dateString = null) {
  let finYear = getCurrentFinancialYearDates(dateString);
  finYear.start.setFullYear(finYear.start.getFullYear() - 1);
  finYear.end.setFullYear(finYear.end.getFullYear() - 1);
  return finYear;
}

export function getNextFinancialYearDates(dateString = null) {
  let finYear = getCurrentFinancialYearDates(dateString);
  finYear.start.setFullYear(finYear.start.getFullYear() + 1);
  finYear.end.setFullYear(finYear.end.getFullYear() + 1);
  return finYear;
}
