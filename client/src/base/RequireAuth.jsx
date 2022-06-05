import { getCookie } from '@/utils/cookieUtils';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ACCESS_TOKEN } from '@/data/enums/misc';

export function RequireAuth({ children, redirectTo }) {
  const isAuthenticated = getCookie(ACCESS_TOKEN) ? true : false;
  const location = useLocation();
  return isAuthenticated ? (
    children
  ) : (
    <Navigate to={{ pathname: redirectTo, state: { from: location } }} />
  );
}

export function OnlyPublicAuth({ children, redirectTo }) {
  const isAuthenticated = getCookie(ACCESS_TOKEN) ? true : false;
  const location = useLocation();
  return !isAuthenticated ? (
    children
  ) : (
    <Navigate to={{ pathname: redirectTo, state: { from: location } }} />
  );
}
