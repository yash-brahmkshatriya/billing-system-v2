import React from 'react';
import AppLayout from '@/base/Layout/AppLayout';
import BillList from '@/components/bill/BillList/BillList';
import { BILLS, NEW_BILL, SINGLE_BILL } from '@/data/routeUrls';
import { Route, Routes } from 'react-router-dom';
import BillForm from '@/components/bill/BillForm/BillForm';
import SpecificBill from '@/components/bill/SpecificBill/SpecificBill';

const RELATIVE_NEW_BILL = NEW_BILL.replace(BILLS, '');
const RELATIVE_SINGLE_BILL = SINGLE_BILL.replace(BILLS, '');
const Bill = () => {
  return (
    <AppLayout>
      <Routes>
        <Route index element={<BillList />} />
        <Route path={RELATIVE_NEW_BILL} element={<BillForm />} />
        <Route path={RELATIVE_SINGLE_BILL} element={<SpecificBill />} />
      </Routes>
    </AppLayout>
  );
};

export default Bill;
