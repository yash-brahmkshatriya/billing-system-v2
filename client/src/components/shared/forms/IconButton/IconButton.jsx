import React from 'react';
import './icon-button.scss';

const IconButton = ({ Icon, onClick, iconProps }) => {
  return (
    <button className='icon-button' onClick={onClick}>
      <Icon {...iconProps} />
    </button>
  );
};

export default IconButton;
