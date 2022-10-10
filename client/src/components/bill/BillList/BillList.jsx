import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PlusSquareFill } from 'react-bootstrap-icons';

import * as billActions from '@/redux/bill/billActions';
import BillCard from './BillCard/BillCard';

import IconButton from '@/components/shared/forms/IconButton/IconButton';
import { NEW_BILL } from '@/data/routeUrls';
import './bill-list.scss';
import Pagination from '@/components/shared/Pagination/Pagination';
import { useBoolean } from '@/base/hooks';
import Loading from '@/base/Loading/Loading';

const BillList = () => {
  const dispatch = useDispatch();
  const billList = useSelector((state) => state.bills.billList);
  const billMeta = useSelector((state) => state.bills.meta);

  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useBoolean(true);

  const getBills = async () => {
    const query = {
      page,
    };
    setLoading.on();
    await dispatch(billActions.getBills(query));
    setLoading.off();
  };

  useEffect(() => {
    getBills();
  }, [page]);

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
      {loading ? (
        <Loading />
      ) : (
        <>
          <ul className='bill-list'>
            {billList.map((bill) => (
              <BillCard bill={bill} key={bill._id} />
            ))}
          </ul>
          <div className='d-flex justify-content-end mb-2'>
            <Pagination
              page={page}
              setPage={setPage}
              pageSize={billMeta?.recordPerPage}
              totalCount={billMeta?.totalRecords}
              totalPages={billMeta?.totalPages}
            />
          </div>
        </>
      )}
    </>
  );
};

export default BillList;
