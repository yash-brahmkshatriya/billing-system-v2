import React, { useEffect, useState } from 'react';
import { AUTH, DASHBOARD, BILLS, COMPANY_DETAILS } from '@/data/routeUrls';
import { Routes, Route } from 'react-router-dom';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import Bill from './pages/Bill';
import Auth from './pages/Auth';
import { RequireAuth, OnlyPublicAuth } from './base/RequireAuth';
import CompanyDetails from './pages/CompanyDetails';
import { useDispatch } from 'react-redux';

import * as authActions from '@/redux/auth/authActions';
import Loading from './base/Loading/Loading';

function AppRoutes() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  useEffect(async () => {
    await dispatch(authActions.me());
    setLoading(false);
  }, []);

  if (loading) return <Loading />;
  return (
    <Routes>
      <Route
        path={`${AUTH}/*`}
        element={
          <OnlyPublicAuth redirectTo={DASHBOARD}>
            <Auth />
          </OnlyPublicAuth>
        }
      />
      <Route
        path={COMPANY_DETAILS}
        element={
          <RequireAuth redirectTo={AUTH}>
            <CompanyDetails />
          </RequireAuth>
        }
      />
      <Route
        path={DASHBOARD}
        element={
          <RequireAuth redirectTo={AUTH}>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path={`${BILLS}/*`}
        element={
          <RequireAuth redirectTo={AUTH}>
            <Bill />
          </RequireAuth>
        }
      />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
