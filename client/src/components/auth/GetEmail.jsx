import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useBoolean } from '@/base/hooks';

import validationFunctions from '@/utils/validationUtils';

import StandardButton from '@/components/shared/forms/StandardButton/StandardButton';
import StandardInput from '@/components/shared/forms/StandardInput/StandardInput';

import * as authActions from '@/redux/auth/authActions';

import { GetEmailValidation } from '@/validations/GetEmailValidation';

import { LOGIN, SIGNUP } from '@/data/routeUrls';

const GetEmail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState(useSelector((state) => state.auth.email));
  const [btnDisabled, setBtnDisabled] = useBoolean(false);
  const [showError, setShowError] = useBoolean(false);

  const submit = async (e) => {
    e.preventDefault();
    let data = { email };
    if (!validationFunctions.checkFormValidity(data, GetEmailValidation)) {
      setShowError.on();
      return;
    }
    try {
      setBtnDisabled.on();
      let emailExists = await dispatch(authActions.checkEmail(data));
      if (emailExists) {
        navigate(LOGIN);
      } else navigate(SIGNUP);
    } catch (e) {
    } finally {
      setBtnDisabled.off();
    }
  };

  return (
    <div className='d-flex h-100'>
      <form onSubmit={submit}>
        <div className='m-auto text-center'>
          <img src='/assets/images/logo.png' alt='logo' className='m-auto' />
          <div className='sub-heading mb-4'>
            Login or Sign Up with your email
          </div>
          <StandardInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label='Email'
            placeholder='example@mail.com'
            className='mb-3'
            validations={GetEmailValidation.email}
            showError={showError}
          />
          <div className='hint text-left'>
            Type in your email to get started! If you already have an account
            we'll get you signed in, if you're new, we'll help you get set up!
          </div>
        </div>
        <div className='mt-3'>
          <StandardButton color='btn-primary' block text='Next' type='submit' />
        </div>
      </form>
    </div>
  );
};

export default GetEmail;
