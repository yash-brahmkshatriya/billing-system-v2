import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function RouteAccessLayer({ passOn, children, fallbackPath }) {
  const location = useLocation();
  return passOn ? (
    children
  ) : (
    <Navigate to={{ pathname: fallbackPath, state: { from: location } }} />
  );
}

export default RouteAccessLayer;
