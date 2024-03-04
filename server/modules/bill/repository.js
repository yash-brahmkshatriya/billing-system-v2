const Bills = require('./model');
const { checkAndThrowError } = require('../../utils/responses');
const messages = require('../../utils/messages');
const common = require('../../utils/common');
const { CONTEXT_USER_KEY } = require('../../constants');
const { pagination } = require('../../config');

const getNextBillNumbers = async (user, billDate, billId = null) => {
  try {
    // bill Date in form of iso string or mm-dd-yyyy
    if (!billDate) throw new Error('Bill Date is required');
    const financialDates = common.getCurrentFinancialYearDates(billDate);
    let bill;
    if (billId) {
      bill = await Bills.findById(billId);
    }
    if (
      bill &&
      financialDates.start <= new Date(bill.bill.date) &&
      new Date(bill.bill.date) <= financialDates.end
    ) {
      return {
        billNumber: bill.bill.number,
        dcNumber: bill.dc.number,
      };
    }

    bill = await Bills.findOne({
      owner: user._id,
      'bill.date': {
        $gte: financialDates.start,
        $lte: financialDates.end,
      },
    })
      .sort({ 'bill.number': -1 })
      .limit(1)
      .select('bill.number dc.number');
    if (bill)
      return {
        billNumber: bill.bill.number + 1,
        dcNumber: bill.dc.number + 1,
      };
    else
      return {
        billNumber: 1,
        dcNumber: 1,
      };
  } catch (e) {
    checkAndThrowError(e);
  }
};

const createBillMutationResolver = async (
  _,
  { createBillInput },
  contextValue
) => {
  try {
    common.removeFromObject(createBillInput, [
      '_id',
      '__v',
      'updatedAt',
      'createdAt',
      'id',
    ]);

    createBillInput.items = createBillInput.items.map((item) =>
      common.removeFromObject(item, ['_id'])
    );

    createBillInput.owner = contextValue[CONTEXT_USER_KEY]._id;
    const NOW = new Date();
    const dateOfBill = new Date(createBillInput?.bill?.date) || NOW;
    const dateOfDC = new Date(createBillInput?.dc?.date) || NOW;

    let nextBillNumber = await getNextBillNumbers(
      contextValue[CONTEXT_USER_KEY],
      dateOfBill.toISOString()
    );
    createBillInput.bill = {
      number: nextBillNumber.billNumber,
      date: dateOfBill,
    };
    createBillInput.dc = {
      number: nextBillNumber.dcNumber,
      date: dateOfDC,
    };
    let bill = await Bills.create(createBillInput);
    return bill.lean();
  } catch (e) {
    checkAndThrowError(e);
  }
};

const getLatestBillDetailsResolver = async (
  _,
  { queryDate, billId },
  contextValue
) => {
  try {
    let billDate = queryDate ?? new Date().toISOString();
    let bill = await getNextBillNumbers(
      contextValue[CONTEXT_USER_KEY],
      billDate,
      billId ?? null
    );
    return bill;
  } catch (e) {
    checkAndThrowError(e);
  }
};

module.exports = {
  createBillMutationResolver,
  getLatestBillDetailsResolver,
};
