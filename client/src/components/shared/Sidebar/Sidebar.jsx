import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarContent,
} from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { Link, matchPath, useLocation, useNavigate } from 'react-router-dom';
import {
  BILLS,
  DASHBOARD,
  NEW_BILL,
  SINGLE_BILL,
  AUTH,
} from '@/data/routeUrls';
import * as authActions from '@/redux/auth/authActions';
import './sidebar.scss';
import StandardButton from '../forms/StandardButton/StandardButton';

const Sidebar = ({ sidebarVisible, toggleSidebar }) => {
  const dispatch = useDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const BILLS_MATCH = useMemo(() => {
    return (
      matchPath(BILLS, location.pathname) ??
      matchPath(NEW_BILL, location.pathname) ??
      matchPath(SINGLE_BILL, location.pathname) ??
      false
    );
  }, [BILLS, NEW_BILL, SINGLE_BILL, location.pathname]);
  return (
    <ProSidebar
      breakPoint='md'
      toggled={sidebarVisible}
      onToggle={toggleSidebar.toggle}
    >
      <SidebarHeader className='text-center'>
        <Link to={DASHBOARD}>
          <img src='/assets/images/logo.png' alt='logo' className='m-auto' />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <Menu className='flex-fill'>
          <MenuItem active={matchPath(DASHBOARD, location.pathname)}>
            <Link to={DASHBOARD}>Dashboard</Link>
          </MenuItem>
          <MenuItem active={BILLS_MATCH}>
            <Link to={BILLS}>Bills</Link>
          </MenuItem>
        </Menu>
        <StandardButton
          text='Logout'
          color='btn-primary'
          onClick={() => {
            dispatch(authActions.logout());
            navigate(AUTH);
          }}
          className='logout-btn'
        />
      </SidebarContent>
    </ProSidebar>
  );
};

export default Sidebar;
