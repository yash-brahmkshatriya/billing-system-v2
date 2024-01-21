import React, { useEffect, useState } from 'react';
import {
  AUTH,
  DASHBOARD,
  BILLS,
  COMPANY_DETAILS,
  UPDATE_PASSWORD,
  UPDATE_PROFILE,
} from '@/data/routeUrls';
import { useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';

// Pages
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import Bill from './pages/Bill';
import Auth from './pages/Auth';
import {
  RequireAuth,
  OnlyPublicAuth,
  CompanyDetailsFilter,
} from './base/RequireAuth';
import CompanyDetails from './pages/CompanyDetails';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import UpdateProfilePage from './pages/UpdateProfile';

import * as authActions from '@/redux/auth/authActions';
import Loading from './base/Loading/Loading';

function AppRoutes() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  useEffect(async () => {
    setLoading(true);
    try {
      await dispatch(authActions.me());
    } catch (err) {
      dispatch(authActions.logout());
    } finally {
      setLoading(false);
    }
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
            <CompanyDetailsFilter fallbackPath={COMPANY_DETAILS}>
              <Dashboard />
            </CompanyDetailsFilter>
          </RequireAuth>
        }
      />
      <Route
        path={`${BILLS}/*`}
        element={
          <RequireAuth redirectTo={AUTH}>
            <CompanyDetailsFilter fallbackPath={COMPANY_DETAILS}>
              <Bill />
            </CompanyDetailsFilter>
          </RequireAuth>
        }
      />
      <Route
        path={`${UPDATE_PASSWORD}`}
        element={
          <RequireAuth redirectTo={AUTH}>
            <UpdatePasswordPage />
          </RequireAuth>
        }
      />
      <Route
        path={`${UPDATE_PROFILE}`}
        element={
          <RequireAuth redirectTo={AUTH}>
            <UpdateProfilePage />
          </RequireAuth>
        }
      />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
