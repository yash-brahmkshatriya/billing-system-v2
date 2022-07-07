import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PlusSquareFill } from 'react-bootstrap-icons';

import * as billActions from '@/redux/bill/billActions';
import BillCard from './BillCard/BillCard';

import IconButton from '@/components/shared/forms/IconButton/IconButton';
import { NEW_BILL } from '@/data/routeUrls';
import './bill-list.scss';

const BillList = () => {
  const dispatch = useDispatch();
  const billList = useSelector((state) => state.bills.billList);

  const navigate = useNavigate();

  const getBills = async () => {
    await dispatch(billActions.getBills());
  };

  useEffect(() => {
    getBills();
  }, []);

  if (billList.length === 0) return <div>No Bill</div>;
  return (
    <>
      <div className='d-flex justify-content-between align-items-center p-3 bg-primary alt-white rounded mb-3'>
        <h2 className='sub-heading m-0'>Bills</h2>
        <IconButton
          onClick={() => navigate(NEW_BILL)}
          Icon={PlusSquareFill}
          iconProps={{ color: '#ffffff', fontSize: '1.25rem' }}
        />
      </div>
      <ul className='bill-list'>
        {billList.map((bill) => (
          <BillCard bill={bill} key={bill._id} />
        ))}
      </ul>
    </>
  );
};

export default BillList;
