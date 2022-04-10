import React, { Component } from 'react';
import './standard-button.scss';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class StandardButton extends Component {
  getStandardButtonClassNames = () => {
    const { disabled, block, color, size, className, bold, border } =
      this.props;
    return classNames('standard-button', 'btn', {
      disabled: disabled,
      'btn-block': block,
      'font-weight-bold': bold,
      'border-less': !border,
      [color]: color,
      [size]: size,
      [className]: className,
    });
  };

  getButtonTextClassName = () => {
    const { textClassName, icon, reversed } = this.props;
    return classNames({
      'ms-2': icon && !reversed,
      'me-2': icon && reversed,
      [textClassName]: textClassName,
    });
  };

  getButtonIconClassName = () => {
    const { iconClassName } = this.props;
    return `${iconClassName ? iconClassName : ''}`;
  };

  getButtonDivClassName = () => {
    const { reversed, divClassName } = this.props;
    return classNames(
      'd-inline-flex',
      'justify-content-center',
      'align-items-center',
      {
        'flex-row-reverse': reversed,
        [divClassName]: divClassName,
      }
    );
  };

  render() {
    const {
      onClick,
      disabled,
      text,
      icon,
      style,
      buttonProps,
      type,
      innerRef,
    } = this.props;
    return (
      <button
        {...buttonProps}
        className={this.getStandardButtonClassNames()}
        type={type}
        onClick={onClick}
        style={style}
        disabled={disabled}
        ref={innerRef ?? null}
      >
        <div className={this.getButtonDivClassName()}>
          {icon ? (
            this.getButtonIconClassName().trim().length > 0 ? (
              <div className={this.getButtonIconClassName()}>{icon}</div>
            ) : (
              icon
            )
          ) : null}
          {text ? (
            this.getButtonTextClassName().trim().length > 0 ? (
              <div className={this.getButtonTextClassName()}>{text}</div>
            ) : (
              text
            )
          ) : null}
        </div>
      </button>
    );
  }
}

StandardButton.propTypes = {
  text: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  block: PropTypes.bool,
  onClick: PropTypes.func,
  color: PropTypes.string,
  size: PropTypes.string,
  bold: PropTypes.bool,
  className: PropTypes.string,
  border: PropTypes.bool,
  reversed: PropTypes.bool,
  style: PropTypes.object,
  type: PropTypes.string,
  buttonProps: PropTypes.object,
};

StandardButton.defaultProps = {
  disabled: false,
  block: false,
  bold: true,
  border: true,
  reversed: false,
  type: 'button',
};

export default StandardButton;
