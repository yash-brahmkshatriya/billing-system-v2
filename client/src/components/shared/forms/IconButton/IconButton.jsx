import classNames from 'classnames';
import React from 'react';
import './icon-button.scss';

const IconButton = ({ Icon, onClick, iconProps, buttonClassName }) => {
  return (
    <button
      className={classNames('icon-button', buttonClassName)}
      onClick={onClick}
    >
      <Icon {...iconProps} />
    </button>
  );
};

export default IconButton;
