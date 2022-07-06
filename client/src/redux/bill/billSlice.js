import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  billList: [],
  singleBill: null,
  meta: {},
};

const billSlice = createSlice({
  name: 'bills',
  initialState,
  reducers: {
    setBillList: (state, action) => {
      const { bills, meta } = action.payload;
      state.billList = bills;
      state.meta = meta;
    },
    setSingleBill: (state, action) => {
      const { bill } = action.payload;
      state.singleBill = bill;
    },
  },
});
export default billSlice;
