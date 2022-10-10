import React, { useReducer, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { TrashFill, XSquareFill } from 'react-bootstrap-icons';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';
import { useBoolean } from '@/base/hooks';
import * as billActions from '@/redux/bill/billActions';

import Loading from '@/base/Loading/Loading';
import StandardTextarea from '@/components/shared/forms/StandardTextArea/StandardTextArea';
import StandardInput from '@/components/shared/forms/StandardInput/StandardInput';
import StandardButton from '@/components/shared/forms/StandardButton/StandardButton';
import IconButton from '@/components/shared/forms/IconButton/IconButton';

import { colors } from '@/data/colors';
import { BillValidation } from '@/validations/BillValidation';
import validationFunctions from '@/utils/validationUtils';

import './bill-form.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { BILLS } from '@/data/routeUrls';
import { removeFromObject } from '@/utils/generalUtils';
import { calculateAmountOfItem, calculateGrandTotal } from '@/utils/billUtils';

const INITIAL_ITEM = {
  description: '',
  rate: '',
  quantity: '',
  unit: 'Nos.',
  qtyPerUnit: '',
  // amount: '',
};

const INITIAL_STATE = {
  bill: {
    number: '',
    date: dayjs().format('YYYY-MM-DD'),
  },
  dc: {
    number: '',
    date: dayjs().format('YYYY-MM-DD'),
  },
  po: {
    number: '',
    date: '',
  },
  items: [INITIAL_ITEM],
  partyDetails: '',
  // discountPercentage: 0,
};

function getNewInitialItem() {
  return { ...INITIAL_ITEM, _id: nanoid(7) };
}

function getInitialState() {
  return { ...INITIAL_STATE, items: [getNewInitialItem()] };
}

function changeDateFormats(obd) {
  const oldBillDetails = JSON.parse(JSON.stringify(obd));
  if (oldBillDetails) {
    oldBillDetails.bill.date = dayjs(oldBillDetails.bill.date).format(
      'YYYY-MM-DD'
    );
    oldBillDetails.dc.date = dayjs(oldBillDetails.dc.date).format('YYYY-MM-DD');
    oldBillDetails.po.date = dayjs(oldBillDetails.po.date).format('YYYY-MM-DD');
    return oldBillDetails;
  } else return obd;
}

const FORM_ACTIONS = Object.freeze({
  PARTY_DETAILS: 'PARTY_DETAILS',
  BILL_DATE: 'BILL_DATE',
  DC_DATE: 'DC_DATE',
  BILL_DC_NUMBER: 'BILL_DC_NUMBER',
  PO_DATE: 'PO_DATE',
  PO_NUMBER: 'PO_NUMBER',
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  // DISCOUNT_PERCENTAGE: 'DISCOUNT_PERCENTAGE',
});

//TODO: Add discount percentage reducer and state
function billFormReducer(state, action) {
  let index, key, value, billNo, dcNo;
  switch (action.type) {
    case FORM_ACTIONS.PARTY_DETAILS:
      return { ...state, partyDetails: action.payload };
    case FORM_ACTIONS.BILL_DATE:
      return { ...state, bill: { number: '', date: action.payload } };
    case FORM_ACTIONS.DC_DATE:
      return {
        ...state,
        dc: { ...state.dc, date: action.payload },
      };
    case FORM_ACTIONS.BILL_DC_NUMBER:
      billNo = action.payload.billNumber;
      dcNo = action.payload.dcNumber;
      return {
        ...state,
        bill: { ...state.bill, number: billNo },
        dc: { ...state.dc, number: dcNo },
      };
    case FORM_ACTIONS.PO_DATE:
      return { ...state, po: { ...state.po, date: action.payload } };
    case FORM_ACTIONS.PO_NUMBER:
      return { ...state, po: { ...state.po, number: action.payload } };
    case FORM_ACTIONS.ADD_ITEM:
      return { ...state, items: [...state.items, getNewInitialItem()] };
    case FORM_ACTIONS.UPDATE_ITEM:
      index = action.payload.index;
      key = action.payload.key;
      value = action.payload.value;
      let updatedItems = state.items.map((item, idx) => {
        if (idx === index) {
          return { ...item, [key]: value };
        } else return item;
      });
      return { ...state, items: updatedItems };
    case FORM_ACTIONS.REMOVE_ITEM:
      index = action.payload;
      return {
        ...state,
        items: [
          ...state.items.slice(0, index),
          ...state.items.slice(index + 1),
        ],
      };

    default:
      return state;
  }
}

const BillItem = ({ billDispatch, itemState, index, showError }) => {
  return (
    <li className='bill-item'>
      <div className='d-flex justify-content-between align-items-center'>
        <div className='d-flex flex-column flex-fill'>
          <div className='bill-field'>
            <StandardTextarea
              value={itemState.description}
              onChange={(e) =>
                billDispatch({
                  type: FORM_ACTIONS.UPDATE_ITEM,
                  payload: {
                    index,
                    key: 'description',
                    value: e.target.value,
                  },
                })
              }
              showError={showError}
              rows={3}
              placeholder='e.g. Pineapple Stickers'
              name={`itemDescription-${itemState._id}`}
              inputId={`itemDescription-${itemState._id}`}
              label='Description'
              validations={validations.items.description}
            />
          </div>
          <div className='row'>
            <div className='col-6 col-lg-3'>
              <div className='bill-field'>
                <StandardInput
                  placeholder='e.g. 5000'
                  showError={showError}
                  value={itemState.quantity}
                  onChange={(e) =>
                    billDispatch({
                      type: FORM_ACTIONS.UPDATE_ITEM,
                      payload: {
                        index,
                        key: 'quantity',
                        value: e.target.value,
                      },
                    })
                  }
                  type='number'
                  name={`itemQty-${itemState._id}`}
                  inputId={`itemQty-${itemState._id}`}
                  label='Quantity'
                  validations={validations.items.quantity}
                />
              </div>
            </div>
            <div className='col-6 col-lg-3'>
              <div className='bill-field'>
                <StandardInput
                  placeholder='e.g. kg'
                  showError={showError}
                  value={itemState.unit}
                  onChange={(e) =>
                    billDispatch({
                      type: FORM_ACTIONS.UPDATE_ITEM,
                      payload: {
                        index,
                        key: 'unit',
                        value: e.target.value,
                      },
                    })
                  }
                  name={`itemUnit-${itemState._id}`}
                  inputId={`itemUnit-${itemState._id}`}
                  label='Unit'
                  validations={validations.items.unit}
                />
              </div>
            </div>
            <div className='col-12 col-lg-6'>
              <div className='bill-field'>
                {/* <label htmlFor={`itemRate-${itemState._id}`}>Rate</label> */}
                <div className='d-flex align-items-center'>
                  <StandardInput
                    placeholder='e.g. 2000'
                    showError={showError}
                    value={itemState.rate}
                    type='number'
                    onChange={(e) =>
                      billDispatch({
                        type: FORM_ACTIONS.UPDATE_ITEM,
                        payload: {
                          index,
                          key: 'rate',
                          value: e.target.value,
                        },
                      })
                    }
                    name={`itemRate-${itemState._id}`}
                    inputId={`itemRate-${itemState._id}`}
                    label='Rate'
                    validations={validations.items.rate}
                  />
                  <div className='mx-2'>per</div>
                  <StandardInput
                    placeholder='e.g. 1000'
                    showError={showError}
                    value={itemState.qtyPerUnit}
                    onChange={(e) =>
                      billDispatch({
                        type: FORM_ACTIONS.UPDATE_ITEM,
                        payload: {
                          index,
                          key: 'qtyPerUnit',
                          value: e.target.value,
                        },
                      })
                    }
                    type='number'
                    inputClasses='mt-4'
                    validations={validations.items.qtyPerUnit}
                  />
                  <div className='ms-2'>{itemState.unit}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <IconButton
          onClick={() =>
            billDispatch({ type: FORM_ACTIONS.REMOVE_ITEM, payload: index })
          }
          Icon={TrashFill}
          iconProps={{ color: colors.danger }}
          buttonClassName='ms-3'
        />
      </div>
    </li>
  );
};

const validations = BillValidation;

const BillForm = ({ oldBillDetails, edit, changeEditToOff }) => {
  // redux hooks
  const dispatch = useDispatch();

  // router hooks
  const params = useParams();
  const navigate = useNavigate();

  // data hooks
  const [billState, billDispatch] = useReducer(
    billFormReducer,
    edit ? changeDateFormats(oldBillDetails) : getInitialState()
  );
  const [loading, setLoading] = useBoolean(false);
  const [saveDisabled, setSaveDisabled] = useBoolean(false);
  const [showError, setShowError] = useBoolean(false);

  const getNextBillDetails = async () => {
    setLoading.on();
    try {
      setLoading.on();
      const nextBillDates = await dispatch(
        billActions.getNextBillDetails(billState.bill.date, params.billId)
      );
      billDispatch({
        type: FORM_ACTIONS.BILL_DC_NUMBER,
        payload: nextBillDates,
      });
    } catch (err) {
      console.error(err);
      setSaveDisabled.on();
    } finally {
      setLoading.off();
    }
  };

  const billFormSubmit = async () => {
    const isValid = validationFunctions.checkFormValidity(
      billState,
      validations
    );
    if (!isValid) {
      setShowError.on();
      return;
    }
    try {
      setSaveDisabled.on();
      if (edit) {
        const billId = params.billId;
        await dispatch(billActions.editBill(billId, billState));
        changeEditToOff();
      } else {
        await dispatch(billActions.addBill(billState));
        navigate(BILLS);
      }
    } catch (er) {
    } finally {
      setSaveDisabled.off();
    }
  };

  useEffect(() => {
    getNextBillDetails();
  }, [billState.bill.date]);

  if (loading) return <Loading />;
  return (
    <div className='bill-form'>
      <div className='d-flex align-items-center justify-content-between bill-card primary mb-3'>
        <h2 className='sub-heading m-0'>{edit ? 'Edit Bill' : 'Add Bill'}</h2>
        <IconButton
          Icon={XSquareFill}
          onClick={() => (edit ? changeEditToOff() : navigate(-1))}
          iconProps={{ className: 'icon-cta' }}
          buttonProps={{ title: 'Cancel' }}
        />
      </div>
      <div className='bill-field bill-card mb-3'>
        <StandardTextarea
          value={billState.partyDetails}
          name='companyDetails'
          rows={3}
          onChange={(e) =>
            billDispatch({
              type: FORM_ACTIONS.PARTY_DETAILS,
              payload: e.target.value,
            })
          }
          showError={showError}
          placeholder='Party Name and Address'
          validations={validations.partyDetails}
          label='Company Details'
          inputId='companyDetails'
        />
      </div>
      <div className='bill-card mb-3'>
        <div className='row'>
          <div className='col-12 col-md-4 bill-field'>
            <div className='row'>
              <div className='col'>
                <StandardInput
                  disabled
                  name='billNumber'
                  inputId='billNumber'
                  label='Bill No.'
                  value={billState.bill.number}
                  onChange={() => null}
                />
              </div>
              <div className='col'>
                <StandardInput
                  type='date'
                  name='billDate'
                  inputId='billDate'
                  label='Bill Date'
                  value={billState.bill.date}
                  onChange={(e) =>
                    billDispatch({
                      type: FORM_ACTIONS.BILL_DATE,
                      payload:
                        e.target.value === ''
                          ? dayjs().format('YYYY-MM-DD')
                          : e.target.value,
                    })
                  }
                  showError={showError}
                  validations={validations.bill.number}
                />
              </div>
            </div>
          </div>
          <div className='col-12 col-md-4 bill-field'>
            <div className='row'>
              <div className='col'>
                <StandardInput
                  disabled
                  name='dcNumber'
                  inputId='dcNumber'
                  label='DC No.'
                  value={billState.dc.number}
                  onChange={() => null}
                />
              </div>
              <div className='col'>
                <StandardInput
                  value={billState.dc.date}
                  type='date'
                  name='dcDate'
                  inputId='dcDate'
                  label='DC Date'
                  onChange={(e) =>
                    billDispatch({
                      type: FORM_ACTIONS.DC_DATE,
                      payload: e.target.value,
                    })
                  }
                  showError={showError}
                  validations={validations.dc.date}
                />
              </div>
            </div>
          </div>
          <div className='col-12 col-md-4 bill-field'>
            <div className='row'>
              <div className='col'>
                <StandardInput
                  name='poNumber'
                  inputId='poNumber'
                  label='PO No.'
                  value={billState.po.number}
                  onChange={(e) =>
                    billDispatch({
                      type: FORM_ACTIONS.PO_NUMBER,
                      payload: e.target.value,
                    })
                  }
                  showError={showError}
                  validations={validations.po.number}
                />
              </div>
              <div className='col'>
                <StandardInput
                  value={billState.po.date}
                  type='date'
                  name='poDate'
                  inputId='poDate'
                  label='PO Date'
                  onChange={(e) =>
                    billDispatch({
                      type: FORM_ACTIONS.PO_DATE,
                      payload: e.target.value,
                    })
                  }
                  showError={showError}
                  validations={validations.po.date}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='bill-card mb-3'>
        <h4 className='sub-heading mt-2'>Items</h4>
        <ul className='bill-items'>
          {billState.items.map((item, index) => (
            <BillItem
              billDispatch={billDispatch}
              itemState={item}
              index={index}
              showError={showError}
              key={item._id}
            />
          ))}
        </ul>
      </div>
      <div className='d-flex justify-content-between align-items-center bill-card primary mb-3'>
        <h6 className='fw-bold m-0'>{billState.items.length} Item (s)</h6>
        <h6 className='fw-bold m-0'>
          Grand Total: {calculateGrandTotal(billState.items).toFixed(1)}
        </h6>
      </div>
      <div className='d-flex align-items-center'>
        <StandardButton
          color='btn-outline-primary'
          text='Add Item'
          className='me-3'
          onClick={() => billDispatch({ type: FORM_ACTIONS.ADD_ITEM })}
          disabled={saveDisabled}
        />
        <StandardButton
          color='btn-primary'
          text='Save'
          onClick={billFormSubmit}
          disabled={saveDisabled}
        />
      </div>
    </div>
  );
};

export default BillForm;
