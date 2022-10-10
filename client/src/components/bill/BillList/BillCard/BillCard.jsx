import React from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import {
  BoxArrowUpRight,
  ChevronExpand,
  ChevronContract,
} from 'react-bootstrap-icons';

import { useToggle } from '@/base/hooks';
import { calculateAmountOfItem, calculateGrandTotal } from '@/utils/billUtils';

import IconButton from '@/components/shared/forms/IconButton/IconButton';
import { SINGLE_BILL } from '@/data/routeUrls';
import './bill-card.scss';

const BillItem = ({ item }) => (
  <div className='d-flex bill-items-item'>
    <div className='description flex-fill'>{item.description}</div>
    <div className='amount'>{calculateAmountOfItem(item).toFixed(1)}</div>
  </div>
);

const BillCard = ({ bill }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useToggle(false);
  return (
    <li
      key={bill._id}
      className={classNames('bill-item-card', { expanded: expanded })}
    >
      <div className='item-header'>
        <div className='bill-number-square'>{bill.bill.number}</div>
        <div className='d-flex justify-content-between align-items-center'>
          <div className='party-details flex-fill'>{bill.partyDetails}</div>
          <div className='d-flex flex-column align-items-end'>
            <div className='fst-italic'>
              {dayjs(bill.bill.date).format('DD MMM, YYYY')}
            </div>
            <div className='fw-bold'>
              Grand Total = {calculateGrandTotal(bill.items).toFixed(1)}
            </div>
          </div>
          <div className='d-flex flex-column justify-content-around align-items-center ms-3'>
            <IconButton
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(SINGLE_BILL.replace(':billId', bill._id));
              }}
              Icon={BoxArrowUpRight}
              buttonClassName='mb-2'
              iconProps={{ className: 'bill-card-cta' }}
              buttonProps={{ title: 'Go to Bill' }}
            />
            <IconButton
              onClick={(e) => {
                setExpanded.toggle();
              }}
              Icon={expanded ? ChevronContract : ChevronExpand}
              iconProps={{
                fontSize: '22px',
                className: 'bill-card-cta',
              }}
              buttonProps={{ title: expanded ? 'Collapse' : 'Expand' }}
            />
          </div>
        </div>
      </div>
      <div className='item-body'>
        <hr />
        <div className='bill-items'>
          {bill.items.map((item) => (
            <BillItem item={item} key={item._id} />
          ))}
        </div>
      </div>
    </li>
  );
};

export default BillCard;
