import React from 'react';
import { Link } from 'react-router-dom';
import { List } from 'react-bootstrap-icons';
import Sidebar from '@/components/shared/Sidebar/Sidebar';

import './app-layout.scss';
import { DASHBOARD } from '@/data/routeUrls';
import { colors } from '@/data/colors';
import { useToggle } from '@/base/hooks';
import IconButton from '@/components/shared/forms/IconButton/IconButton';

const AppLayout = ({ children }) => {
  const [sidebarVisible, toggleSidebar] = useToggle(false);

  return (
    <div className='d-flex h-100 w-100 app-layout'>
      <Sidebar sidebarVisible={sidebarVisible} toggleSidebar={toggleSidebar} />
      <div className='content flex-fill '>
        <header className='header px-2 py-1'>
          <IconButton
            Icon={List}
            iconProps={{ color: colors.primary }}
            onClick={toggleSidebar.toggle}
          />
          <Link to={DASHBOARD} className='flex-fill text-center'>
            <img src='/assets/images/logo.png' alt='logo' height='50px' />
          </Link>
        </header>
        <div className='p-2 p-md-3 p-lg-4'>{children}</div>
      </div>
    </div>
  );
};

export default AppLayout;
