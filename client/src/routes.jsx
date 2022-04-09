import React from 'react';
import { AUTH, DASHBOARD, BILLS } from '@/data/routeUrls';
import { Routes, Route } from 'react-router-dom';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import Bill from './pages/Bill';
import Auth from './pages/Auth';
import RequireAuth from './components/base/RequireAuth';

function AppRoutes() {
  return (
    <Routes>
      <Route path={`${AUTH}/*`} element={<Auth />} />
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
