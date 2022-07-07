import classNames from 'classnames';
import React from 'react';
import './icon-button.scss';

const IconButton = ({
  Icon,
  onClick,
  iconProps,
  buttonClassName,
  buttonProps,
}) => {
  return (
    <button
      {...buttonProps}
      className={classNames('icon-button', buttonClassName)}
      onClick={onClick}
    >
      <Icon {...iconProps} />
    </button>
  );
};

export default IconButton;
