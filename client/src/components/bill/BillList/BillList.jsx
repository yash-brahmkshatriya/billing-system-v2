import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const BillList = () => {
  const dispatch = useDispatch();
  const billList = useSelector((state) => state.bills.billList);

  useEffect(() => {}, []);

  return <div>BillList</div>;
};

export default BillList;
