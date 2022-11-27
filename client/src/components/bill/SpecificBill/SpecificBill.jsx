import React, { useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  PencilSquare,
  FileArrowDownFill,
  FileEarmarkArrowDownFill,
  Git as GitIcon,
} from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import queryString from 'query-string';
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
import {
  downloadFileAsBlob,
  openHtmlAsDataUri,
} from '@/utils/downloadFromServer';
import BILL_URLS from '@/redux/bill/billUrls';
import { loadingNoti } from '@/base/Notification/Notification';
import { NEW_BILL } from '@/data/routeUrls';
import { FORK_BILLID_KEY } from '@/data/enums/misc';
import StandardButton from '@/components/shared/forms/StandardButton/StandardButton';

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

const envUseStringForPDF = import.meta.env.VITE_USE_STRING_FOR_PDF;
const useHtmlStringForPDFs = !(
  envUseStringForPDF === undefined ||
  envUseStringForPDF === null ||
  envUseStringForPDF === '0' ||
  envUseStringForPDF === 'false' ||
  envUseStringForPDF === 'no'
);

const SpecificBill = () => {
  const dispatch = useDispatch();
  const singleBill = useSelector((state) => state.bills.singleBill);
  const profile = useSelector((state) => state.auth.profile);

  const navigate = useNavigate();
  const params = useParams();

  const [loading, setLoading] = useBoolean(true);
  const [billNotFound, setBillNotFound] = useBoolean(false);
  const [edit, setEdit] = useToggle(false);

  const progressToast = useRef(null);

  const downloadProgressCb = useCallback(
    (pe) => {
      const pct = Math.floor((pe.loaded / pe.total) * 100);
      if (progressToast.current) {
        if (pct === 100) {
          toast.dismiss(progressToast.current);
          progressToast.current = null;
        } else
          toast.update(progressToast.current, {
            render: `Downloading ${pct}%`,
          });
      } else progressToast.current = loadingNoti(`Downloading ${pct}%`);
    },
    [progressToast.current]
  );

  const downloadBillPDF = useCallback(() => {
    let url = BILL_URLS.GEN_BILL_PDF.replace('{billId}', params.billId);
    if (useHtmlStringForPDFs) {
      url = `${url}?asString=true`;
      openHtmlAsDataUri(url, `${profile?.firmName}_bill_${params.billId}`);
    } else {
      downloadFileAsBlob(
        url,
        null,
        `${profile?.firmName}_bill_${params.billId}`
      );
    }
  }, [params]);

  const downloadDcPDF = useCallback(() => {
    let url = BILL_URLS.GEN_DC_PDF.replace('{billId}', params.billId);
    if (useHtmlStringForPDFs) {
      url = `${url}?asString=true`;
      openHtmlAsDataUri(url, `${profile?.firmName}_dc_${params.billId}`);
    } else {
      downloadFileAsBlob(url, null, `${profile?.firmName}_dc_${params.billId}`);
    }
  }, [params]);

  const forkBill = useCallback(() => {
    const searchParams = {
      [FORK_BILLID_KEY]: params.billId,
    };
    const forkedBillUrl = `${NEW_BILL}?${queryString.stringify(searchParams)}`;
    navigate(forkedBillUrl);
  }, [params]);

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
      <div className='field-card primary mb-3'>
        <div className='row g-2'>
          <h2 className='sub-heading fw-normal m-0 col-12 col-sm-6'>
            Bill No. {singleBill.bill.number}
          </h2>
          <h2 className='sub-heading fw-normal m-0 col-12 col-sm-6 mt-2 mt-sm-0'>
            {`Financial year: ${
              getCurrentFinancialYear(singleBill.bill.date).financialBeginYear
            } - ${
              getCurrentFinancialYear(singleBill.bill.date).financialEndYear
            }`}
          </h2>
        </div>
      </div>
      <div className='field-card primary mb-3'>
        <div className='row g-3'>
          <div className='col-6 col-md-3 text-center'>
            <StandardButton
              onClick={downloadBillPDF}
              className='cta'
              iconClassName='icon'
              icon={<FileArrowDownFill />}
              text='Download Bill'
            />
          </div>
          <div className='col-6 col-md-3 text-center'>
            <StandardButton
              onClick={downloadDcPDF}
              className='cta'
              iconClassName='icon'
              icon={<FileEarmarkArrowDownFill />}
              text='Download DC'
            />
          </div>
          <div className='col-6 col-md-3 text-center'>
            <StandardButton
              onClick={forkBill}
              className='cta'
              iconClassName='icon'
              icon={<GitIcon />}
              text='Fork Bill'
            />
          </div>
          <div className='col-6 col-md-3 text-center'>
            <StandardButton
              onClick={setEdit.toggle}
              className='cta'
              iconClassName='icon'
              icon={<PencilSquare />}
              text='Edit Bill'
            />
          </div>
        </div>
      </div>
      <div className='field-card mb-3 party-details'>
        <div className='field-label'>Party Details</div>
        <div className='field-value'>{singleBill.partyDetails}</div>
      </div>
      <div className='field-card mb-3'>
        <div className='row gy-2'>
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
