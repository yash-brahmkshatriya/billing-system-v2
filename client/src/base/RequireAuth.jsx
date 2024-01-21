import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getCookie } from '@/utils/cookieUtils';
import { ACCESS_TOKEN } from '@/data/enums/misc';
import { hasCompanyDetails } from '@/redux/auth/authUtils';
import RouteAccessLayer from './RouteAccessLayer';

export function RequireAuth({ children, redirectTo }) {
  const isAuthenticated = getCookie(ACCESS_TOKEN) ? true : false;
  return (
    <RouteAccessLayer passOn={isAuthenticated} fallbackPath={redirectTo}>
      {children}
    </RouteAccessLayer>
  );
}

export function OnlyPublicAuth({ children, redirectTo }) {
  const isAuthenticated = getCookie(ACCESS_TOKEN) ? true : false;
  return (
    <RouteAccessLayer passOn={!isAuthenticated} fallbackPath={redirectTo}>
      {children}
    </RouteAccessLayer>
  );
}

export function CompanyDetailsFilter({ children, fallbackPath }) {
  const profile = useSelector((state) => state.auth.profile);

  const companyDetailsExists = useMemo(() => {
    return hasCompanyDetails(profile);
  }, [profile]);

  return (
    <RouteAccessLayer passOn={companyDetailsExists} fallbackPath={fallbackPath}>
      {children}
    </RouteAccessLayer>
  );
}
