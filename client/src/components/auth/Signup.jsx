import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useBoolean } from '@/base/hooks';
import { SignupValidation } from '@/validations/SignupValidation';

import StandardInput from '@/components/shared/forms/StandardInput/StandardInput';
import StandardButton from '@/components/shared/forms/StandardButton/StandardButton';

import * as authActions from '@/redux/auth/authActions';

import validationFunctions from '@/utils/validationUtils';
import { COMPANY_DETAILS } from '@/data/routeUrls';

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const stateEmail = useSelector((state) => state.auth.email);

  const [btnDisabled, setBtnDisabled] = useBoolean(false);
  const [showError, setShowError] = useBoolean(false);
  const [userDetails, setUserDetails] = useState({
    email: stateEmail,
    password: '',
    firstName: '',
    lastName: '',
    phoneNo: '',
  });

  const updateUserDetails = (key, value) => {
    setUserDetails((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const validations = SignupValidation;

  const submit = async (e) => {
    e.preventDefault();
    let data = { ...userDetails };
    if (!validationFunctions.checkFormValidity(data, validations)) {
      setShowError.on();
      return;
    }
    try {
      setBtnDisabled.on();
      const signupSuccess = await dispatch(authActions.signup(data));
      if (signupSuccess) {
        navigate(COMPANY_DETAILS);
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
          <div className='sub-heading'>Signup</div>
          <StandardInput
            value={userDetails.email}
            onChange={(e) => updateUserDetails('email', e.target.value)}
            label='Email'
            type='email'
            placeholder='example@mail.com'
            validations={validations.email}
            showError={showError}
          />
          {stateEmail ? (
            <div className='hint text-left'>
              Hmm, we don't recognize that email address. Let's get you signed
              up!
            </div>
          ) : null}
          <div className='row'>
            <div className='col-6'>
              <StandardInput
                value={userDetails.firstName}
                onChange={(e) => updateUserDetails('firstName', e.target.value)}
                className='mt-3'
                label='First Name'
                type='text'
                validations={validations.firstName}
                showError={showError}
              />
            </div>
            <div className='col-6'>
              <StandardInput
                value={userDetails.lastName}
                onChange={(e) => updateUserDetails('lastName', e.target.value)}
                className='mt-3'
                label='Last Name'
                type='text'
                validations={validations.lastName}
                showError={showError}
              />
            </div>
          </div>

          {/* <StandardInput
            value={phoneNo}
            onChange={(e) => setPhoneNo(e.target.value)}
            className='mt-3'
            label='Phone Number'
            type='text'
            validations={validations.phoneNo}
            showError={showError}
          /> */}

          <StandardInput
            value={userDetails.password}
            onChange={(e) => updateUserDetails('password', e.target.value)}
            className='mt-3'
            label='Create Password'
            type='password'
            validations={validations.password}
            showError={showError}
          />
        </div>
        <StandardButton
          className='mt-4'
          color='btn-primary'
          bold={true}
          block={true}
          text='Sign up'
          type='submit'
          disabled={btnDisabled}
        />
      </form>
    </div>
  );
}

export default Signup;
