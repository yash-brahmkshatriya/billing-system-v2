import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useBoolean } from '@/base/hooks';
import { LoginValidation } from '@/validations/LoginValidation';

import StandardInput from '@/components/shared/forms/StandardInput/StandardInput';
import StandardButton from '@/components/shared/forms/StandardButton/StandardButton';

import * as authActions from '@/redux/auth/authActions';

import validationFunctions from '@/utils/validationUtils';
import { DASHBOARD } from '@/data/routeUrls';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState(useSelector((state) => state.auth.email));
  const [password, setPassword] = useState('');
  const [btnDisabled, setBtnDisabled] = useBoolean(false);
  const [showError, setShowError] = useBoolean(false);

  const passwordRef = useRef();

  const validations = LoginValidation;

  useEffect(() => {
    if (email) {
      passwordRef.current?.focus();
    }
  }, [passwordRef]);

  const submit = async (e) => {
    e.preventDefault();

    let data = { email, password };
    if (!validationFunctions.checkFormValidity(data, validations)) {
      setShowError.on();
      return;
    }
    try {
      setBtnDisabled.on();
      let loggedIn = await dispatch(authActions.login(data));
      dispatch(authActions.me());
      if (loggedIn) navigate(DASHBOARD);
    } catch (e) {
      console.error(e);
    } finally {
      setBtnDisabled.off();
    }
  };

  return (
    <div className='d-flex flex-column h-100 p-md-3'>
      <form onSubmit={submit}>
        <div className='my-auto text-center'>
          <img src='/assets/images/logo.png' alt='logo' className='m-auto' />
          <div className='sub-heading'>Login</div>
          <StandardInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='mt-3'
            label='Email'
            type='email'
            placeholder='example@mail.com'
            showError={showError}
            validations={validations.email}
          />
          <div className='hint text-left'>
            Welcome back {email}, Let's get you signed in!
          </div>
          <StandardInput
            value={password}
            innerRef={passwordRef}
            onChange={(e) => setPassword(e.target.value)}
            className='mt-3'
            label='Password'
            type='password'
            showError={showError}
            validations={validations.password}
          />
        </div>
        <StandardButton
          className='mt-4'
          color='btn-primary'
          bold
          block
          text='Log In'
          type='submit'
          disabled={btnDisabled}
        />
      </form>
    </div>
  );
}

export default Login;
