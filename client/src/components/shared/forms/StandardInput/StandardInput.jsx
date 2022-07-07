import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import validationUtils from '@/utils/validationUtils';
import './standard-input.scss';

class StandardInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputId: this.props.id,
      valid: false,
      errorText: '',
      dirty: false,
      showPassword: false,
    };
  }
  componentDidMount() {
    this.checkValidity(this.props.value);
  }

  getStandardInputClasses() {
    const { disabled, className } = this.props;
    return classNames('standard-input', 'position-relative', {
      disabled: disabled,
      [className]: className,
      error: (this.state.dirty || this.props.showError) && !this.state.valid,
    });
  }

  getInputClassName = () => {
    const { inputClasses } = this.props;
    return classNames('form-control', {
      error: (this.state.dirty && !this.state.valid) || this.props.showError,
      [inputClasses]: inputClasses,
      'has-feedback': this.props.type === 'password',
      'after-icon': this.props.afterIcon,
    });
  };

  renderLabel = () => {
    const { inputId } = this.state;
    const { label } = this.props;

    if (label) {
      return <label htmlFor={inputId}>{label}</label>;
    }
    return null;
  };

  renderHelp = () => {
    const { helpText } = this.props;

    if (helpText) {
      return <p className='help-text mb-0 mt-2'>{helpText}</p>;
    }
    return null;
  };

  renderError = () => {
    const { errorText } = this.state;
    if (errorText && (this.state.dirty || this.props.showError)) {
      return <p className='error-text mb-0 mt-2'>{errorText}</p>;
    }
    return null;
  };

  checkValidity = (value) => {
    let { isValid, errorText } = validationUtils.checkFieldValidity(
      value,
      this.props.validations ?? []
    );

    this.setState({
      valid: isValid,
      errorText: errorText,
    });
  };

  checkCustomValidity = (e) => {
    if (this.props.checkValidity) {
      const { isValid, errorText } = this.props.checkValidity(e.target.value);
      this.setState({
        valid: isValid,
        errorText: errorText,
      });
    }
  };

  toggleShowPassword = () => {
    this.setState((state, props) => ({
      showPassword: !state.showPassword,
    }));
  };

  getPasswordIcon = () => {
    return this.state.showPassword ? 'visibility_off' : 'visibility';
  };

  onBlur = () => {
    this.setState({
      dirty: true,
    });
  };

  onChange = (e) => {
    if (this.props.overloadValidity) {
      this.checkCustomValidity(e);
    } else {
      this.checkValidity(e.target.value);
      this.checkCustomValidity(e);
    }
    this.props.onChange(e);
  };

  render() {
    const { inputId, showPassword } = this.state;
    const { placeholder, disabled, value, type, innerRef } = this.props;

    return (
      <div className={this.getStandardInputClasses()}>
        {this.renderLabel()}
        <input
          {...this.props.inputProps}
          type={showPassword ? 'text' : type}
          className={this.getInputClassName()}
          id={inputId}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={this.onChange}
          formNoValidate={false}
          onPaste={this.props.onPaste}
          ref={innerRef ?? null}
          onBlur={this.onBlur}
        />
        {this.props.icon ? (
          <label className='icon-text' htmlFor={inputId}>
            {this.props.icon}
          </label>
        ) : null}

        {this.props.afterIcon ? (
          <label className='icon-text after' htmlFor={inputId}>
            {this.props.afterIcon}
          </label>
        ) : null}

        {this.props.type === 'password' ? (
          <div className='icon' onClick={this.toggleShowPassword}>
            <span className='material-icons'>{this.getPasswordIcon()}</span>
          </div>
        ) : null}

        {this.state.valid ? this.renderHelp() : this.renderError()}
      </div>
    );
  }
}

StandardInput.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  helpText: PropTypes.string,
  errorText: PropTypes.string,
  error: PropTypes.bool,
  innerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
  checkValidity: PropTypes.func,
  inputProps: PropTypes.object,
  overloadValidity: PropTypes.bool,
};

StandardInput.defaultProps = {
  type: 'text',
  disabled: false,
  error: false,
  placeholder: '',
  value: '',
  overloadValidity: false,
  inputProps: {},
};

export default StandardInput;
