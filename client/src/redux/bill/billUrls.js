const BILL_URLS = {
  GET_BILLS: '/api/bills/',
  ADD_BILL: '/api/bills/',
  NEXT_BILL_DETAILS: '/api/bills/next-bill',
  SPECIFIC_BILL: '/api/bills/{billId}',
  EDIT_BILL: '/api/bills/{billId}',
  DELETE_BILL: '/api/bills/{billId}',
  GEN_BILL_PDF: '/api/bills/{billId}/generateBill',
  GEN_DC_PDF: '/api/bills/{billId}/generateDC',
};

export default BILL_URLS;
