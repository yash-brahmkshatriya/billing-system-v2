import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { AUTH, LOGIN, SIGNUP } from '@/data/routeUrls';
import Login from '@/components/auth/Login';
import Signup from '@/components/auth/Signup';
import GetEmail from '@/components/auth/GetEmail';
import AuthSideInfo from '@/components/shared/AuthSideInfo/AuthSideInfo';

const RELATIVE_LOGIN = LOGIN.replace(AUTH, '');
const RELATIVE_SIGNUP = SIGNUP.replace(AUTH, '');

const Auth = () => {
  return (
    <div className='container-fluid h-100'>
      <div className='row h-100'>
        <div className='col-12 col-md-6 col-lg-5'>
          <div className='row my-auto h-100'>
            <div className='px-5 px-md-3 col-12 col-md-8 offset-md-2 my-auto'>
              <Routes>
                <Route index element={<GetEmail />} />
                <Route path={RELATIVE_LOGIN} element={<Login />} />
                <Route path={RELATIVE_SIGNUP} element={<Signup />} />
                <Route path='*' element={<GetEmail />} />
              </Routes>
            </div>
          </div>
        </div>
        <div className='col-md-6 col-lg-7 px-0 d-md-block d-none'>
          <Routes>
            <Route
              index
              element={
                <AuthSideInfo
                  img='/assets/images/get_email.svg'
                  heading='One Stop for your Billing needs!'
                />
              }
            />
            <Route
              path={RELATIVE_LOGIN}
              element={<AuthSideInfo img='/assets/images/login.svg' />}
            />
            <Route
              path={RELATIVE_SIGNUP}
              element={<AuthSideInfo img='/assets/images/sign_up.svg' />}
            />
            <Route path='*' element={<AuthSideInfo />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Auth;
