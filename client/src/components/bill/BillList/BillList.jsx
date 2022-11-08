import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PlusSquareFill, FunnelFill } from 'react-bootstrap-icons';

import * as billActions from '@/redux/bill/billActions';
import BillCard from './BillCard/BillCard';

import IconButton from '@/components/shared/forms/IconButton/IconButton';
import { NEW_BILL } from '@/data/routeUrls';
import './bill-list.scss';
import Pagination from '@/components/shared/Pagination/Pagination';
import { useBoolean, useDebounce, useToggle } from '@/base/hooks';
import Loading from '@/base/Loading/Loading';
import StandardInput from '@/components/shared/forms/StandardInput/StandardInput';
import { getCurrentFinancialYearDates } from '@/utils/billUtils';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import StandardButton from '@/components/shared/forms/StandardButton/StandardButton';
import { useCallback } from 'react';

const BillList = () => {
  // redux hooks
  const dispatch = useDispatch();
  const billList = useSelector((state) => state.bills.billList);
  const billMeta = useSelector((state) => state.bills.meta);

  // router hooks
  const navigate = useNavigate();

  // data hooks
  const currentFinancialYearDates = useMemo(() => {
    const dates = getCurrentFinancialYearDates();
    return {
      start: dayjs(dates.start).format('YYYY-MM-DD'),
      end: dayjs(dates.end).format('YYYY-MM-DD'),
    };
  }, []);

  // state hooks
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useBoolean(true);
  const [showFilters, setShowFilters] = useToggle(false);

  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState(currentFinancialYearDates.start);
  const [endDate, setEndDate] = useState(currentFinancialYearDates.end);
  const debouncedSearch = useDebounce(search, 500);

  // callbacks
  const getBills = useCallback(async () => {
    const query = {
      page,
      search: debouncedSearch,
      startDate,
      endDate,
    };
    setLoading.on();
    await dispatch(billActions.getBills(query));
    setLoading.off();
  }, [page, debouncedSearch, startDate, endDate]);

  const clearFilters = useCallback(async () => {
    setStartDate(currentFinancialYearDates.start);
    setEndDate(currentFinancialYearDates.end);
    setSearch('');
  }, []);

  useEffect(() => {
    getBills();
  }, [page, debouncedSearch, startDate, endDate]);

  return (
    <>
      <div className='d-flex justify-content-between align-items-center p-3 bg-primary alt-white rounded mb-3'>
        <h2 className='sub-heading m-0'>Bills</h2>
        <div className='d-flex'>
          <IconButton
            onClick={() => setShowFilters.toggle()}
            Icon={FunnelFill}
            buttonClassName='me-3'
            iconProps={{ color: '#ffffff', fontSize: '1.25rem' }}
          />
          <IconButton
            onClick={() => navigate(NEW_BILL)}
            Icon={PlusSquareFill}
            iconProps={{ color: '#ffffff', fontSize: '1.25rem' }}
          />
        </div>
      </div>
      {showFilters ? (
        <div className='bill-filters mb-3'>
          <div className='bill-filters-container'>
            <div className='row g-3'>
              <div className='col-12 col-lg-3'>
                <StandardInput
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  label='Search'
                  placeholder='Search by anything'
                />
              </div>
              <div className='col-12 col-md-6 col-lg-3'>
                <StandardInput
                  value={startDate}
                  label='Start Date'
                  onChange={(e) => setStartDate(e.target.value)}
                  type='date'
                />
              </div>
              <div className='col-12 col-md-6 col-lg-3'>
                <StandardInput
                  value={endDate}
                  label='End Date'
                  onChange={(e) => setEndDate(e.target.value)}
                  type='date'
                />
              </div>
              <div className='col-12 col-md-12 col-lg-3'>
                <StandardButton
                  color='btn-primary'
                  text='Clear Filters'
                  onClick={clearFilters}
                  className='clear-filters-btn'
                  block={true}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {loading ? (
        <Loading />
      ) : billList.length === 0 ? (
        <div> No Bills found for the applied filters</div>
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
