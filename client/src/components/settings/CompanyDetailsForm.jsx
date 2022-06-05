import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as authActions from '@/redux/auth/authActions';
import { useNavigate } from 'react-router-dom';
import { DASHBOARD } from '@/data/routeUrls';
import { useBoolean } from '@/base/hooks';
import {
  UserInfoValidation,
  UserInfoValidationOnlyCompany,
} from '@/validations/UserInfoValidation';
import validationFunctions from '@/utils/validationUtils';
import StandardInput from '../shared/forms/StandardInput/StandardInput';
import StandardButton from '../shared/forms/StandardButton/StandardButton';
import { errorNoti } from '@/base/Notification/Notification';

const CompanyDetailsForm = ({ onlyCompanyDetails = true }) => {
  const [userInfo, setUserInfo] = useState({
    firmName: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
    },
    firstName: '',
    lastName: '',
    phone: '',
  });

  const [btnDisabled, setBtnDisabled] = useBoolean(false);
  const [showError, setShowError] = useBoolean(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.auth.profile);

  let validations = onlyCompanyDetails
    ? UserInfoValidationOnlyCompany
    : UserInfoValidation;
  const submit = async (e) => {
    e.preventDefault();
    if (!userProfile) {
      errorNoti('User Info Not Present');
    }
    let data = {
      firmName: userInfo.firmName,
      address: userInfo.address,
      ...userInfo.address,
    };
    if (!onlyCompanyDetails) {
      data.firstName = userInfo.firstName;
      data.lastName = userInfo.lastName;
    }
    if (!validationFunctions.checkFormValidity(data, validations)) {
      setShowError.on();
      return;
    }
    try {
      setBtnDisabled.on();
      const done = await dispatch(
        authActions.updateProfile(userProfile._id, data)
      );
      if (done) {
        navigate(DASHBOARD);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBtnDisabled.off();
    }
  };

  return (
    <div className='d-flex flex-column h-100 p-md-3'>
      <form onSubmit={submit}>
        <div className='text-center'>
          <img src='/assets/images/logo.png' alt='logo' className='m-auto' />
          <div className='sub-heading'>Company Details</div>
          {!onlyCompanyDetails ? (
            <div className='row'>
              <div className='col-6'>
                <StandardInput
                  value={userInfo.firstName}
                  onChange={(e) =>
                    setUserInfo((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  className='mt-3'
                  label='First Name'
                  type='text'
                  validations={validations.firstName}
                  showError={showError}
                />
              </div>
              <div className='col-6'>
                <StandardInput
                  value={userInfo.lastName}
                  onChange={(e) =>
                    setUserInfo((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  className='mt-3'
                  label='Last Name'
                  type='text'
                  validations={validations.lastName}
                  showError={showError}
                />
              </div>
            </div>
          ) : null}
          <StandardInput
            value={userInfo.firmName}
            onChange={(e) =>
              setUserInfo((prev) => ({ ...prev, firmName: e.target.value }))
            }
            label='Company Name'
            placeholder='Xyz Inc.'
            validations={validations.firmName}
            showError={showError}
          />
          <StandardInput
            value={userInfo.phone}
            onChange={(e) =>
              setUserInfo((prev) => ({ ...prev, phone: e.target.value }))
            }
            label='Phone No.'
            className='mt-3'
            validations={validations.phone}
            showError={showError}
          />
          <StandardInput
            value={userInfo.address.line1}
            onChange={(e) =>
              setUserInfo((prev) => ({
                ...prev,
                address: { ...prev.address, line1: e.target.value },
              }))
            }
            className='mt-3'
            label='Address Line 1'
            type='text'
            validations={validations.line1}
            showError={showError}
          />
          <StandardInput
            value={userInfo.address.line2}
            onChange={(e) =>
              setUserInfo((prev) => ({
                ...prev,
                address: { ...prev.address, line2: e.target.value },
              }))
            }
            className='mt-3'
            label='Address Line 2'
            type='text'
            showError={showError}
          />
          <div className='row'>
            <div className='col-4'>
              <StandardInput
                value={userInfo.address.city}
                onChange={(e) =>
                  setUserInfo((prev) => ({
                    ...prev,
                    address: { ...prev.address, city: e.target.value },
                  }))
                }
                className='mt-3'
                label='City'
                type='text'
                validations={validations.city}
                showError={showError}
              />
            </div>
            <div className='col-4'>
              <StandardInput
                value={userInfo.address.state}
                onChange={(e) =>
                  setUserInfo((prev) => ({
                    ...prev,
                    address: { ...prev.address, state: e.target.value },
                  }))
                }
                className='mt-3'
                label='State'
                type='text'
                validations={validations.state}
                showError={showError}
              />
            </div>
            <div className='col-4'>
              <StandardInput
                value={userInfo.address.pincode}
                onChange={(e) =>
                  setUserInfo((prev) => ({
                    ...prev,
                    address: { ...prev.address, pincode: e.target.value },
                  }))
                }
                className='mt-3'
                label='Pincode'
                type='text'
                validations={validations.pincode}
                showError={showError}
              />
            </div>
          </div>
        </div>

        <StandardButton
          className='mt-4'
          color='btn-primary'
          bold={true}
          block={true}
          text='Save'
          type='submit'
          disabled={btnDisabled}
        />
      </form>
    </div>
  );
};

export default CompanyDetailsForm;
