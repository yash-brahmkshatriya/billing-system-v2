import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { PencilSquare } from 'react-bootstrap-icons';
import { useBoolean, useToggle } from '@/base/hooks';
import * as billActions from '@/redux/bill/billActions';
import Loading from '@/base/Loading/Loading';
import NotFound from '@/pages/NotFound';
import {
  calculateAmountOfItem,
  getCurrentFinancialYear,
  calculateGrandTotal,
} from '@/utils/billUtils';

import './specific-bill.scss';
import IconButton from '@/components/shared/forms/IconButton/IconButton';
import BillForm from '../BillForm/BillForm';

const BillItem = ({ item }) => (
  <li key={item._id} className='field-card item-card'>
    <div className='row'>
      <div className='col-12 col-lg-6'>
        <div className='mb-2'>
          <div className='field-label'>Description</div>
          <div className='field-value description'>{item.description}</div>
        </div>
      </div>
      <div className='col-4 col-lg-2'>
        <div className='field-label'>Quantity</div>
        <div className='field-value'>
          {item.quantity} {item.unit}
        </div>
      </div>
      <div className='col-4 col-lg-2'>
        <div className='field-label'>Rate</div>
        <div className='field-value'>
          {item.rate} per {item.qtyPerUnit} {item.unit}
        </div>
      </div>
      <div className='col-4 col-lg-2'>
        <div className='field-label'>Amount</div>
        <div className='field-value'>
          {calculateAmountOfItem(item).toFixed(1)}
        </div>
      </div>
    </div>
  </li>
);

const SpecificBill = () => {
  const dispatch = useDispatch();
  const singleBill = useSelector((state) => state.bills.singleBill);

  const navigate = useNavigate();
  const params = useParams();

  const [loading, setLoading] = useBoolean(true);
  const [billNotFound, setBillNotFound] = useBoolean(false);
  const [edit, setEdit] = useToggle(false);

  const getSpecificbill = async () => {
    try {
      await dispatch(billActions.getSpecificBill(params.billId));
    } catch (err) {
      if (err?.response?.status === 404) {
        setBillNotFound.on();
      }
    } finally {
      setLoading.off();
    }
  };

  useEffect(() => {
    getSpecificbill();
  }, []);

  if (loading) return <Loading />;
  else if (billNotFound) return <NotFound />;
  else if (!singleBill) return <h4>Some Error Occurred</h4>;
  else if (edit)
    return (
      <BillForm
        edit={true}
        oldBillDetails={singleBill}
        changeEditToOff={setEdit.off}
      />
    );
  return (
    <div className='specific-bill'>
      <div className='d-flex justify-content-between align-items-center field-card primary mb-3'>
        <h2 className='sub-heading fw-normal m-0'>
          Bill No. {singleBill.bill.number} of financial year{' '}
          {getCurrentFinancialYear(singleBill.bill.date).financialBeginYear} -
          {getCurrentFinancialYear(singleBill.bill.date).financialEndYear}
        </h2>
        <div className='d-flex align-items-center'>
          <IconButton
            onClick={setEdit.toggle}
            Icon={PencilSquare}
            iconProps={{ className: 'icon-cta' }}
          />
        </div>
      </div>
      <div className='field-card mb-3 party-details'>
        <div className='field-label'>Party Details</div>
        <div className='field-value'>{singleBill.partyDetails}</div>
      </div>
      <div className='field-card mb-3'>
        <div className='row'>
          <div className='col-12 col-md-4'>
            <div className='row'>
              <div className='col'>
                <div className='field-label'>Bill No.</div>
                <div className='field-value'>{singleBill.bill.number}</div>
              </div>
              <div className='col'>
                <div className='field-label'>Bill Date</div>
                <div className='field-value'>
                  {dayjs(singleBill.bill.date).format('DD MMM, YYYY')}
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-4'>
            <div className='row'>
              <div className='col'>
                <div className='field-label'>DC No.</div>
                <div className='field-value'>{singleBill.dc.number}</div>
              </div>
              <div className='col'>
                <div className='field-label'>DC Date</div>
                <div className='field-value'>
                  {dayjs(singleBill.dc.date).format('DD MMM, YYYY')}
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-4'>
            <div className='row'>
              <div className='col'>
                <div className='field-label'>PO No.</div>
                <div className='field-value'>{singleBill.po.number}</div>
              </div>
              <div className='col'>
                <div className='field-label'>PO Date</div>
                <div className='field-value'>
                  {dayjs(singleBill.po.date).format('DD MMM, YYYY')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='field-card mb-3'>
        <div className='field-label mb-2'>Items</div>
        <ul className='bill-items'>
          {singleBill.items.map((item) => (
            <BillItem key={item._id} item={item} />
          ))}
        </ul>
      </div>
      <div className='d-flex justify-content-between align-items-center field-card primary mb-3'>
        <h6 className='fw-bold m-0'>{singleBill.items.length} Item (s)</h6>
        <h6 className='fw-bold m-0'>
          Grand Total: {calculateGrandTotal(singleBill.items).toFixed(1)}
        </h6>
      </div>
    </div>
  );
};

export default SpecificBill;
