import queryString from 'query-string';
import billSlice from './billSlice';
import BILL_URLS from './billUrls';
import { errorNoti, successNoti } from '@/base/Notification/Notification';
import { getErrorMessage, pickFromObject } from '@/utils/generalUtils';
import instance from '../apiCalls';

const { actions } = billSlice;

export const getBills = (filters) => (dispatch) => {
  let url = BILL_URLS.GET_BILLS + '?' + queryString.stringify(filters);
  return instance
    .get(url)
    .then((res) =>
      dispatch(
        actions.setBillList({ bills: res.data.data, meta: res.data.meta })
      )
    )
    .catch((err) => errorNoti(getErrorMessage(err)));
};
export const getSpecificBill = (billId) => (dispatch) => {
  let url = BILL_URLS.SPECIFIC_BILL.replace('{billId}', billId);
  return instance
    .get(url)
    .then((res) => dispatch(actions.setSingleBill({ bill: res.data.data })))
    .catch((err) => {
      if (err?.response?.status !== 404) {
        errorNoti(getErrorMessage(err));
      }
      throw err;
    });
};

export const getNextBillDetails = (date, billId) => (dispatch) => {
  let url = BILL_URLS.NEXT_BILL_DETAILS;
  let filters = { date };
  if (billId) filters.billId = billId;
  if (date) {
    url = url + '?' + queryString.stringify(filters);
  }
  return instance
    .get(url)
    .then((res) => res.data.data)
    .catch((err) => {
      errorNoti(getErrorMessage(err));
      throw err;
    });
};

export const addBill = (data) => (dispatch) => {
  return instance
    .post(BILL_URLS.ADD_BILL, data)
    .then((res) => {
      successNoti('Bill Added');
    })
    .catch((err) => {
      errorNoti(getErrorMessage(err));
      throw err;
    });
};

export const editBill = (billId, data) => (dispatch) => {
  let url = BILL_URLS.EDIT_BILL.replace('{billId}', billId);
  return instance
    .put(url, data)
    .then((res) => {
      successNoti('Bill Updated');
      dispatch(actions.setSingleBill({ bill: res.data.data }));
    })
    .catch((err) => {
      errorNoti(getErrorMessage(err));
      throw err;
    });
};

export const deleteBill = (billId) => (dispatch) => {
  let url = BILL_URLS.DELETE_BILL.replace('{billId}', billId);
  return instance
    .delete(url)
    .then((res) => {
      successNoti('Bill deleted');
    })
    .catch((err) => errorNoti(getErrorMessage(err)));
};
