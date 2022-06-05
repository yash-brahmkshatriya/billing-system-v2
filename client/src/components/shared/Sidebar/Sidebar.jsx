import React from 'react';
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarContent,
} from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { Link, matchPath, useLocation } from 'react-router-dom';
import { BILLS, DASHBOARD, NEW_BILL, SINGLE_BILL } from '@/data/routeUrls';
import './sidebar.scss';

const Sidebar = ({ sidebarVisible, toggleSidebar }) => {
  const location = useLocation();
  const BILLS_MATCH =
    matchPath(BILLS, location.pathname) ??
    matchPath(NEW_BILL, location.pathname) ??
    matchPath(SINGLE_BILL, location.pathname) ??
    false;
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
      </SidebarContent>
    </ProSidebar>
  );
};

export default Sidebar;
