import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { AUTH, LOGIN, SIGNUP } from '@/data/routeUrls';
import Login from '@/components/auth/Login';
import Signup from '@/components/auth/Signup';
import GetEmail from '@/components/auth/GetEmail';

const RELATIVE_LOGIN = LOGIN.replace(AUTH, '');
const RELATIVE_SIGNUP = SIGNUP.replace(AUTH, '');

const Auth = () => {
  return (
    <Routes>
      <Route index element={<GetEmail />} />
      <Route path={RELATIVE_LOGIN} element={<Login />} />
      <Route path={RELATIVE_SIGNUP} element={<Signup />} />
      <Route path='*' element={<GetEmail />} />
    </Routes>
  );
};

export default Auth;
